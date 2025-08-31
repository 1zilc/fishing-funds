import url from 'url';
import {
  app,
  globalShortcut,
  ipcMain,
  nativeImage,
  nativeTheme,
  clipboard,
  dialog,
  webContents,
  shell,
  BrowserWindow,
} from 'electron';

import windowStateKeeper from 'electron-window-state';
import { Menubar } from 'menubar';
import AppUpdater from './autoUpdater';
import { createTray } from './tray';
import { createMenubar } from './menubar';
import TouchBarManager from './touchbar';
import LocalStore from './store';
import { createChildWindow } from './childWindow';
import { ProxyManager } from './proxy';
import HotkeyManager from './hotkey';
import ContextMenuManager from './contextMenu';
import { saveImage, saveJsonToCsv, saveString, readStringFile, readFile } from './io';
import {
  lockSingleInstance,
  checkEnvTool,
  sendMessageToRenderer,
  setNativeTheme,
  getOtherWindows,
  makeFakeUA,
  isSupportBlurBg,
} from './util';
import HttpClient from './httpClient';
// import { TesseractOCR } from './ocr';
import * as Enums from '../renderer/utils/enums';

let mb: Menubar;
let openBackupFilePath = '';
let ua = '';
let fakeUA = '';
let proxyMode = '';

// FIXME: 部分库缺少对ESM的支持
global.__filename = url.fileURLToPath(import.meta.url);
global.__dirname = url.fileURLToPath(new URL('.', import.meta.url));

async function init() {
  // 单例
  lockSingleInstance();
  await app.whenReady();
  await checkEnvTool();
  appEmits();
  main();
}

function appEmits() {
  // app 相关监听
  app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  app.on('browser-window-focus', () => {
    if (app.isPackaged) {
      globalShortcut.register('CommandOrControl+Shift+R', () => {});
      globalShortcut.register('CommandOrControl+R', () => {});
      globalShortcut.register('F5', () => {});
    }
  });
  app.on('browser-window-blur', () => {
    if (app.isPackaged) {
      globalShortcut.unregister('CommandOrControl+R');
      globalShortcut.unregister('F5');
      globalShortcut.unregister('CommandOrControl+Shift+R');
    }
  });
  app.on('second-instance', (event, argv, cwd) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mb.window) {
      if (mb.window.isMinimized()) mb.window.restore();
      mb.window.focus();
    }
  });
  app.on('open-file', (even, path: string) => {
    if (mb?.window) {
      sendMessageToRenderer(mb.window, 'open-backup-file', path);
    } else {
      openBackupFilePath = path;
    }
  });
  app.on('will-quit', () => {
    // Unregister all shortcuts.
    globalShortcut.unregisterAll();
  });
}

