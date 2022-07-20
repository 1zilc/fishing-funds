import { saveImage, saveString, saveJsonToCsv, readFile, encryptFF, decryptFF } from './utils/io';
import registerPromiseWorker from 'promise-worker/register';

type RecieveModule = 'saveImage' | 'saveString' | 'saveJsonToCsv' | 'readFile' | 'encryptFF' | 'decryptFF';

export interface WorkerRecieveParams {
  module: RecieveModule;
  filePath?: string;
  data?: any;
}

registerPromiseWorker(async (params: WorkerRecieveParams) => {
  switch (params.module) {
    case 'saveImage':
      return saveImage(params.filePath!, params.data);
    case 'saveString':
      return saveString(params.filePath!, params.data);
    case 'saveJsonToCsv':
      return saveJsonToCsv(params.filePath!, params.data);
    case 'readFile':
      return readFile(params.filePath!);
    case 'encryptFF':
      return encryptFF(params.data);
    case 'decryptFF':
      return decryptFF(params.data);
  }
});
