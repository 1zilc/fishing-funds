import { useLayoutEffect, useState, useEffect, useRef, useMemo, useTransition } from 'react';
import { useInterval, useBoolean, useThrottleFn, useSize, useMemoizedFn } from 'ahooks';
import { useDispatch, useSelector, TypedUseSelectorHook, batch } from 'react-redux';
import dayjs from 'dayjs';
import * as echarts from 'echarts';

import { updateStockAction } from '@/actions/stock';
import { sortZindexsCachedAction } from '@/store/features/zindex';
import { sortQuotationsCachedAction } from '@/store/features/quotation';
import {
  updateFundAction,
  sortFundsCachedAction,
  setRemoteFundsAction,
  setFundRatingMapAction,
  setFundsLoading,
  setRemoteFundsLoading,
} from '@/store/features/fund';
import { setQuotationsLoading } from '@/store/features/quotation';
import { openWebAction } from '@/store/features/web';
import { syncFixWalletStateAction, updateWalletStateAction } from '@/store/features/wallet';
import { TypedDispatch, StoreState } from '@/store';
import { setCoinsLoading, setRemoteCoinsLoading, sortCoinsCachedAction, setRemoteCoinsAction } from '@/store/features/coin';
import { setZindexesLoading } from '@/store/features/zindex';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Adapters from '@/utils/adpters';
import * as Services from '@/services';
import * as Helpers from '@/helpers';
import * as Enums from '@/utils/enums';

const { invoke, ipcRenderer } = window.contextModules.electron;

export const useAppDispatch = () => useDispatch<TypedDispatch>();

export const useAppSelector: TypedUseSelectorHook<StoreState> = useSelector;

