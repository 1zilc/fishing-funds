import { useCallback, useLayoutEffect, useState, useEffect, useRef, useMemo } from 'react';
import { useInterval, useBoolean, useThrottleFn, useSize } from 'ahooks';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import * as echarts from 'echarts';

import { updateStockAction } from '@/actions/stock';
import { updateFundAction } from '@/actions/fund';
import { StoreState } from '@/reducers/types';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Adapters from '@/utils/adpters';
import * as Services from '@/services';
import * as Helpers from '@/helpers';
import * as Enums from '@/utils/enums';

const { invoke, ipcRenderer } = window.contextModules.electron;

export function useWorkDayTimeToDo(todo: () => void, delay: number, config?: { immediate: boolean }): void {
  useInterval(
    async () => {
      const timestamp = await Helpers.Time.GetCurrentHours();
      const isWorkDayTime = Utils.JudgeWorkDayTime(Number(timestamp));
      if (isWorkDayTime) {
        todo();
      }
    },
    delay,
    config
  );
}

export function useFixTimeToDo(todo: () => void, delay: number, config?: { immediate: boolean }): void {
  useInterval(
    async () => {
      const timestamp = await Helpers.Time.GetCurrentHours();
      const isFixTime = Utils.JudgeFixTime(Number(timestamp));
      if (isFixTime) {
        todo();
      }
    },
    delay,
    config
  );
}

export function useScrollToTop(
  config: {
    before?: () => void | Promise<void>;
    after?: () => void | Promise<void>;
    option?: {
      behavior?: ScrollBehavior;
      left?: number;
      top?: number;
    };
  },
  dep: any[] = []
) {
  return useCallback(async () => {
    const { before, after, option } = config;
    if (before) {
      await before();
    }
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
      ...option,
    });
    if (after) {
      await after();
    }
  }, dep);
}

export function useNativeTheme() {
  const [darkMode, setDarkMode] = useState(false);
  const systemSetting = useSelector((state: StoreState) => state.setting.systemSetting);
  const { systemThemeSetting } = systemSetting;
  async function syncSystemTheme() {
    await Utils.UpdateSystemTheme(systemThemeSetting);
    await invoke.getShouldUseDarkColors().then(setDarkMode);
  }

  useLayoutEffect(() => {
    ipcRenderer.on('nativeTheme-updated', (e, data) => {
      setDarkMode(!!data?.darkMode);
    });
    return () => {
      ipcRenderer.removeAllListeners('nativeTheme-updated');
    };
  }, []);

  useEffect(() => {
    syncSystemTheme();
  }, [systemThemeSetting]);

  return { darkMode };
}

export function useNativeThemeColor(varibles: string[]) {
  const { darkMode } = useNativeTheme();
  const lowKeySetting = useSelector((state: StoreState) => state.setting.systemSetting.lowKeySetting);
  const [colors, setColors] = useState<any>({});

  useEffect(() => {
    setColors(Utils.getVariblesColor(varibles));
  }, [darkMode, lowKeySetting]);

  return { darkMode, colors };
}

export function useResizeEchart(scale = 1, unlimited?: boolean) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);
  const size = useSize(chartRef);
  useEffect(() => {
    const instance = echarts.init(chartRef.current!, undefined, {
      renderer: 'svg',
    });
    setChartInstance(instance);
    return () => {
      instance.dispose();
    };
  }, []);

  useEffect(() => {
    if (size?.width) {
      const height = size?.width * scale;
      chartInstance?.resize({ height: unlimited ? height : height > 200 ? 200 : height });
    }
  }, [size?.width, unlimited]);
  return { ref: chartRef, chartInstance, setChartInstance };
}

export function useRenderEcharts(callback: () => void, instance: echarts.ECharts | null, dep: any[] = []) {
  useEffect(() => {
    if (instance) {
      callback();
    }
  }, [instance, ...dep]);
}

export function useSyncFixFundSetting() {
  const dispatch = useDispatch();
  const [done, { setTrue }] = useBoolean(false);
  const { currentWalletFundsConfig: fundConfig } = useCurrentWallet();

  async function FixFundSetting(fundConfig: Fund.SettingItem[]) {
    try {
      const responseFunds = await Helpers.Fund.GetFunds(fundConfig);
      responseFunds.filter(Boolean).forEach((responseFund) => {
        dispatch(
          updateFundAction({
            code: responseFund!.fundcode!,
            name: responseFund!.name,
          })
        );
      });
    } catch (error) {
    } finally {
      setTrue();
    }
  }

  useEffect(() => {
    const unNamedFunds = fundConfig.filter(({ name }) => !name);
    if (unNamedFunds.length) {
      FixFundSetting(unNamedFunds);
    } else {
      setTrue();
    }
  }, [fundConfig]);

  return { done };
}

