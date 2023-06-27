import log from 'electron-log';
import { app, BrowserWindow, nativeTheme } from 'electron';
import * as path from 'path';
import * as Enums from '../renderer/utils/enums';

export function resolveHtmlPath() {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 3456;
    // const url = new URL();
    return `https://localhost:${port}`;
  } else {
    return `file://${path.resolve(__dirname, '../renderer/', 'index.html')}`;
  }
}

export function getAssetPath(resourceFilename: string) {
  const EXTRA_RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'assets') : path.join(__dirname, '../../assets');
  return path.join(EXTRA_RESOURCES_PATH, resourceFilename);
}

export function installExtensions() {
  const installer = require('electron-extension-installer');
  const extensions = ['REACT_DEVELOPER_TOOLS'];
  return Promise.all(
    extensions.map((name) =>
      installer.default(installer[name], {
        loadExtensionOptions: {
          allowFileAccess: true,
        },
      })
    )
  ).catch(console.log);
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
    // 初始化log
    log.initialize();
    Object.assign(console, log.functions);

    const sourceMapSupport = require('source-map-support');
    sourceMapSupport.install();
  }

  if (isDebug) {
    require('electron-debug')();
    // 关闭自签ca错误
    app.commandLine.appendSwitch('ignore-certificate-errors');
    await installExtensions();
  }
}

export function sendMessageToRenderer(win: BrowserWindow | undefined | null, key: string, data?: any) {
  return win?.webContents.send(key, data);
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
  return app.isPackaged ? path.join(__dirname, '../preload/index.js') : path.join(__dirname, '../../out/preload/index.js');
}

export function getOtherWindows(windowIds: number[], current?: number) {
  return windowIds.filter((id) => id !== current).map((id) => BrowserWindow.fromId(id));
}

export function makeFakeUA(ua: string) {
  if (ua) {
    return ua.replace(/(FishingFunds|Electron)\/.*?\s/g, '');
  } else {
    return ua;
  }
}
