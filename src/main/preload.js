const {
  contextBridge,
  ipcRenderer,
  shell,
  app,
  clipboard,
  nativeTheme,
} = require('electron');

const got = require('got');

contextBridge.exposeInMainWorld('contextModules', {
  got: async (url, config = {}) => await got(url, { ...config, retry: 0 }),
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
      on(channel, func) {
        const validChannels = [
          'nativeTheme-updated',
          'clipboard-funds-copy',
          'clipboard-funds-import',
          'update-available',
        ];
        if (validChannels.includes(channel)) {
          return ipcRenderer.on(channel, (event, ...args) =>
            func(event, ...args)
          );
        }
      },
    },
    dialog: {
      showMessageBox: async (config) =>
        await ipcRenderer.invoke('show-message-box', config),
    },
    invoke: {
      showCurrentWindow: () => ipcRenderer.invoke('show-current-window'),
      getShouldUseDarkColors: () =>
        ipcRenderer.invoke('get-should-use-dark-colors'),
      setNativeThemeSource: (config) =>
        ipcRenderer.invoke('set-native-theme-source', config),
    },
    app: {
      setLoginItemSettings: (config) =>
        ipcRenderer.invoke('set-login-item-settings', config),
      quit: () => ipcRenderer.invoke('app-quit'),
    },
    clipboard: {
      readText: clipboard.readText,
      writeText: clipboard.writeText,
    },
  },
});
