import { app, BrowserWindow } from 'electron';
import { getPreloadPath, resolveHtmlPath } from './util';

const { productName } = require('../../release/app/package.json');

export function createChildWindow(config: { search: string; parentId: number }) {
  const index = resolveHtmlPath() + config.search;
  const parent = BrowserWindow.fromId(config.parentId);
  if (parent) {
    const [width, height] = parent.getSize();
    const win = new BrowserWindow({
      width,
      height,
      title: productName,
      backgroundColor: process.platform === 'darwin' ? 'rgba(0, 0, 0, 0)' : '#fff',
      minHeight: 400,
      minWidth: 300,
      vibrancy: 'sidebar',
      fullscreenable: false,
      webPreferences: {
        nodeIntegrationInWorker: true,
        webviewTag: true,
        devTools: !app.isPackaged,
        preload: getPreloadPath(),
      },
    });
    win.loadURL(index);
    return win;
  }
}
