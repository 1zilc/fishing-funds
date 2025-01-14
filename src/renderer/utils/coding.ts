import { codingWorkerWarp } from '@/workers';

export function encryptFF(content: any) {
  return codingWorkerWarp.encryptFF(content);
}
export function decryptFF<T = unknown>(content: string) {
  return codingWorkerWarp.decryptFF(content) as T;
}
export function encodeFF(content: any) {
  return codingWorkerWarp.encodeFF(content);
}
export function decodeFF<T = unknown>(content: string) {
  return codingWorkerWarp.decodeFF(content) as T;
}
