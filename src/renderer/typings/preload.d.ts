import { GotRequestFunction } from 'got';
import { Shell, Dialog, App, IpcRenderer, Clipboard } from 'electron';
import { ElectronLog } from 'electron-log';

declare global {
  interface Window {
    contextModules: {
      got: GotRequestFunction;
      process: {
        production: boolean;
        electron: string;
        version: string;
        platform: 'aix' | 'darwin' | 'freebsd' | 'linux' | 'openbsd' | 'sunos' | 'win32';
      };
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
      };
      log: ElectronLog;
      io: {
        saveImage: (filePath: string, dataUrl: string) => Promise<unknown>;
        saveString: (filePath: string, content: string) => Promise<unknown>;
        saveJsonToCsv: (filePath: string, json: any[]) => Promise<unknown>;
        readFile: (content: string) => Promise<string>;
        encodeFF: (content: any) => string;
        decodeFF: (content: string) => any;
      };
      electronStore: {
        get: <T = unknown>(key: string, init: T) => Promise<T>;
        set: (key: string, data: unknown) => Promise<void>;
        delete: (key: string) => Promise<void>;
        cover: (data: unknown) => Promise<void>;
        all: () => Promise<any>;
      };
      base64: {
        encode: (src: string, urlsafe?: boolean | undefined) => string;
        decode: (src: string) => string;
        fromUint8Array: (u8a: Uint8Array, urlsafe?: boolean | undefined) => string;
      };
    };
  }
}

export {};
