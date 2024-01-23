import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('contextModules', {
  got: async (url: string, config: any) => ipcRenderer.invoke('got', { url, config }),
  process: {
    production: import.meta.env.PROD,
    platform: process.platform,
    electron: process.versions.electron,
    node: process.versions.node,
    v8: process.versions.v8,
    chrome: process.versions.chrome,
    arch: process.arch,
    buildDate: __BUILD_DATE__,
  },
  electron: {
    shell: {
      openExternal: ipcRenderer.invoke.bind(null, 'shell-openExternal'),
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
          'trigger-translate',
          'trigger-chatGPT',
          'support-author',
        ];
        if (validChannels.includes(channel)) {
          return ipcRenderer.on(channel, func);
        } else {
          return null;
        }
      },
    },
    dialog: {
      showMessageBox: ipcRenderer.invoke.bind(null, 'show-message-box'),
      showSaveDialog: ipcRenderer.invoke.bind(null, 'show-save-dialog'),
      showOpenDialog: ipcRenderer.invoke.bind(null, 'show-open-dialog'),
    },
    app: {
      setLoginItemSettings: ipcRenderer.invoke.bind(null, 'set-login-item-settings'),
      quit: ipcRenderer.invoke.bind(null, 'app-quit'),
      relaunch: ipcRenderer.invoke.bind(null, 'app-relaunch'),
      getVersion: ipcRenderer.invoke.bind(null, 'get-version'),
    },
    clipboard: {
      readText: ipcRenderer.invoke.bind(null, 'clipboard-readText'),
      writeText: ipcRenderer.invoke.bind(null, 'clipboard-writeText'),
      writeImage: ipcRenderer.invoke.bind(null, 'clipboard-writeImage'),
    },
  },
  io: {
    saveImage: (path: string, content: string) => ipcRenderer.invoke('io-saveImage', { path, content }),
    saveJsonToCsv: (path: string, content: any[]) => ipcRenderer.invoke('io-saveJsonToCsv', { path, content }),
    saveString: (path: string, content: string) => ipcRenderer.invoke('io-saveString', { path, content }),
    readFile: (path: string) => ipcRenderer.invoke('io-readFile', { path }),
  },
  electronStore: {
    async get(type: Store.StoreType, key: string, init: unknown) {
      return ipcRenderer.invoke('get-storage-config', { type, key, init });
    },
    async set(type: Store.StoreType, key: string, value: unknown) {
      await ipcRenderer.invoke('set-storage-config', { type, key, value });
    },
    async delete(type: Store.StoreType, key: string) {
      await ipcRenderer.invoke('delete-storage-config', { type, key });
    },
    async cover(type: Store.StoreType, value: unknown) {
      await ipcRenderer.invoke('cover-storage-config', { type, value });
    },
    async all(type: Store.StoreType) {
      return ipcRenderer.invoke('all-storage-config', { type });
    },
  },
});
