import windowStateKeeper from 'electron-window-state';
import { menubar, Menubar } from 'menubar';
import { app, Tray, Menu, shell } from 'electron';
import AppUpdater from './autoUpdater';
import { resolveHtmlPath, sendMessageToRenderer, getPreloadPath } from './util';

const { productName } = require('../../release/app/package.json');

export function createMenubar({ tray, mainWindowState }: { tray: Tray; mainWindowState: windowStateKeeper.State }) {
  return menubar({
    index: resolveHtmlPath(),
    tray,
    tooltip: productName,
    preloadWindow: true,
    showOnAllWorkspaces: true,
    // showDockIcon: false,

    browserWindow: {
      backgroundColor: process.platform === 'darwin' ? 'rgba(0, 0, 0, 0)' : '#fff',
      width: mainWindowState.width,
      height: mainWindowState.height,

      minHeight: 400,
      minWidth: 300,
      maxHeight: 1000,
      maxWidth: 600,
      vibrancy: 'sidebar',
      webPreferences: {
        webviewTag: true,
        devTools: !app.isPackaged,
        preload: getPreloadPath(),
      },
    },
  });
}
