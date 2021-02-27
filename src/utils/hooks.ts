import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useInterval } from 'ahooks';
import { ipcRenderer, remote } from 'electron';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';

import { getSystemSetting } from '@/actions/setting';
import { getCurrentHours } from '@/actions/time';
import { updateAvaliable } from '@/actions/updater';
import * as Utils from '@/utils';

const { nativeTheme } = remote;

export function useWorkDayTimeToDo(
  todo: () => void,
  delay: number,
  config?: { immediate: boolean }
): void {
  useInterval(
    async () => {
      const timestamp = await getCurrentHours();
      const isWorkDayTime = Utils.JudgeWorkDayTime(Number(timestamp));
      if (isWorkDayTime) {
        todo();
      }
    },
    delay,
    config
  );
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

export function useNativeTheme() {
  const [darkMode, setDarkMode] = useState(nativeTheme.shouldUseDarkColors);
  useLayoutEffect(() => {
    const listener = ipcRenderer.on('nativeTheme-updated', (e, data) => {
      setDarkMode(data.darkMode);
    });
    return () => {
      listener.removeAllListeners('nativeTheme-updated');
    };
  }, []);
  return { darkMode };
}

export function useNativeThemeColor(varibles: string[]) {
  const { darkMode } = useNativeTheme();
  const memoColors = useMemo(() => Utils.getVariblesColor(varibles), [
    darkMode,
  ]);
  return { darkMode, colors: memoColors };
}

export function useEchartResize() {}

export function useActions(actions: any, deps?: any[]) {
  const dispatch = useDispatch();
  return useMemo(
    () => {
      if (Array.isArray(actions)) {
        return actions.map((a) => bindActionCreators(a, dispatch));
      }
      return bindActionCreators(actions, dispatch);
    },
    deps ? [dispatch, ...deps] : [dispatch]
  );
}
