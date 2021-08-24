import path from 'path';
import windowStateKeeper from 'electron-window-state';
import { menubar, Menubar } from 'menubar';
import { app, Tray, Menu } from 'electron';
import AppUpdater from './autoUpdater';
import { resolveHtmlPath } from './util';

export function createMenubar({ tray, mainWindowState }: { tray: Tray; mainWindowState: windowStateKeeper.State }) {
  return menubar({
    index: resolveHtmlPath('index.html'),
    tray,
    tooltip: 'Fishing Funds',
    preloadWindow: true,
    showOnAllWorkspaces: false,
    showDockIcon: false,

    browserWindow: {
      backgroundColor: '#fff',
      width: mainWindowState.width,
      height: mainWindowState.height,
      minHeight: 400,
      minWidth: 300,
      maxHeight: 1000,
      maxWidth: 600,
      webPreferences: {
        contextIsolation: true,
        enableRemoteModule: false,
        nodeIntegration: false,
        devTools: !app.isPackaged,
        webviewTag: true,
        preload: path.join(__dirname, 'preload.js'),
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
    { type: 'separator' },
    {
      click: () => {
        mb.window?.webContents.send('clipboard-funds-import');
      },
      label: '录入基金JSON配置',
    },
    {
      click: () => {
        mb.window?.webContents.send('clipboard-funds-copy');
      },
      label: '复制基金JSON配置',
    },
    { type: 'separator' },
    {
      click: () => {},
      label: '导入全局配置',
    },
    {
      click: () => {},
      label: '导出全局配置',
    },
    { type: 'separator' },
    ...waleltsMenuItem,
    { type: 'separator' },
    { role: 'quit', label: '退出' },
  ]);
}