function main() {
  const localStore = new LocalStore();
  const tray = createTray();
  const mainWindowState = windowStateKeeper({
    defaultWidth: 325,
    defaultHeight: 768,
    maximize: false,
    fullScreen: false,
  });
  mb = createMenubar({ tray, mainWindowState });
  const appUpdater = new AppUpdater({ mb });
  const touchBarManager = new TouchBarManager([], mb);
  const contextMenuManager = new ContextMenuManager({ mb, updater: appUpdater });
  const proxyManager = new ProxyManager();
  // const tesseractOCR = new TesseractOCR();
  let windowIds: number[] = [];
  const defaultTheme = localStore.get(
    'config',
    'SYSTEM_SETTING.systemThemeSetting',
    Enums.SystemThemeType.Auto
  ) as Enums.SystemThemeType;
  // mb.app.commandLine.appendSwitch('disable-backgrounding-occluded-windows', 'true');
  // ipcMain 主进程相关监听
  ipcMain.handle('show-message-box', (event, config) => {
    return dialog.showMessageBox(config);
  });
  ipcMain.handle('show-save-dialog', (event, config) => {
    return dialog.showSaveDialog(config);
  });
  ipcMain.handle('show-open-dialog', (event, config) => {
    return dialog.showOpenDialog(config);
  });
  ipcMain.handle('show-current-window', (event, config) => {
    mb.window?.show();
  });
  ipcMain.handle('get-should-use-dark-colors', (event, config) => {
    return nativeTheme.shouldUseDarkColors;
  });
  ipcMain.handle('set-native-theme-source', (event, config) => {
    setNativeTheme(config);
  });
  ipcMain.handle('set-login-item-settings', (event, config) => {
    app.setLoginItemSettings(config);
  });
  ipcMain.handle('app-quit', (event, config) => {
    app.quit();
  });
  ipcMain.handle('app-relaunch', (event, config) => {
    app.relaunch();
    app.exit();
  });
  ipcMain.handle('set-tray-content', (event, config) => {
    tray.setTitle(config);
  });
  ipcMain.handle('check-update', (event) => {
    appUpdater.checkUpdate('renderer');
  });
  ipcMain.handle('shell-openExternal', (event, config) => {
    shell.openExternal(config);
  });
  ipcMain.handle('set-menubar-visible', (event, config) => {
    if (config) {
      mb.showWindow();
    } else {
      mb.hideWindow();
    }
  });
  // store相关
  ipcMain.handle('get-storage-config', (event, config) => {
    return localStore.get(config.type, config.key, config.init);
  });
  ipcMain.handle('set-storage-config', (event, config) => {
    localStore.set(config.type, config.key, config.value);
  });
  ipcMain.handle('delete-storage-config', (event, config) => {
    localStore.delete(config.type, config.key);
  });
  ipcMain.handle('cover-storage-config', (event, config) => {
    localStore.cover(config.type, config.value);
  });
  ipcMain.handle('all-storage-config', (event, config) => {
    return localStore.getStore(config.type);
  });
  ipcMain.handle('registry-webview', (event, config) => {
    const contents = webContents.fromId(config)!;
    const win = BrowserWindow.fromWebContents(contents);
    contents.setWindowOpenHandler(({ url }) => {
      sendMessageToRenderer(win, 'webview-new-window', url);
      return { action: 'deny' };
    });
  });
  ipcMain.handle('set-proxy', async (event, config) => {
    await event.sender.session.setProxy(config);
    const proxyConent = await event.sender.session.resolveProxy('localhost');
    proxyManager.updateAgentByParseProxyContent(proxyConent);
    proxyMode = config.mode;
  });
  ipcMain.handle('get-fakeUA', (event, config) => {
    return fakeUA;
  });
  ipcMain.handle('update-tray-context-menu-wallets', (event, config) => {
    contextMenuManager.updateWalletMenu(config);
  });
  ipcMain.handle('get-version', (event, config) => {
    return app.getVersion();
  });
  ipcMain.handle('is-support-blur-bg', (event) => {
    return isSupportBlurBg();
  });
  ipcMain.handle('set-opacity', (event, config) => {
    getOtherWindows(windowIds).forEach((win) => {
      win?.setOpacity(config);
    });
  });
  ipcMain.handle('set-alwaysOnTop', (event, config) => {
    getOtherWindows(windowIds).forEach((win) => {
      win?.setAlwaysOnTop(config);
    });
  });
  // touchbar 相关监听
  ipcMain.handle('update-touchbar-zindex', (event, config) => {
    touchBarManager.updateZindexItems(config);
  });
  ipcMain.handle('update-touchbar-wallet', (event, config) => {
    touchBarManager.updateWalletItems(config);
  });
  ipcMain.handle('update-touchbar-tab', (event, config) => {
    touchBarManager.updateTabItems(config);
  });
  ipcMain.handle('update-touchbar-eye-status', (event, config) => {
    touchBarManager.updateEysStatusItems(config);
    contextMenuManager.updateEyeMenu(config);
  });
  // 快捷键
  const visibleHotkeyManager = new HotkeyManager({ mb });
  const translateHotkeyManager = new HotkeyManager({ mb });
  ipcMain.handle('set-visible-hotkey', (event, keys: string) => {
    visibleHotkeyManager.registryHotkey(keys, ({ visible }) => {
      if (visible) {
        mb.hideWindow();
      } else {
        mb.showWindow();
      }
    });
  });
  ipcMain.handle('set-translate-hotkey', (event, keys: string) => {
    translateHotkeyManager.registryHotkey(keys, ({ visible }) => {
      sendMessageToRenderer(mb.window, 'trigger-translate', visible);
    });
  });
  // 多窗口相关
  ipcMain.handle('open-child-window', (event, config) => {
    const parentWin = BrowserWindow.fromWebContents(event.sender);
    const win = createChildWindow({ search: config.search, parentId: parentWin!.id });
    if (win) {
      const windowId = win.id;
      windowIds.push(windowId);
      win.on('closed', () => {
        windowIds = windowIds.filter((id) => id !== windowId);
      });
    }
  });
  ipcMain.handle('sync-multi-window-store', (event, config) => {
    const fromWin = BrowserWindow.fromWebContents(event.sender);
    config._share = true;
    getOtherWindows(windowIds, fromWin?.id).forEach((win) => {
      win?.webContents.send('sync-store-data', config);
    });
  });
  ipcMain.handle('request', async (event, { url, config }) => {
    const httpClient = new HttpClient();
    // 系统代理需要实时检测代理地址
    if (proxyMode === 'system') {
      const proxyContent = await event.sender.session.resolveProxy('localhost');
      proxyManager.updateAgentByParseProxyContent(proxyContent);
    }
    httpClient.userAgent = fakeUA;
    httpClient.dispatcher = proxyManager.agent;
    return httpClient.request(url, config);
  });
  // io操作
  ipcMain.handle('io-saveImage', (event, { path, content }) => saveImage(path, content));
  ipcMain.handle('io-saveJsonToCsv', (event, { path, content }) => saveJsonToCsv(path, content));
  ipcMain.handle('io-saveString', (event, { path, content }) => saveString(path, content));
  ipcMain.handle('io-readStringFile', (event, { path }) => readStringFile(path));
  ipcMain.handle('io-readFile', (event, { path }) => readFile(path));
  // 剪贴板相关
  ipcMain.handle('clipboard-readText', (event) => clipboard.readText());
  ipcMain.handle('clipboard-writeText', (event, text) => clipboard.writeText(text));
  ipcMain.handle('clipboard-writeImage', (event, dataUrl) => clipboard.writeImage(nativeImage.createFromDataURL(dataUrl)));
  // ocr识别基金
  // ipcMain.handle('ocr-funds', (event, imgUrl: string) => tesseractOCR.funds(imgUrl));
  // menubar 相关监听
  mb.on('before-load', () => {
    // 生成fakeUA
    ua = mb.window!.webContents.getUserAgent();
    fakeUA = makeFakeUA(ua);
    mb.window?.webContents.setUserAgent(fakeUA);
    mb.window?.webContents.session.setUserAgent(fakeUA);
  });
  mb.on('after-create-window', () => {
    // 注册windowId
    windowIds.push(mb.window!.webContents.id);
    // 设置系统色彩偏好
    setNativeTheme(defaultTheme);
    // 右键菜单
    tray.on('right-click', () => {
      mb.tray.popUpContextMenu(contextMenuManager.buildContextMenu);
    });
    // 监听主题颜色变化
    nativeTheme.on('updated', () => {
      getOtherWindows(windowIds).forEach((win) => {
        sendMessageToRenderer(win, 'nativeTheme-updated', { darkMode: nativeTheme.shouldUseDarkColors });
      });
    });
    // 存储窗口大小
    mainWindowState.manage(mb.window!);
    // 是否打开备份文件
    if (openBackupFilePath) {
      sendMessageToRenderer(mb.window, 'open-backup-file', openBackupFilePath);
    }
    // 外部打开 _blank连接
    mb.window?.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: 'deny' };
    });

    // 打开开发者工具
    if (!app.isPackaged) {
      mb.window?.webContents.openDevTools({ mode: 'undocked' });
    }
  });

  // new AppUpdater({ icon: nativeIcon, win: mb.window });
}

init().catch(console.log);
