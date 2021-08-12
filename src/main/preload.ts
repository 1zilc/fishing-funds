import { contextBridge, ipcRenderer, shell, app, clipboard, nativeTheme, nativeImage, dialog } from 'electron';
import got from 'got';
import * as fs from 'fs';

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
      send: ipcRenderer.send,
      invoke: ipcRenderer.invoke,
      removeAllListeners: ipcRenderer.removeAllListeners,
      on(channel: string, func: any) {
        const validChannels = ['nativeTheme-updated', 'clipboard-funds-copy', 'clipboard-funds-import', 'update-available'];
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
        const data = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        const imageBuffer = Buffer.from(data![2], 'base64');
        fs.writeFileSync(`${filePath}`, imageBuffer);
      } catch (error) {
        console.log('图片写入失败', error);
      }
    },
  },
});
