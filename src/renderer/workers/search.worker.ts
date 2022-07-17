import registerPromiseWorker from 'promise-worker/register';
import * as Enums from '@/utils/enums';

interface WorkerRecieveParams {
  module?: Enums.TabKeyType;
  list: any[];
}

registerPromiseWorker((params: WorkerRecieveParams) => {});
