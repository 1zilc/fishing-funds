import { app, BrowserWindow } from 'electron';
import { getPreloadPath, resolveHtmlPath } from './util';

export function createChildWindow(config: { search: string; parentId: number }) {
  const index = resolveHtmlPath() + config.search;
  const parent = BrowserWindow.fromId(config.parentId);
  if (parent) {
    const [width, height] = parent.getSize();
    const win = new BrowserWindow({
      width,
      height,
      backgroundColor: process.platform === 'darwin' ? 'rgba(0, 0, 0, 0)' : '#fff',
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
    win.loadURL(index);
    if (process.platform === 'darwin') {
      win.setVibrancy('sidebar');
    }
    return win;
  }
}
