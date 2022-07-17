import log from 'electron-log';
import PromiseWorker from 'promise-worker';
import { contextBridge, ipcRenderer, shell, clipboard, nativeImage } from 'electron';
import { encode, decode, fromUint8Array } from 'js-base64';
import { requestWorker, IOWorker } from './workers';
const { version } = require('../../release/app/package.json');

contextBridge.exposeInMainWorld('contextModules', {
  got: async (url: string, config: any) => {
    const proxyConent = await ipcRenderer.invoke('resolve-proxy', url);
    return new PromiseWorker(requestWorker).postMessage({ url, config, proxyConent }).then((res) => {
      if (!res) {
        throw Error('请求错误');
      } else {
        return res;
      }
    });
  },
  process: {
    production: process.env.NODE_ENV === 'production',
    electron: process.versions.electron,
    version: process.env.VERSION || version,
    platform: process.platform,
  },
  electron: {
    shell: {
      openExternal: shell.openExternal,
    },
    ipcRenderer: {
      invoke: ipcRenderer.invoke,
      removeAllListeners: ipcRenderer.removeAllListeners,
      removeListener: ipcRenderer.removeListener,
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
          'webview-new-window',
          'change-tab-active-key',
          'change-eye-status',
          'sync-store-data',
        ];
        if (validChannels.includes(channel)) {
          return ipcRenderer.on(channel, func);
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
    app: {
      setLoginItemSettings: (config: any) => ipcRenderer.invoke('set-login-item-settings', config),
      quit: () => ipcRenderer.invoke('app-quit'),
    },
    clipboard: {
      readText: clipboard.readText,
      writeText: clipboard.writeText,
      writeImage: (dataUrl: string) => clipboard.writeImage(nativeImage.createFromDataURL(dataUrl)),
    },
  },
  log: log,
  io: {
    saveImage(filePath: string, dataUrl: string) {
      const ioWorker = new IOWorker();
      new PromiseWorker(ioWorker).postMessage({ module: 'saveImage', filePath, data: dataUrl }).finally(() => ioWorker.terminate());
    },
    saveString(filePath: string, content: string) {
      const ioWorker = new IOWorker();
      new PromiseWorker(ioWorker).postMessage({ module: 'saveString', filePath, data: content }).finally(() => ioWorker.terminate());
    },
    saveJsonToCsv(filePath: string, json: any[]) {
      const ioWorker = new IOWorker();
      new PromiseWorker(ioWorker).postMessage({ module: 'saveJsonToCsv', filePath, data: json }).finally(() => ioWorker.terminate());
    },
    readFile(filePath: string) {
      const ioWorker = new IOWorker();
      return new PromiseWorker(ioWorker).postMessage({ module: 'readFile', filePath }).finally(() => ioWorker.terminate());
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
        return null;
      }
    },
  },
  electronStore: {
    async get(key: string, init: unknown) {
      return ipcRenderer.invoke('get-storage-config', { key, init });
    },
    async set(key: string, value: unknown) {
      await ipcRenderer.invoke('set-storage-config', { key, value });
    },
    async delete(key: string) {
      await ipcRenderer.invoke('delete-storage-config', { key });
    },
    async cover(value: unknown) {
      await ipcRenderer.invoke('cover-storage-config', { value });
    },
    async all() {
      return ipcRenderer.invoke('all-storage-config');
    },
  },
  base64: {
    encode,
    decode,
    fromUint8Array,
  },
});
