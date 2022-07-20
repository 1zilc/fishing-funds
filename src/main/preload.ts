import log from 'electron-log';
import { contextBridge, ipcRenderer, shell, clipboard, nativeImage } from 'electron';
import { encode, decode, fromUint8Array } from 'js-base64';
import { RequestPromiseWorker, IOPromiseWorker } from './workers';
import { encodeFF, decodeFF } from './workers/utils/io';
import { WorkerRecieveParams as IOWorkerRecieveParams } from './workers/io.worker';
import { WorkerRecieveParams as RequestWorkerRecieveParams, GotResponse } from './workers/request.worker';

const { version } = require('../../release/app/package.json');
const requestPromiseWorker = new RequestPromiseWorker();

contextBridge.exposeInMainWorld('contextModules', {
  got: async (url: string, config: any) => {
    const proxyConent = await ipcRenderer.invoke('resolve-proxy', url);
    return requestPromiseWorker.postMessage<GotResponse, RequestWorkerRecieveParams>({ url, config, proxyConent }).then((res) => {
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
  log,
  io: {
    saveImage(filePath: string, dataUrl: string) {
      const ioPromiseWorker = new IOPromiseWorker();
      ioPromiseWorker
        .postMessage<void, IOWorkerRecieveParams>({ module: 'saveImage', filePath, data: dataUrl })
        .finally(() => ioPromiseWorker.terminate());
    },
    saveString(filePath: string, content: string) {
      const ioPromiseWorker = new IOPromiseWorker();
      ioPromiseWorker
        .postMessage<void, IOWorkerRecieveParams>({ module: 'saveString', filePath, data: content })
        .finally(() => ioPromiseWorker.terminate());
    },
    saveJsonToCsv(filePath: string, json: any[]) {
      const ioPromiseWorker = new IOPromiseWorker();
      ioPromiseWorker
        .postMessage<void, IOWorkerRecieveParams>({ module: 'saveJsonToCsv', filePath, data: json })
        .finally(() => ioPromiseWorker.terminate());
    },
    readFile(filePath: string) {
      const ioPromiseWorker = new IOPromiseWorker();
      ioPromiseWorker
        .postMessage<string, IOWorkerRecieveParams>({ module: 'readFile', filePath })
        .finally(() => ioPromiseWorker.terminate());
    },
    encryptFF(content: any) {
      const ioPromiseWorker = new IOPromiseWorker();
      ioPromiseWorker
        .postMessage<string, IOWorkerRecieveParams>({ module: 'encryptFF', data: content })
        .finally(() => ioPromiseWorker.terminate());
    },
    decryptFF(content: string) {
      const ioPromiseWorker = new IOPromiseWorker();
      ioPromiseWorker
        .postMessage<string, IOWorkerRecieveParams>({ module: 'decryptFF', data: content })
        .finally(() => ioPromiseWorker.terminate());
    },
    encodeFF,
    decodeFF,
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