export function useSyncFixStockSetting() {
  const dispatch = useDispatch();
  const [done, { setTrue }] = useBoolean(false);
  const { stockConfig } = useSelector((state: StoreState) => state.stock.config);
  async function FixStockSetting(stockConfig: Stock.SettingItem[]) {
    try {
      const collectors = stockConfig.map(
        ({ name, code, secid }) =>
          () =>
            Services.Stock.SearchFromEastmoney(name).then((searchResult) => {
              searchResult?.forEach(({ Datas, Type }) => {
                Datas.forEach(({ Code }) => {
                  if (Code === code) {
                    dispatch(
                      updateStockAction({
                        secid,
                        type: Type,
                      })
                    );
                  }
                });
              });
              return searchResult;
            })
      );
      await Adapters.ChokeAllAdapter(collectors, 100);
    } catch (error) {
    } finally {
      setTrue();
    }
  }

  useEffect(() => {
    const unTypedStocks = stockConfig.filter(({ type }) => !type);
    if (unTypedStocks.length) {
      FixStockSetting(unTypedStocks);
    } else {
      setTrue();
    }
  }, [stockConfig]);

  return { done };
}

export function useCurrentWallet() {
  const { walletConfig } = useSelector((state: StoreState) => state.wallet.config);
  const wallets = useSelector((state: StoreState) => state.wallet.wallets);
  const currentWalletCode = useSelector((state: StoreState) => state.wallet.currentWalletCode);
  const currentWalletConfig = walletConfig.find(({ code }) => currentWalletCode === code)!;
  const currentWalletState = wallets.find(({ code }) => currentWalletCode === code) || {
    funds: [],
    updateTime: '',
    code: currentWalletCode,
  };
  const currentWalletFundsCodeMap = Helpers.Fund.GetCodeMap(currentWalletConfig.funds);
  const currentWalletFundsConfig = currentWalletConfig.funds;
  currentWalletState.funds = currentWalletState.funds.filter(({ fundcode }) => currentWalletFundsCodeMap[fundcode!]);

  return {
    currentWalletFundsConfig, // 当前钱包基金配置
    currentWalletFundsCodeMap, // 当前钱包基金配置 codemap
    currentWalletConfig, // 当前钱包配置
    currentWalletCode, // 当前钱包 code
    currentWalletState, // 当前钱包状态
  };
}

export function useFreshFunds(throttleDelay: number) {
  const { run: runLoadFunds } = useThrottleFn(Helpers.Fund.LoadFunds, {
    wait: throttleDelay,
  });
  const { run: runLoadFixFunds } = useThrottleFn(Helpers.Fund.LoadFixFunds, {
    wait: throttleDelay,
  });
  const freshFunds = useScrollToTop({
    after: async () => {
      const isFixTime = Utils.JudgeFixTime(dayjs().valueOf());
      await runLoadFunds(true);
      if (isFixTime) {
        await runLoadFixFunds();
      }
    },
  });
  return freshFunds;
}

export function useDrawer<T>(initialData: T) {
  const [drawer, setDrawer] = useState({
    data: initialData,
    show: false,
  });
  return {
    data: drawer.data,
    show: drawer.show,
    set: (data: T) => {
      setDrawer({ show: true, data });
    },
    close: () => {
      setDrawer({ show: false, data: initialData });
    },
  };
}

export function useAfterMounted(fn: any, dep: any[] = []) {
  const [flag, { setTrue }] = useBoolean(false);
  useEffect(() => {
    setTrue();
  }, []);
  useLayoutEffect(() => {
    if (flag) {
      fn();
    }
  }, [flag, ...dep]);
}

export function useFundRating(code: string) {
  const fundRatingMap = useSelector((state: StoreState) => state.fund.fundRatingMap);
  const fundRating = fundRatingMap[code];
  let star = 0;
  if (fundRating) {
    let total = 0;
    let count = 0;
    if (fundRating.szStar) {
      total += Number(fundRating.szStar);
      count++;
    }
    if (fundRating.zsStar) {
      total += Number(fundRating.zsStar);
      count++;
    }
    if (fundRating.jaStar) {
      total += Number(fundRating.jaStar);
      count++;
    }
    if (count === 0) {
      star = 0;
    } else {
      star = total / count;
    }
  }

  useEffect(() => {
    if (!Object.keys(fundRatingMap)) {
      Helpers.Fund.LoadFundRatingMap();
    }
  }, [fundRatingMap]);

  return {
    ...(fundRating || {}),
    star,
  };
}

export function useAutoDestroySortableRef() {
  const sortableRef = useRef<any>(null);
  useLayoutEffect(() => {
    return () => {
      sortableRef.current?.sortable?.destroy?.();
    };
  }, []);
  return sortableRef;
}

/***
 * statusMap Record<钱包code,booealn>
 */
export function useAllCyFunds(statusMap: Record<string, boolean>) {
  const wallets = useSelector((state: StoreState) => state.wallet.wallets);

  // 持有份额的基金，response数组
  const funds = useMemo(() => {
    const allFunds: (Fund.ResponseItem & Fund.FixData)[] = [];
    const fundCodeMap = new Map();
    wallets.forEach(({ code, funds }) => {
      const fundConfig = Helpers.Wallet.GetCurrentWalletConfig(code).funds;
      const fundCodeMap = Helpers.Fund.GetCodeMap(fundConfig);
      if (statusMap[code]) {
        allFunds.push(...funds.filter((fund) => !!fundCodeMap[fund.fundcode!]?.cyfe));
      }
    });
    return allFunds.filter((fund) => !fundCodeMap.has(fund.fundcode!) && fundCodeMap.set(fund.fundcode!, true));
  }, [statusMap, wallets]);

  return funds;
}
