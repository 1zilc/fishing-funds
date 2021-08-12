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
        clipboard: {
          writeText: Clipboard['writeText'];
          readText: Clipboard['readText'];
          writeImage: (dataUrl: string) => void;
        };
        invoke: {
          showCurrentWindow: () => void;
          getShouldUseDarkColors: () => Promise<boolean>;
          setNativeThemeSource: (theme: string) => Promise<void>;
        };
        saveImage: (filePath: string, dataUrl: string) => Promise<void>;
      };
      process: {
        production: boolean;
        electron: string;
      };
    };
  }
}

export {};
