/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, globalShortcut, nativeImage } from 'electron';
import AppUpdater from './autoUpdater';
import { menubar } from 'menubar';

let myWindow: any = null;

const EXTRA_RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../assets');

const getAssetPath = (resourceFilename: string): string => {
  return path.join(EXTRA_RESOURCES_PATH, resourceFilename);
};

const nativeMenuIcon = nativeImage.createFromPath(
  getAssetPath('menu/iconTemplate.png')
);

const nativeIcon = nativeImage.createFromPath(getAssetPath('icon.png'));

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

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

  const mb = menubar({
    index: `file://${__dirname}/index.html`,
    // icon: path.join(__dirname, '../resources/menu/iconTemplate.png'),
    // icon: 'resources/icon.png',
    icon: nativeMenuIcon,
    // tray: new Tray(getAssetPath('menu/iconTemplate.png')),
    tooltip: 'Fishing Funds',
    preloadWindow: true,
    showOnAllWorkspaces: false,
    showDockIcon: false,

    browserWindow: {
      transparent: false,
      alwaysOnTop: false,
      width: 300,
      height: 480,
      minHeight: 400,
      minWidth: 300,
      maxHeight: 800,
      maxWidth: 600,
      webPreferences: {
        contextIsolation: false,
        enableRemoteModule: true,
        nodeIntegration: true,
        devTools: !app.isPackaged,
      },
    },
  });

  // open devtools
  mb.on('after-create-window', () => {
    myWindow = mb.window;
    // app.dock.hide();
    if (!app.isPackaged) {
      mb.window!.webContents.openDevTools({ mode: 'undocked' });
    }
  });
  // To avoid a flash when opening your menubar app, you can disable backgrounding the app using the following:
  mb.app.commandLine.appendSwitch(
    'disable-backgrounding-occluded-windows',
    'true'
  );

  // eslint-disable-next-line
  // TODO: 暂时关闭自动更新，需要apple签名
  // new AppUpdater(nativeIcon);
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
