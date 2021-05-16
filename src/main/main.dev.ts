/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import {
  app,
  globalShortcut,
  ipcMain,
  nativeImage,
  nativeTheme,
  Tray,
  Menu,
  dialog,
} from 'electron';
import windowStateKeeper from 'electron-window-state';
import { menubar, Menubar } from 'menubar';
import AppUpdater from './autoUpdater';
import { resolveHtmlPath } from './util';

let myWindow: any = null;
let mb: Menubar;
let appUpdater: AppUpdater;

const EXTRA_RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (resourceFilename: string): string => {
  return path.join(EXTRA_RESOURCES_PATH, resourceFilename);
};

const contextMenu = Menu.buildFromTemplate([
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
    label: '从粘贴板导入',
  },
  {
    click: () => {
      mb.window?.webContents.send('clipboard-funds-copy');
    },
    label: '复制基金JSON配置',
  },
  { type: 'separator' },
  { role: 'quit', label: '退出' },
]);

const nativeMenuIcon = nativeImage.createFromPath(
  getAssetPath('menu/iconTemplate.png')
);

const nativeIcon = nativeImage.createFromPath(getAssetPath('icon.png'));

// if (process.env.NODE_ENV === 'production') {
const sourceMapSupport = require('source-map-support');
sourceMapSupport.install();
// }

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map((name) => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};
const createMenubar = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }
  const tray = new Tray(nativeMenuIcon);
  const mainWindowState = windowStateKeeper({
    defaultWidth: 300,
    defaultHeight: 520,
  });
  mb = menubar({
    index: resolveHtmlPath('index.html'),
    // icon: path.join(__dirname, '../resources/menu/iconTemplate.png'),
    // icon: 'resources/icon.png',
    // icon: nativeMenuIcon,
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
      maxHeight: 800,
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

  // open devtools
  mb.on('after-create-window', () => {
    myWindow = mb.window;
    // 实例化更新程序
    appUpdater = new AppUpdater({ icon: nativeIcon, win: mb.window });
    appUpdater.checkUpdate('renderer');

    // app.dock.hide();
    if (!app.isPackaged) {
      mb.window!.webContents.openDevTools({ mode: 'undocked' });
    }
    // 监听主题颜色变化
    nativeTheme.on('updated', () => {
      mb.window?.webContents.send('nativeTheme-updated', {
        darkMode: nativeTheme.shouldUseDarkColors,
      });
    });
    // TODO: 暂时关闭自动更新，需要apple签名
    ipcMain.on('check-update', (e) => {
      if (app.isPackaged) {
        appUpdater.checkUpdate('renderer');
      }
    });
    // store electron window size state
    mainWindowState.manage(mb.window!);
  });
  // add contextMenu
  mb.on('ready', () => {
    tray.on('right-click', () => {
      mb.tray.popUpContextMenu(contextMenu);
    });
  });

  // To avoid a flash when opening your menubar app, you can disable backgrounding the app using the following:
  mb.app.commandLine.appendSwitch(
    'disable-backgrounding-occluded-windows',
    'true'
  );

  ipcMain.handle('show-message-box', async (event, config) => {
    return await dialog.showMessageBox(config);
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

  // new AppUpdater({ icon: nativeIcon, win: mb.window });
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
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

/** Check if single instance, if not, simply quit new instance */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
} else {
  // Behaviour on second instance for parent process- Pretty much optional
  app.on('second-instance', (event, argv, cwd) => {
    // Someone tried to run a second instance, we should focus our window.
    if (myWindow) {
      if (myWindow.isMinimized()) myWindow.restore();
      myWindow.focus();
    }
  });

  app.whenReady().then(createMenubar).catch(console.log);
}
