/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */

import { app, globalShortcut, ipcMain, nativeTheme, dialog } from 'electron';
import windowStateKeeper from 'electron-window-state';
import AppUpdater from './autoUpdater';
import { appIcon, generateWalletIcon } from './icon';
import { createTray } from './tray';
import { createMenubar, buildContextMenu } from './menubar';
import { lockSingleInstance, checkEnvTool } from './util';

async function init() {
  lockSingleInstance();
  await app.whenReady();
  await checkEnvTool();
  main();
}

function main() {
  const tray = createTray();
  const mainWindowState = windowStateKeeper({ defaultWidth: 300, defaultHeight: 550 });
  const mb = createMenubar({ tray, mainWindowState });
  const appUpdater = new AppUpdater({ icon: appIcon, win: mb.window });
  let contextMenu = buildContextMenu({ mb, appUpdater }, []);
  mb.app.commandLine.appendSwitch('disable-backgrounding-occluded-windows', 'true');
  // app 相关监听
  app.on('window-all-closed', function () {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  app.on('browser-window-focus', function () {
    if (app.isPackaged) {
      globalShortcut.register('CommandOrControl+Shift+R', () => {
        console.log('CommandOrControl+Shift+R is pressed: Shortcut Disabled');
      });
      globalShortcut.register('CommandOrControl+R', () => {
        console.log('CommandOrControl+R is pressed: Shortcut Disabled');
      });
      globalShortcut.register('F5', () => {
        console.log('F5 is pressed: Shortcut Disabled');
      });
    }
  });
  app.on('browser-window-blur', function () {
    if (app.isPackaged) {
      globalShortcut.unregister('CommandOrControl+R');
      globalShortcut.unregister('F5');
      globalShortcut.unregister('CommandOrControl+Shift+R');
    }
  });
  app.on('second-instance', function (event, argv, cwd) {
    // Someone tried to run a second instance, we should focus our window.
    if (mb.window) {
      if (mb.window.isMinimized()) mb.window.restore();
      mb.window.focus();
    }
  });
  // ipcMain 主进程相关监听
  ipcMain.handle('show-message-box', async (event, config) => {
    return dialog.showMessageBox(config);
  });
  ipcMain.handle('show-save-dialog', async (event, config) => {
    return dialog.showSaveDialog(config);
  });
  ipcMain.handle('show-open-dialog', async (event, config) => {
    return dialog.showOpenDialog(config);
  });
  ipcMain.handle('show-current-window', (event, config) => {
    mb.window?.show();
  });
  ipcMain.handle('get-should-use-dark-colors', (event, config) => {
    return nativeTheme.shouldUseDarkColors;
  });
  ipcMain.handle('set-native-theme-source', (event, config) => {
    nativeTheme.themeSource = config;
  });
  ipcMain.handle('set-login-item-settings', (event, config) => {
    app.setLoginItemSettings(config);
  });
  ipcMain.handle('app-quit', (event, config) => {
    app.quit();
  });
  ipcMain.handle('set-tray-content', (event, config) => {
    tray.setTitle(config);
  });
  ipcMain.handle('check-update', (event) => {
    if (app.isPackaged) {
      appUpdater.checkUpdate('renderer');
    }
  });
  ipcMain.handle('update-tray-context-menu-wallets', (event, config) => {
    const menus = config.map((item: any) => ({
      ...item,
      icon: generateWalletIcon(item.iconIndex),
      click: () => mb.window?.webContents.send('change-current-wallet-code', item.id),
    }));
    contextMenu = buildContextMenu({ mb, appUpdater }, menus);
  });
  // menubar 相关监听
  mb.on('after-create-window', () => {
    // 打开开发者工具
    if (!app.isPackaged) {
      mb.window!.webContents.openDevTools({ mode: 'undocked' });
    }
    // 右键菜单
    tray.on('right-click', () => {
      mb.tray.popUpContextMenu(contextMenu);
    });
    // 监听主题颜色变化
    nativeTheme.on('updated', () => {
      mb.window?.webContents.send('nativeTheme-updated', {
        darkMode: nativeTheme.shouldUseDarkColors,
      });
    });
    // 存储窗口大小
    mainWindowState.manage(mb.window!);
    // 检查更新
    appUpdater.checkUpdate('renderer');
    app.dock.hide();
  });
  mb.on('ready', () => {
    // mb.window?.setVisibleOnAllWorkspaces(true);
  });
  // new AppUpdater({ icon: nativeIcon, win: mb.window });
}

init().catch(console.log);
