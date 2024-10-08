import windowStateKeeper from 'electron-window-state';
import { menubar } from 'menubar';
import { app, Tray } from 'electron';
import { resolveHtmlPath, getPreloadPath } from './util';

export function createMenubar({ tray, mainWindowState }: { tray: Tray; mainWindowState: windowStateKeeper.State }) {
  return menubar({
    index: resolveHtmlPath(),
    tray,
    tooltip: app.getName(),
    preloadWindow: true,
    showOnAllWorkspaces: true,
    // showDockIcon: false,

    browserWindow: {
      backgroundColor: process.platform === 'darwin' ? 'rgba(0, 0, 0, 0)' : '#fff',
      width: mainWindowState.width,
      height: mainWindowState.height,

      minHeight: 400,
      minWidth: 300,
      maxWidth: 800,
      vibrancy: 'sidebar',
      visualEffectState: 'active',
      webPreferences: {
        webviewTag: true,
        devTools: !app.isPackaged,
        preload: getPreloadPath(),
        spellcheck: false,
      },
    },
  });
}
