import registerPromiseWorker from 'promise-worker/register';
import { MergeStateWithResponse } from '@/utils';

registerPromiseWorker(MergeStateWithResponse);
