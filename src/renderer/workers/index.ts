import * as Comlink from 'comlink';
import { type ExposesType as SearchWorker } from './search.worker';
import { type ExposesType as CodingWorker } from './coding.worker';

export const searchWorkerWarp = Comlink.wrap<SearchWorker>(
  new Worker(new URL('./search.worker', import.meta.url), {
    type: 'module',
  })
);

export const codingWorkerWarp = Comlink.wrap<CodingWorker>(
  new Worker(new URL('./coding.worker', import.meta.url), {
    type: 'module',
  })
);
