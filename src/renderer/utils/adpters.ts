/** *
 * 请求调度文件
 * 某些数据源会阻挡高并发请求，需要不同的请求策略
 */
import * as Utils from './index';

export interface Collector<T> {
  (): Promise<T | null>;
}
/** *
 * @param requests Collector[]
 * @param delay 延迟时间
 * 所有请求并行发送，所有请求完成后promise结束
 */
export const ConCurrencyAllAdapter: <T>(
  collectors: Collector<T>[],
  delay?: number
) => Promise<(T | null)[]> = async (collectors, delay = 0) => {
  await Utils.Sleep(delay);
  return Promise.all(collectors.map((_) => _()));
};

/** *
 * @param requests Collector[]
 * @param delay 延迟时间
 * 串行发送所有请求，所有请求完成后promise结束
 */
export const ChokeAllAdapter: <T>(
  collectors: Collector<T>[],
  delay?: number
) => Promise<(T | null)[]> = async <U>(
  collectors: Collector<U>[],
  delay = 0
) => {
  const result: (U | null)[] = [];
  return collectors
    .reduce(
      (last, next, index) =>
        last.then(next).then((res) => {
          result.push(res);
          return Utils.Sleep(delay);
        }),
      Promise.resolve()
    )
    .then(() => result);
};

/** *
 * @param requests Collector[]
 * @param delay 延迟时间
 * 并行发送所有请求，有一个请求结束，则所有结束
 */
export const ConCurrencyPreemptiveAdapter: <T>(
  collectors: Collector<T>[],
  delay?: number
) => Promise<T | null> = async (collectors, delay = 0) => {
  await Utils.Sleep(delay);
  return new Promise(async (resolve, reject) => {
    await collectors.forEach(async (next, index) => {
      const res = await next();
      resolve(res);
    });
  });
};

/** *
 * @param requests Collector[]
 * @param delay 延迟时间
 * 串行发送所有请求，有一个请求结束，则所有结束
 */
export const ChokePreemptiveAdapter: <T>(
  collectors: Collector<T>[],
  delay?: number
) => Promise<T | null> = async (collectors, delay = 0) => {
  return new Promise(async (resolve, reject) => {
    await collectors.reduce((last, next, index) => {
      return last.then(async () => {
        try {
          const res = await next();
          resolve(res);
        } catch {
          return Utils.Sleep(delay);
        }
      });
    }, Promise.resolve());
  });
};

/** *
 * @param requests Collector[]
 * @param delay 延迟时间
 * 串行任务组，每个小任务为并发
 */
export const ChokeGroupAdapter: <T>(
  collectors: Collector<T>[],
  slice?: number,
  delay?: number
) => Promise<(T | null)[]> = async <T>(
  collectors: Collector<T>[],
  slice = 1,
  delay = 0
) => {
  const collectorGroups: Collector<T>[][] = [];
  collectors.forEach((collector, index: number) => {
    const groupIndex = Math.floor(index / slice);
    const group = collectorGroups[groupIndex] || [];
    group.push(collector);
    collectorGroups[groupIndex] = group;
  });

  const taskcollectors = collectorGroups.map(
    (collectorGroup) => async () => await ConCurrencyAllAdapter(collectorGroup)
  );
  return (await ChokeAllAdapter(taskcollectors, delay)).flat();
};
