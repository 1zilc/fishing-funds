import { GotRequestFunction } from 'got';
import { Shell, Dialog, App, IpcRenderer, Clipboard } from 'electron';

declare global {
  interface Window {
    contextModules: {
      got: GotRequestFunction;
      process: {
        production: boolean;
        electron: string;
        platform: 'aix' | 'darwin' | 'freebsd' | 'linux' | 'openbsd' | 'sunos' | 'win32';
      };
      electron: {
        shell: Shell;
        ipcRenderer: IpcRenderer;
        dialog: Dialog;
        app: {
          quit: App['quit'];
          relaunch: App['relaunch'];
          setLoginItemSettings: App['setLoginItemSettings'];
          getVersion: () => Promise<ReturnType<App['getVersion']>>;
        };
        clipboard: {
          writeText: Clipboard['writeText'];
          readText: Clipboard['readText'];
          writeImage: (dataUrl: string) => void;
        };
      };
      io: {
        saveImage: (filePath: string, dataUrl: string) => Promise<unknown>;
        saveString: (filePath: string, content: string) => Promise<unknown>;
        saveJsonToCsv: (filePath: string, json: any[]) => Promise<unknown>;
        readFile: (content: string) => Promise<string>;
      };
      coding: {
        encryptFF: (content: any) => Promise<string>;
        decryptFF: (content: string) => Promise<any>;
        encodeFF: (content: any) => Promise<string>;
        decodeFF: (content: string) => Promise<any>;
      };
      electronStore: {
        get: <T = unknown>(type: Store.StoreType, key: string, init?: T) => Promise<T>;
        set: (type: Store.StoreType, key: string, data: unknown) => Promise<void>;
        delete: (type: Store.StoreType, key: string) => Promise<void>;
        cover: (type: Store.StoreType, data: unknown) => Promise<void>;
        all: (type: Store.StoreType) => Promise<any>;
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
