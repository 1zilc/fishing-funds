import { useCallback } from 'react';
import { useInterval } from 'ahooks';
import { getCurrentHours } from '@/actions/time';
import * as Utils from '@/utils';

export const useWorkDayTimeToDo = (todo: () => void, delay: number) => {
  useInterval(async () => {
    const timestamp = await getCurrentHours();
    const isWorkDayTime = Utils.JudgeWorkDayTime(Number(timestamp));
    if (isWorkDayTime) {
      todo();
    }
  }, delay);
};

export const useScrollToTop: (
  config: {
    before?: () => void;
    after?: () => void;
    option?: {
      behavior?: ScrollBehavior;
      left?: number;
      top?: number;
    };
  },
  dep?: any[]
) => () => void = (config, dep = []) => {
  return useCallback(() => {
    const { before, after, option } = config;
    before && before();
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
      ...option,
    });
    after && after();
  }, dep);
};
