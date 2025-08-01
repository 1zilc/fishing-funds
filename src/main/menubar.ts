import windowStateKeeper from 'electron-window-state';
import { menubar } from 'menubar';
import { app, Tray } from 'electron';
import { resolveHtmlPath, getPreloadPath, isSupportBlurBg } from './util';

export function createMenubar({ tray, mainWindowState }: { tray: Tray; mainWindowState: windowStateKeeper.State }) {
  return menubar({
    index: resolveHtmlPath(),
    tray,
    tooltip: app.getName(),
    preloadWindow: true,
    showOnAllWorkspaces: true,
    // showDockIcon: false,

    browserWindow: {
      backgroundColor: isSupportBlurBg() ? 'rgba(0, 0, 0, 0)' : '#fff',
      width: mainWindowState.width,
      height: mainWindowState.height,

      minHeight: 400,
      minWidth: 300,
      vibrancy: 'sidebar',
      visualEffectState: 'active',
      backgroundMaterial: 'tabbed',

      webPreferences: {
        webviewTag: true,
        devTools: !app.isPackaged,
        preload: getPreloadPath(),
        spellcheck: false,
        scrollBounce: true,
      },
    },
  });
}
