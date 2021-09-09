import { GotRequestFunction } from 'got/dist/source';
import { Shell, Dialog, App, IpcRenderer, Clipboard } from 'electron';
import { ElectronLog } from 'electron-log';

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
        saveImage: (filePath: string, dataUrl: string) => void;
        saveString: (filePath: string, content: string) => void;
        encodeFF: (content: any) => string;
        decodeFF: (content: string) => any;
        readFile: (content: string) => string;
      };
      process: {
        production: boolean;
        electron: string;
        version: string;
      };
      log: ElectronLog;
    };
  }
}

export {};
