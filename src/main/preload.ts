import { contextBridge, ipcRenderer, shell, clipboard, nativeImage } from 'electron';
import got from 'got';
import * as fs from 'fs';
import { base64ToBuffer } from './util';

contextBridge.exposeInMainWorld('contextModules', {
  got: async (url: string, config = {}) => got(url, { ...config, retry: 3, timeout: 6000 }),
  process: {
    production: process.env.NODE_ENV === 'production',
    electron: process.versions.electron,
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
          'update-available',
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
      try {
        const imageBuffer = base64ToBuffer(dataUrl);
        fs.writeFileSync(`${filePath}`, imageBuffer);
      } catch (error) {
        console.log('图片写入失败', error);
      }
    },
  },
});
