export const sortWorker = new Worker(new URL('./sort.worker.ts', import.meta.url));
export const mergeWorker = new Worker(new URL('./merge.worker.ts', import.meta.url));
