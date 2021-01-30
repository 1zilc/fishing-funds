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
import { app, shell, nativeImage } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { menubar } from 'menubar';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

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
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};
const createMenubar = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }
  const image = nativeImage.createFromPath('resources/menu/iconTemplate.png');
  const mb = menubar({
    index: `file://${__dirname}/app.html`,
    icon: path.join(__dirname, '../resources/menu/iconTemplate.png'),
    // icon: 'resources/icon.png',
    // icon: image,
    // tray: appIcon,
    tooltip: 'Fishing Funds',
    browserWindow: {
      transparent: false,
      alwaysOnTop: false,
      width: 350,
      height: 500,
      minHeight: 400,
      minWidth: 300,
      webPreferences: {
        nodeIntegration: true
      }
    }
  });
  mb.on('after-create-window', () => {
    mb.window.webContents.openDevTools({ mode: 'undocked' });
  });
  // Open urls in the user's browser
  mb.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });
  // eslint-disable-next-line
  new AppUpdater();
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

// app.on('ready', createMenubar);
app
  .whenReady()
  .then(createMenubar)
  .catch(console.log);
