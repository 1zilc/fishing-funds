import { app, BrowserWindow } from 'electron';
import { getPreloadPath, resolveHtmlPath } from './util';

export function createChildWindow(config: { path: string; parentId: number }) {
  const index = resolveHtmlPath('index.html') + config.path;
  const parent = BrowserWindow.fromId(config.parentId);
  if (parent) {
    const [width, height] = parent.getSize();
    const win = new BrowserWindow({
      width,
      height,
      backgroundColor: '#fff',
      minHeight: 400,
      minWidth: 300,
      maxHeight: 1000,
      maxWidth: 600,
      webPreferences: {
        webviewTag: true,
        devTools: !app.isPackaged,
        preload: getPreloadPath(),
      },
    });
    if (process.env.NODE_ENV === 'development') {
      win.loadURL(index);
    } else {
      win.loadFile(index);
    }
    return win;
  }
}
