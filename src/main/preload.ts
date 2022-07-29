import log from 'electron-log';
import got from 'got';
import { contextBridge, ipcRenderer, shell, clipboard, nativeImage } from 'electron';
import { encode, decode, fromUint8Array } from 'js-base64';
import { CodingPromiseWorker } from './workers';
import { saveImage, saveJsonToCsv, saveString, readFile } from './io';
import Proxy from './proxy';
import { WorkerRecieveParams as CodingWorkerRecieveParams } from './workers/coding.worker';

const { version } = require('../../release/app/package.json');

contextBridge.exposeInMainWorld('contextModules', {
  got: async (url: string, config: any) => {
    const proxyConent = await ipcRenderer.invoke('resolve-proxy', url);
    const { httpAgent, httpsAgent } = new Proxy(proxyConent, url);
    return got(url, {
      ...config,
      retry: {
        limit: 2,
      },
      timeout: {
        request: 10000,
      },
      agent: {
        http: httpAgent,
        https: httpsAgent,
      },
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
  log,
  io: {
    saveImage,
    saveJsonToCsv,
    saveString,
    readFile,
  },
  coding: {
    encryptFF(content: any) {
      const codingPromiseWorker = new CodingPromiseWorker();
      return codingPromiseWorker
        .postMessage<string, CodingWorkerRecieveParams>({ module: 'encryptFF', data: content })
        .finally(() => codingPromiseWorker.terminate());
    },
    decryptFF(content: string) {
      const codingPromiseWorker = new CodingPromiseWorker();
      return codingPromiseWorker
        .postMessage<string, CodingWorkerRecieveParams>({ module: 'decryptFF', data: content })
        .finally(() => codingPromiseWorker.terminate());
    },
    encodeFF(content: string) {
      const codingPromiseWorker = new CodingPromiseWorker();
      return codingPromiseWorker
        .postMessage<string, CodingWorkerRecieveParams>({ module: 'encodeFF', data: content })
        .finally(() => codingPromiseWorker.terminate());
    },
    decodeFF(content: string) {
      const codingPromiseWorker = new CodingPromiseWorker();
      return codingPromiseWorker
        .postMessage<string, CodingWorkerRecieveParams>({ module: 'decodeFF', data: content })
        .finally(() => codingPromiseWorker.terminate());
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
