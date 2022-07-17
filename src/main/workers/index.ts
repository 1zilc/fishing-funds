import RequestWorker from './request.worker.ts';
import IOWorker from './io.worker.ts';

export const requestWorker = new RequestWorker();

export { IOWorker };
