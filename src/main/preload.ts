import { contextBridge, ipcRenderer, shell, clipboard, nativeImage } from 'electron';
import got from 'got';
import { encode, decode } from 'js-base64';
import log from 'electron-log';
import * as fs from 'fs';
import * as CONST from '../renderer/constants';
import { base64ToBuffer } from './util';
import { version } from '../../release/app/package.json';

const HttpProxyAgent = require('http-proxy-agent');
const HttpsProxyAgent = require('https-proxy-agent');

contextBridge.exposeInMainWorld('contextModules', {
  got: async (url: string, config = {}) => {
    const { httpProxyAddressSetting, httpProxySetting, httpProxyWhitelistSetting, httpProxyRuleSetting }: any = JSON.parse(
      localStorage.getItem(CONST.STORAGE.SYSTEM_SETTING)!
    );
    const httpProxyRuleMap = (httpProxyRuleSetting ?? '').split(',').reduce((map: Record<string, boolean>, address: string) => {
      map[address] = true;
      return map;
    }, {});

    const { host } = new URL(url);
    const agent = Object.fromEntries(
      httpProxySetting && httpProxyWhitelistSetting !== !!httpProxyRuleMap[host]
        ? [
            ['http', HttpProxyAgent(httpProxyAddressSetting)],
            ['https', HttpsProxyAgent(httpProxyAddressSetting)],
          ]
        : []
    );
    return got(url, {
      ...config,
      retry: 3,
      timeout: 7000,
      agent,
    });
  },
  process: {
    production: process.env.NODE_ENV === 'production',
    electron: process.versions.electron,
    version: process.env.VERSION || version,
  },
  electron: {
    shell: {
      openExternal: shell.openExternal,
    },
    ipcRenderer: {
      invoke: ipcRenderer.invoke,
      removeAllListeners: ipcRenderer.removeAllListeners,
      on(channel: string, func: any) {
        const validChannels = [
          'nativeTheme-updated',
          'clipboard-funds-copy',
          'clipboard-funds-import',
          'backup-all-config-export',
          'backup-all-config-import',
          'update-available',
          'open-backup-file',
          'change-current-wallet-code',
        ];
        if (validChannels.includes(channel)) {
          return ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
        } else {
          return null;
        }
      },
    },
    dialog: {
      showMessageBox: async (config: any) => ipcRenderer.invoke('show-message-box', config),
      showSaveDialog: async (config: any) => ipcRenderer.invoke('show-save-dialog', config),
      showOpenDialog: async (config: any) => ipcRenderer.invoke('show-open-dialog', config),
    },
    invoke: {
      showCurrentWindow: () => ipcRenderer.invoke('show-current-window'),
      getShouldUseDarkColors: () => ipcRenderer.invoke('get-should-use-dark-colors'),
      setNativeThemeSource: (config: any) => ipcRenderer.invoke('set-native-theme-source', config),
    },
    app: {
      setLoginItemSettings: (config: any) => ipcRenderer.invoke('set-login-item-settings', config),
      quit: () => ipcRenderer.invoke('app-quit'),
    },
    clipboard: {
      readText: clipboard.readText,
      writeText: clipboard.writeText,
      writeImage: (dataUrl: string) => clipboard.writeImage(nativeImage.createFromDataURL(dataUrl)),
    },
    saveImage: (filePath: string, dataUrl: string) => {
      const imageBuffer = base64ToBuffer(dataUrl);
      fs.writeFileSync(filePath, imageBuffer);
    },
    saveString: (filePath: string, content: string) => {
      fs.writeFileSync(filePath, content);
    },
    encodeFF(content: any) {
      const ffprotocol = 'ff://'; // FF协议
      return `${ffprotocol}${encode(JSON.stringify(content))}`;
    },
    decodeFF(content: string) {
      const ffprotocol = 'ff://'; // FF协议
      try {
        const protocolLength = ffprotocol.length;
        const protocol = content.slice(0, protocolLength);
        if (protocol !== ffprotocol) {
          throw Error('协议错误');
        }
        const body = content.slice(protocolLength);
        return JSON.parse(decode(body));
      } catch (error) {
        console.log('解码失败', error);
        return null;
      }
    },
    readFile(path: string) {
      return fs.readFileSync(path, 'utf-8');
    },
  },
  log: log,
});
