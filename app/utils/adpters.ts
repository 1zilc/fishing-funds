/** *
 * 请求调度文件
 * 某些数据源会阻挡高并发请求，需要不同的请求策略
 */
import * as Utils from './index';

export interface Collector {
  (): Promise<Fund.ResponseItem | null>;
}
/** *
 * @param requests Collector[]
 * @param delay 延迟时间
 * 所有请求并行发送
 */
export const ConCurrencyAdapter: (
  collectors: Collector[],
  delay?: number
) => Promise<(Fund.ResponseItem | null)[]> = async (collectors, delay = 0) => {
  await Utils.Sleep(delay);
  return Promise.all(collectors.map(_ => _()));
};

/** *
 * @param requests Collector[]
 * @param delay 延迟时间
 * 串行发送所有请求
 */
export const ChokeAdapter: (
  requests: Collector[],
  delay?: number
) => Promise<(Fund.ResponseItem | null)[]> = async (collectors, delay = 0) => {
  const result: (Fund.ResponseItem | null)[] = [];
  return collectors
    .reduce((last, next, index) => {
      return last.then(next).then(res => {
        result.push(res);
        return Utils.Sleep(delay);
      });
    }, Promise.resolve())
    .then(() => result);
};
