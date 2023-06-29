import log from 'electron-log';
import { app, BrowserWindow, nativeTheme } from 'electron';
import * as path from 'path';
import * as Enums from '../renderer/utils/enums';

export const processPath = process.cwd();
export const assetsPath = path.join(processPath, 'assets');
export const appPath = path.resolve(__dirname, '../');
export const mainPath = path.join(appPath, 'main');
export const preloadPath = path.join(appPath, 'preload');
export const rendererPath = path.join(appPath, 'renderer');

export function resolveHtmlPath() {
  if (import.meta.env.DEV) {
    const port = process.env.PORT || 3456;
    return `https://localhost:${port}`;
  } else {
    return `file://${path.resolve(rendererPath, 'index.html')}`;
  }
}

export function getAssetPath(resourceFilename: string) {
  const EXTRA_RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'assets') : assetsPath;
  return path.join(EXTRA_RESOURCES_PATH, resourceFilename);
}

export function lockSingleInstance() {
  const isSingleInstance = app.requestSingleInstanceLock();
  if (!isSingleInstance) {
    app.quit();
  }
}

export async function checkEnvTool() {
  const isDebug = import.meta.env.DEV;
  if (import.meta.env.PROD) {
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
  return path.join(preloadPath, 'index.js');
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
