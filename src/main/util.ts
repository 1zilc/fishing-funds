import log from 'electron-log';
import { Menubar } from 'menubar';
import { app, BrowserWindow, nativeTheme } from 'electron';
import { URL } from 'url';
import * as path from 'path';
import * as Enums from '../renderer/utils/enums';

export function resolveHtmlPath() {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 3456;
    // const url = new URL();
    return `http://localhost:${port}`;
  } else {
    return `file://${path.resolve(__dirname, '../renderer/', 'index.html')}`;
  }
}

export function getAssetPath(resourceFilename: string) {
  const EXTRA_RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'assets') : path.join(__dirname, '../../assets');
  return path.join(EXTRA_RESOURCES_PATH, resourceFilename);
}

export function installExtensions() {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];
  return Promise.all(extensions.map((name) => installer.default(installer[name], forceDownload))).catch(console.log);
}

export function lockSingleInstance() {
  const isSingleInstance = app.requestSingleInstanceLock();
  if (!isSingleInstance) {
    app.quit();
  }
}

export async function checkEnvTool() {
  const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
  if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support');
    Object.assign(console, log.functions);
    sourceMapSupport.install();
  }

  if (isDebug) {
    require('electron-debug')();
  }
  if (isDebug) {
    await installExtensions();
  }
}

export function base64ToBuffer(dataUrl: string) {
  const data = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  const imageBuffer = Buffer.from(data![2], 'base64');
  return imageBuffer;
}

export function sendMessageToRenderer(mb: Menubar, key: string, data?: any) {
  return mb.window?.webContents.send(key, data);
}

export function setNativeTheme(theme: Enums.SystemThemeType) {
  switch (theme) {
    case Enums.SystemThemeType.Dark:
      nativeTheme.themeSource = 'dark';
      break;
    case Enums.SystemThemeType.Light:
      nativeTheme.themeSource = 'light';
      break;
    case Enums.SystemThemeType.Auto:
    default:
      nativeTheme.themeSource = 'system';
      break;
  }
}

export function getPreloadPath() {
  return app.isPackaged ? path.join(__dirname, 'preload.js') : path.join(__dirname, '../../.erb/dll/preload.js');
}

export function getOtherWindows(windowIds: number[], current: number | undefined) {
  return windowIds.filter((id) => id !== current).map((id) => BrowserWindow.fromId(id));
}
