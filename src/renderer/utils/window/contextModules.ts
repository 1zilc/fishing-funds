import { GotRequestFunction } from 'got/dist/source';
import { Shell, Dialog, App, IpcRenderer, Clipboard } from 'electron';

declare global {
  interface Window {
    contextModules: {
      got: GotRequestFunction;
      electron: {
        shell: Shell;
        ipcRenderer: IpcRenderer;
        dialog: Dialog;
        app: App;
        clipboard: Clipboard;
        invoke: {
          showCurrentWindow: () => void;
          getShouldUseDarkColors: () => boolean;
          setNativeThemeSource: (theme: string) => void;
        };
      };
      process: {
        production: boolean;
        electron: string;
      };
    };
  }
}

export {};
