import path from 'path';
import windowStateKeeper from 'electron-window-state';
import { menubar, Menubar } from 'menubar';
import { app, Tray, Menu } from 'electron';
import AppUpdater from './autoUpdater';
import { resolveHtmlPath, sendMessageToRenderer } from './util';

export function createMenubar({ tray, mainWindowState }: { tray: Tray; mainWindowState: windowStateKeeper.State }) {
  return menubar({
    index: resolveHtmlPath('index.html'),
    tray,
    tooltip: 'Fishing Funds',
    preloadWindow: true,
    showOnAllWorkspaces: true,
    // showDockIcon: false,

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
        nodeIntegration: false,
        webviewTag: true,
        devTools: !app.isPackaged,
        preload: path.join(__dirname, 'preload.js'),
        nativeWindowOpen: false,
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
        sendMessageToRenderer(mb, 'clipboard-funds-import');
      },
      label: '录入基金JSON配置',
    },
    {
      click: () => {
        sendMessageToRenderer(mb, 'clipboard-funds-copy');
      },
      label: '复制基金JSON配置',
    },
    { type: 'separator' },
    {
      click: () => {
        sendMessageToRenderer(mb, 'backup-all-config-import');
      },
      label: '导入全局配置',
    },
    {
      click: () => {
        sendMessageToRenderer(mb, 'backup-all-config-export');
      },
      label: '导出全局配置',
    },
    { type: 'separator' },
    // { label: '默认钱包 +980.12', type: 'radio', icon: generateWalletIcon(0), sublabel: '123' },
    // { label: '钱包1 +128.50', icon: generateWalletIcon(2) },
    // { label: '钱包2 +128.50', icon: generateWalletIcon(3) },
    // { label: '钱包3 +128.50', icon: generateWalletIcon(4) },
    ...waleltsMenuItem,
    { type: 'separator' },
    { role: 'quit', label: '退出' },
  ]);
}
