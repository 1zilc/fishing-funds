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

export function buildContextMenu(
  { mb, appUpdater }: { mb: Menubar; appUpdater: AppUpdater },
  waleltsMenuItem: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[]
) {
  return Menu.buildFromTemplate([
    {
      role: 'about',
      label: '关于 Fishing Funds',
    },
    {
      click: () => {
        appUpdater.checkUpdate('mainer');
      },
      label: '检查更新',
    },
    {
      click: () => {
        shell.openExternal('https://github.com/1zilc/fishing-funds/issues');
      },
      label: '帮助',
    },
    { type: 'separator' },
    {
      click: () => {
        sendMessageToRenderer(mb.window, 'clipboard-funds-import');
      },
      label: '录入基金JSON配置',
    },
    {
      click: () => {
        sendMessageToRenderer(mb.window, 'clipboard-funds-copy');
      },
      label: '复制基金JSON配置',
    },
    { type: 'separator' },
    {
      click: () => {
        sendMessageToRenderer(mb.window, 'backup-all-config-import');
      },
      label: '导入全局配置',
    },
    {
      click: () => {
        sendMessageToRenderer(mb.window, 'backup-all-config-export');
      },
      label: '导出全局配置',
    },
    { type: 'separator' },
    ...waleltsMenuItem,
    { type: 'separator' },
    { role: 'quit', label: '退出' },
  ]);
}
