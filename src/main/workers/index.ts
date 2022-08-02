import PromiseWorker from 'promise-worker';
import CodingWorker from './coding.worker.ts';

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

export class CodingPromiseWorker extends BasicWorker {
  constructor() {
    super(new CodingWorker());
  }
}
