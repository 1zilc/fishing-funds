import PromiseWorker from 'promise-worker';
import RequestWorker from './request.worker.ts';
import IOWorker from './io.worker.ts';

export class BasicWorker extends PromiseWorker {
  private worker: Worker;

  constructor(worker: Worker) {
    super(worker);
    this.worker = worker;
  }

  terminate() {
    this.worker.terminate();
  }
}

export class RequestPromiseWorker extends BasicWorker {
  constructor() {
    super(new RequestWorker());
  }
}

export class IOPromiseWorker extends BasicWorker {
  constructor() {
    super(new IOWorker());
  }
}
