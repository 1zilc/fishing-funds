import { CodingPromiseWorker } from '@/workers';
import { WorkerRecieveParams as CodingWorkerRecieveParams } from '@/workers/coding.worker';

export function encryptFF(content: any) {
  const codingPromiseWorker = new CodingPromiseWorker();
  return codingPromiseWorker
    .postMessage<string, CodingWorkerRecieveParams>({ module: 'encryptFF', data: content })
    .finally(() => codingPromiseWorker.terminate());
}
export function decryptFF<T = unknown>(content: string) {
  const codingPromiseWorker = new CodingPromiseWorker();
  return codingPromiseWorker
    .postMessage<T, CodingWorkerRecieveParams>({ module: 'decryptFF', data: content })
    .finally(() => codingPromiseWorker.terminate());
}
export function encodeFF(content: any) {
  const codingPromiseWorker = new CodingPromiseWorker();
  return codingPromiseWorker
    .postMessage<string, CodingWorkerRecieveParams>({ module: 'encodeFF', data: content })
    .finally(() => codingPromiseWorker.terminate());
}
export function decodeFF(content: string) {
  const codingPromiseWorker = new CodingPromiseWorker();
  return codingPromiseWorker
    .postMessage<string, CodingWorkerRecieveParams>({ module: 'decodeFF', data: content })
    .finally(() => codingPromiseWorker.terminate());
}
