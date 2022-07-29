import { encryptFF, decryptFF, encodeFF, decodeFF } from './utils/coding';
import registerPromiseWorker from 'promise-worker/register';

type RecieveModule = 'encryptFF' | 'decryptFF' | 'encodeFF' | 'decodeFF';

export interface WorkerRecieveParams {
  module: RecieveModule;
  data: any;
}

registerPromiseWorker(async (params: WorkerRecieveParams) => {
  switch (params.module) {
    case 'encryptFF':
      return encryptFF(params.data);
    case 'decryptFF':
      return decryptFF(params.data);
    case 'encodeFF':
      return encodeFF(params.data);
    case 'decodeFF':
      return decodeFF(params.data);
  }
});
