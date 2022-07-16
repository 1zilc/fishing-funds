import RequestWorker from './request.worker.ts';
import IOWorker from './io.worker.ts';

export const requestWorker = new RequestWorker();
export const ioWorker = new IOWorker();