export function useWorkDayTimeToDo(todo: () => void, delay: number, config?: { immediate: boolean }): void {
  const { timestampSetting } = useAppSelector((state) => state.setting.systemSetting);
  useInterval(
    async () => {
      const timestamp = await Helpers.Time.GetCurrentHours(timestampSetting);
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
  const { timestampSetting } = useAppSelector((state) => state.setting.systemSetting);
  useInterval(
    async () => {
      const timestamp = await Helpers.Time.GetCurrentHours(timestampSetting);
      const isFixTime = Utils.JudgeFixTime(Number(timestamp));
      if (isFixTime) {
        todo();
      }
    },
    delay,
    config
  );
}

export function useScrollToTop(config: {
  before?: () => void | Promise<void>;
  after?: () => void | Promise<void>;
  option?: {
    behavior?: ScrollBehavior;
    left?: number;
    top?: number;
  };
}) {
  return useMemoizedFn(async () => {
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
  });
}

export function useNativeTheme() {
  const [darkMode, setDarkMode] = useState(false);
  const systemSetting = useAppSelector((state) => state.setting.systemSetting);
  const { systemThemeSetting } = systemSetting;
  async function syncSystemTheme() {
    await Utils.UpdateSystemTheme(systemThemeSetting);
    await invoke.getShouldUseDarkColors().then(setDarkMode);
  }

  useEffect(() => {
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
  const lowKeySetting = useAppSelector((state) => state.setting.systemSetting.lowKeySetting);
  const [colors, setColors] = useState<any>({});

  useEffect(() => {
    setColors(Utils.getVariblesColor(varibles));
  }, [darkMode, lowKeySetting]);

  return { darkMode, colors };
}

export function useResizeEchart(scale = 1, unlimited?: boolean) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts>();
  const size = useSize(chartRef);
  useEffect(() => {
    const instance = echarts.init(chartRef.current!, undefined, {
      renderer: 'svg',
    });
    chartInstanceRef.current = instance;
    return () => {
      instance.dispose();
    };
  }, []);

  useEffect(() => {
    if (size?.width) {
      const height = size.width * scale;
      chartInstanceRef.current?.resize({ height: unlimited ? height : height > 200 ? 200 : height });
    }
  }, [size?.width, unlimited]);

  return { ref: chartRef, chartInstance: chartInstanceRef.current };
}

export function useRenderEcharts(callback: () => void, instance?: echarts.ECharts, dep: any[] = []) {
  useEffect(() => {
    if (instance) {
      callback();
    }
  }, [instance, ...dep]);
}

export function useSyncFixFundSetting() {
  const dispatch = useAppDispatch();
  const [done, { setTrue }] = useBoolean(false);
  const { currentWalletFundsConfig: fundConfig } = useCurrentWallet();
  const fundApiTypeSetting = useAppSelector((state) => state.setting.systemSetting.fundApiTypeSetting);

  async function FixFundSetting(fundConfig: Fund.SettingItem[]) {
    try {
      const responseFunds = await Helpers.Fund.GetFunds(fundConfig, fundApiTypeSetting);
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
  const dispatch = useAppDispatch();
  const [done, { setTrue, setFalse }] = useBoolean(true);
  const { stockConfig } = useAppSelector((state) => state.stock.config);
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
      setFalse();
      FixStockSetting(unTypedStocks);
    }
  }, [stockConfig]);

  return { done };
}

export function useCurrentWallet() {
  const { walletConfig } = useAppSelector((state) => state.wallet.config);
  const wallets = useAppSelector((state) => state.wallet.wallets);
  const currentWalletCode = useAppSelector((state) => state.wallet.currentWalletCode);
  const fundConfig = useAppSelector((state) => state.wallet.fundConfig);
  const fundConfigCodeMap = useAppSelector((state) => state.wallet.fundConfigCodeMap);
  const currentWalletConfig = Helpers.Wallet.GetCurrentWalletConfig(currentWalletCode, walletConfig);
  const currentWalletState = Helpers.Wallet.GetCurrentWalletState(currentWalletCode, wallets);
  const currentWalletFundsConfig = currentWalletConfig.funds;
  const currentWalletFundsCodeMap = Utils.GetCodeMap(currentWalletConfig.funds, 'code');

  return {
    currentWalletFundsConfig, // 当前钱包基金配置
    currentWalletFundsCodeMap, // 当前钱包基金配置 codemap
    currentWalletConfig, // 当前钱包配置
    fundConfig,
    currentWalletCode, // 当前钱包 code
    currentWalletState, // 当前钱包状态
    fundConfigCodeMap,
  };
}

export function useFreshFunds(throttleDelay: number) {
  const loadFunds = useLoadFunds(true);
  const loadFixFunds = useLoadFixFunds();
  const { run: runLoadFunds } = useThrottleFn(loadFunds, {
    wait: throttleDelay,
  });
  const { run: runLoadFixFunds } = useThrottleFn(loadFixFunds, {
    wait: throttleDelay,
  });
  const freshFunds = useScrollToTop({
    after: async () => {
      const isFixTime = Utils.JudgeFixTime(dayjs().valueOf());
      await runLoadFunds();
      if (isFixTime) {
        await runLoadFixFunds();
      }
    },
  });
  return freshFunds;
}

export function useLoadFunds(loading: boolean) {
  const dispatch = useAppDispatch();
  const currentWalletCode = useAppSelector((state) => state.wallet.currentWalletCode);
  const fundConfig = useAppSelector((state) => state.wallet.fundConfig);
  const fundApiTypeSetting = useAppSelector((state) => state.setting.systemSetting.fundApiTypeSetting);

  const load = useMemoizedFn(async () => {
    try {
      dispatch(setFundsLoading(loading));
      const responseFunds = await Helpers.Fund.GetFunds(fundConfig, fundApiTypeSetting);
      batch(() => {
        dispatch(sortFundsCachedAction(responseFunds, currentWalletCode));
        dispatch(setFundsLoading(false));
      });
    } catch (error) {
      dispatch(setFundsLoading(false));
    }
  });
  return load;
}

export function useLoadFixFunds() {
  const dispatch = useAppDispatch();
  const { currentWalletState } = useCurrentWallet();

  const load = useMemoizedFn(async () => {
    try {
      const { funds, code } = currentWalletState;
      const fixFunds = (await Helpers.Fund.GetFixFunds(funds)).filter(Utils.NotEmpty);
      const now = dayjs().format('MM-DD HH:mm:ss');
      dispatch(syncFixWalletStateAction({ code, funds: fixFunds, updateTime: now }));
    } catch (error) {}
  });

  return load;
}

export function useLoadRemoteFunds() {
  const dispatch = useAppDispatch();

  const load = useMemoizedFn(async () => {
    try {
      dispatch(setRemoteFundsLoading(true));
      const remoteFunds = await Services.Fund.GetRemoteFundsFromEastmoney();
      batch(() => {
        dispatch(setRemoteFundsAction(remoteFunds));
        dispatch(setRemoteFundsLoading(false));
      });
    } catch (error) {
      dispatch(setRemoteFundsLoading(false));
    }
  });

  return load;
}

export function useLoadFundRatingMap() {
  const dispatch = useAppDispatch();

  const load = useMemoizedFn(async () => {
    try {
      const remoteRantings = await Services.Fund.GetFundRatingFromEasemoney();
      dispatch(setFundRatingMapAction(remoteRantings));
    } catch (error) {}
  });

  return load;
}

export function useLoadWalletsFunds() {
  const dispatch = useAppDispatch();
  const { walletConfig } = useAppSelector((state) => state.wallet.config);
  const fundApiTypeSetting = useAppSelector((state) => state.setting.systemSetting.fundApiTypeSetting);

  const load = useMemoizedFn(async () => {
    try {
      const collects = walletConfig.map(({ funds: fundsConfig, code: walletCode }) => async () => {
        const responseFunds = await Helpers.Fund.GetFunds(fundsConfig, fundApiTypeSetting);
        const now = dayjs().format('MM-DD HH:mm:ss');
        dispatch(updateWalletStateAction({ code: walletCode, funds: responseFunds, updateTime: now }));
        return responseFunds;
      });
      await Adapters.ChokeAllAdapter<(Fund.ResponseItem | null)[]>(collects, CONST.DEFAULT.LOAD_WALLET_DELAY);
    } catch (error) {}
  });

  return load;
}

export function useLoadFixWalletsFunds() {
  const dispatch = useAppDispatch();
  const wallets = useAppSelector((state) => state.wallet.wallets);
  const load = useMemoizedFn(async () => {
    try {
      const fixCollects = wallets.map((wallet) => {
        const collectors = (wallet.funds || [])
          .filter(({ fixDate, gztime }) => !fixDate || fixDate !== gztime?.slice(5, 10))
          .map(
            ({ fundcode }) =>
              () =>
                Services.Fund.GetFixFromEastMoney(fundcode!)
          );
        return async () => {
          const fixFunds = await Adapters.ChokeGroupAdapter<Fund.FixData>(collectors, 5, 100);
          const now = dayjs().format('MM-DD HH:mm:ss');
          dispatch(syncFixWalletStateAction({ code: wallet.code, funds: fixFunds.filter(Utils.NotEmpty), updateTime: now }));
          return fixFunds;
        };
      });

      await Adapters.ChokeAllAdapter<(Fund.FixData | null)[]>(fixCollects, CONST.DEFAULT.LOAD_WALLET_DELAY);
    } catch (error) {}
  });

  return load;
}

export function useFreshZindexs(throttleDelay: number) {
  const loadZindexs = useLoadZindexs(true);
  const { run: runLoadZindexs } = useThrottleFn(loadZindexs, { wait: throttleDelay });
  const freshZindexs = useScrollToTop({ after: () => runLoadZindexs() });
  return freshZindexs;
}

export function useLoadZindexs(loading: boolean) {
  const dispatch = useAppDispatch();
  const zindexConfig = useAppSelector((state) => state.zindex.config.zindexConfig);
  const load = useMemoizedFn(async () => {
    try {
      dispatch(setZindexesLoading(loading));
      const responseZindexs = await Helpers.Zindex.GetZindexs(zindexConfig);
      batch(() => {
        dispatch(sortZindexsCachedAction(responseZindexs));
        dispatch(setZindexesLoading(false));
      });
    } catch (error) {
      dispatch(setZindexesLoading(false));
    }
  });

  return load;
}

export function useFreshQuotations(throttleDelay: number) {
  const loadQuotations = useLoadQuotations(true);
  const { run: runLoadQuotations } = useThrottleFn(loadQuotations, { wait: throttleDelay });
  const freshQuotations = useScrollToTop({ after: () => runLoadQuotations() });
  return freshQuotations;
}

export function useLoadQuotations(loading: boolean) {
  const dispatch = useAppDispatch();

  const load = useMemoizedFn(async () => {
    try {
      dispatch(setQuotationsLoading(loading));
      const responseQuotations = await Helpers.Quotation.GetQuotations();
      batch(() => {
        dispatch(sortQuotationsCachedAction(responseQuotations));
        dispatch(setQuotationsLoading(false));
      });
    } catch (error) {
      dispatch(setQuotationsLoading(false));
    }
  });

  return load;
}

export function useFreshStocks(throttleDelay: number) {
  const { run: runLoadStocks } = useThrottleFn(Helpers.Stock.LoadStocks, { wait: throttleDelay });
  const freshStocks = useScrollToTop({ after: () => runLoadStocks(true) });
  return freshStocks;
}

export function useFreshCoins(throttleDelay: number) {
  const loadCoins = useLoadCoins(true);
  const { run: runLoadCoins } = useThrottleFn(loadCoins, { wait: throttleDelay });
  const freshCoins = useScrollToTop({ after: () => runLoadCoins() });
  return freshCoins;
}

export function useLoadCoins(showLoading: boolean) {
  const dispatch = useAppDispatch();
  const config = useAppSelector((state) => state.coin.config.coinConfig);
  const coinUnitSetting = useAppSelector((state) => state.setting.systemSetting.coinUnitSetting);

  const load = useMemoizedFn(async () => {
    try {
      dispatch(setCoinsLoading(showLoading));
      const responseCoins = await Helpers.Coin.GetCoins(config, coinUnitSetting);
      batch(() => {
        dispatch(sortCoinsCachedAction(responseCoins));
        dispatch(setCoinsLoading(false));
      });
    } catch (error) {
      dispatch(setCoinsLoading(false));
    }
  });

  return load;
}

export function useLoadRemoteCoins() {
  const dispatch = useAppDispatch();
  const load = useMemoizedFn(async () => {
    try {
      dispatch(setRemoteCoinsLoading(true));
      const remoteCoins = await Services.Coin.GetRemoteCoinsFromCoingecko();
      batch(() => {
        dispatch(setRemoteCoinsAction(remoteCoins));
        dispatch(setRemoteCoinsLoading(false));
      });
    } catch (error) {
      dispatch(setRemoteCoinsLoading(false));
    }
  });
  return load;
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
    open: () => {
      setDrawer((_) => ({ ..._, show: true }));
    },
  };
}

export function useAfterMounted(fn: any, dep: any[] = []) {
  const [flag, { setTrue }] = useBoolean(false);
  useEffect(() => {
    setTrue();
  }, []);
  useEffect(() => {
    if (flag) {
      fn();
    }
  }, [flag, ...dep]);
}

export function useFundRating(code: string) {
  const fundRatingMap = useAppSelector((state) => state.fund.fundRatingMap);
  const loadFundRatingMap = useLoadFundRatingMap();
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
    if (!Object.keys(fundRatingMap).length) {
      loadFundRatingMap();
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
  const wallets = useAppSelector((state) => state.wallet.wallets);
  const walletsConfig = useAppSelector((state) => state.wallet.config.walletConfig);

  // 持有份额的基金，response数组
  const funds = useMemo(() => {
    const allFunds: (Fund.ResponseItem & Fund.FixData)[] = [];
    const fundCodeMap = new Map();
    wallets.forEach(({ code, funds }) => {
      const { fundConfig } = Helpers.Fund.GetFundConfig(code, walletsConfig);
      const fundCodeMap = Utils.GetCodeMap(fundConfig, 'code');
      if (statusMap[code]) {
        allFunds.push(...funds.filter((fund) => !!fundCodeMap[fund.fundcode!]?.cyfe));
      }
    });
    return allFunds.filter((fund) => !fundCodeMap.has(fund.fundcode!) && fundCodeMap.set(fund.fundcode!, true));
  }, [statusMap, wallets]);

  return funds;
}

export function useOpenWebView(params: any = {}) {
  const dispatch = useAppDispatch();
  const openWebView = useMemoizedFn((args) => {
    const obj = typeof args === 'string' ? { url: args } : args;
    dispatch(openWebAction({ ...params, ...obj }));
  });
  return openWebView;
}

export function useFundConfigMap(codes: string[]) {
  const walletsConfig = useAppSelector((state) => state.wallet.config.walletConfig);
  const codeMaps = useMemo(() => Helpers.Fund.GetFundConfigMaps(codes, walletsConfig), [codes, walletsConfig]);
  return codeMaps;
}
