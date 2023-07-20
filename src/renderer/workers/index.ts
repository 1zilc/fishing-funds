import PromiseWorker from 'promise-worker';

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

export class SearchPromiseWorker extends BasicWorker {
  constructor() {
    super(
      new Worker(new URL('./search.worker', import.meta.url), {
        type: 'module',
      })
    );
  }
}

export class CodingPromiseWorker extends BasicWorker {
  constructor() {
    super(
      new Worker(new URL('./coding.worker', import.meta.url), {
        type: 'module',
      })
    );
  }
}
