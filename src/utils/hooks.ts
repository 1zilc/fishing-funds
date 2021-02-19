import { useCallback, useLayoutEffect } from 'react';
import { useInterval } from 'ahooks';
import { ipcRenderer } from 'electron';

import { getSystemSetting } from '@/actions/setting';
import { useDispatch } from 'react-redux';
import { getCurrentHours } from '@/actions/time';
import { updateAvaliable } from '@/actions/updater';
import * as Utils from '@/utils';

export function useWorkDayTimeToDo(todo: () => void, delay: number): void {
  useInterval(async () => {
    const timestamp = await getCurrentHours();
    const isWorkDayTime = Utils.JudgeWorkDayTime(Number(timestamp));
    if (isWorkDayTime) {
      todo();
    }
  }, delay);
}

export function useScrollToTop(
  config: {
    before?: () => void;
    after?: () => void;
    option?: {
      behavior?: ScrollBehavior;
      left?: number;
      top?: number;
    };
  },
  dep: any[] = []
) {
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
}

export function useUpdater() {
  const dispatch = useDispatch();
  const { autoCheckUpdateSetting } = getSystemSetting();
  // 一个小时检查一次版本
  useInterval(
    () => autoCheckUpdateSetting && ipcRenderer.send('check-update'),
    1000 * 60 * 60 * 1,
    {
      immediate: true,
    }
  );
  useLayoutEffect(() => {
    ipcRenderer.on('update-available', (e, data) =>
      dispatch(updateAvaliable(data))
    );
    return () => {
      ipcRenderer.removeAllListeners('update-available');
    };
  }, []);
}
