import { Shell, Dialog, App, IpcRenderer, Clipboard } from 'electron';
import type HttpClient from '../../main/httpClient';

declare global {
  interface Window {
    contextModules: {
      request: HttpClient['request'];
      process: {
        production: boolean;
        platform: NodeJS.Platform;
        electron: string;
        node: string;
        v8: string;
        chrome: string;
        arch: NodeJS.Architecture;
        buildDate: string;
        sandboxed: boolean;
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
      electronStore: {
        get: <T = unknown>(type: Store.StoreType, key: string, init?: T) => Promise<T>;
        set: (type: Store.StoreType, key: string, data: unknown) => Promise<void>;
        delete: (type: Store.StoreType, key: string) => Promise<void>;
        cover: (type: Store.StoreType, data: unknown) => Promise<void>;
        all: (type: Store.StoreType) => Promise<any>;
      };
    };
  }
}
