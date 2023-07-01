import React, { useLayoutEffect, useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useRequest } from 'ahooks';
import { useInterval, useBoolean, useThrottleFn, useSize, useMemoizedFn, useEventListener } from 'ahooks';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import dayjs from 'dayjs';
import * as echarts from 'echarts/core';

import {
  updateFundAction,
  sortFundsCachedAction,
  setRemoteFundsAction,
  setFundRatingAction,
  setFundsLoadingAction,
  setRemoteFundsLoadingAction,
} from '@/store/features/fund';
import { setQuotationsLoadingAction } from '@/store/features/quotation';
import { openWebAction } from '@/store/features/web';
import { syncFixWalletStateAction, updateWalletStateAction } from '@/store/features/wallet';
import {
  setCoinsLoadingAction,
  setRemoteCoinsLoadingAction,
  sortCoinsCachedAction,
  setRemoteCoinsAction,
} from '@/store/features/coin';
import { updateStockAction, sortStocksCachedAction, setStocksLoadingAction } from '@/store/features/stock';
import { setZindexesLoadingAction, sortZindexsCachedAction } from '@/store/features/zindex';
import { sortQuotationsCachedAction } from '@/store/features/quotation';
import { TypedDispatch, StoreState } from '@/store';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';
import * as Adapters from '@/utils/adpters';
import * as Services from '@/services';
import * as Helpers from '@/helpers';

const { ipcRenderer } = window.contextModules.electron;

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

export function useResizeEchart(scale = 1, unlimited?: boolean) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts>();
  const chartWidth = useSize(chartRef)?.width;
  // const chartWidth = useDeferredValue(size?.width);

  useEffect(() => {
    const instance = echarts.init(chartRef.current!, undefined, {
      renderer: 'svg',
    });
    chartInstanceRef.current = instance;
    return () => {
      instance.dispose();
    };
  }, []);

  useAfterMountedEffect(() => {
    React.startTransition(() => {
      if (chartWidth) {
        const height = chartWidth * scale;
        chartInstanceRef.current?.resize({ height: unlimited ? height : height > 200 ? 200 : height });
      }
    });
  }, [chartWidth, unlimited]);

  return { ref: chartRef, chartInstance: chartInstanceRef.current, chartInstanceRef };
}

export function useAutoSizeEchart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts>();
  const chartWidth = useSize(chartRef)?.width;
  const chartHeight = useSize(chartRef)?.height;

  useEffect(() => {
    const instance = echarts.init(chartRef.current!, undefined, {
      renderer: 'svg',
    });
    chartInstanceRef.current = instance;
    return () => {
      instance.dispose();
    };
  }, []);

  useAfterMountedEffect(() => {
    React.startTransition(() => {
      if (chartWidth && chartHeight) {
        chartInstanceRef.current?.resize();
      }
    });
  }, [chartWidth, chartHeight]);

  return { ref: chartRef, chartInstance: chartInstanceRef.current, chartInstanceRef };
}

export function useEchartEventEffect(fn: () => void | (() => void), instance?: echarts.ECharts) {
  const initRef = useRef(false);
  const unMountRef = useRef<any>();

  useEffect(() => {
    if (instance && !initRef.current) {
      initRef.current = true;
      unMountRef.current = fn();
    }
  }, [instance]);

  useEffect(
    () => () => {
      if (initRef.current) {
        unMountRef.current?.();
      }
    },
    []
  );
}

export function useRenderEcharts(
  callback: (data: { varibleColors: Record<keyof typeof CONST.VARIBLES, string> }) => void,
  instance?: echarts.ECharts,
  dep: any[] = []
) {
  const varibleColors = useAppSelector((state) => state.setting.varibleColors);
  useEffect(() => {
    if (instance) {
      callback({ varibleColors });
    }
  }, [instance, varibleColors, ...dep]);
}

export function useSyncFixFundSetting() {
  const dispatch = useAppDispatch();
  const [done, { setTrue, setFalse }] = useBoolean(false);
  const fundConfig = useAppSelector((state) => state.wallet.fundConfig);
  const fundApiTypeSetting = useAppSelector((state) => state.setting.systemSetting.fundApiTypeSetting);

  async function fixFundSetting(fundConfig: Fund.SettingItem[]) {
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
      setFalse();
      fixFundSetting(unNamedFunds);
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
  const fn = useTabsFreshFn(Enums.TabKeyType.Fund, freshFunds);
  return fn;
}

export function useLoadFunds(loading: boolean) {
  const dispatch = useAppDispatch();
  const currentWalletCode = useAppSelector((state) => state.wallet.currentWalletCode);
  const fundConfig = useAppSelector((state) => state.wallet.fundConfig);
  const fundApiTypeSetting = useAppSelector((state) => state.setting.systemSetting.fundApiTypeSetting);
  const load = useMemoizedFn(async () => {
    try {
      dispatch(setFundsLoadingAction(loading));
      const responseFunds = await Helpers.Fund.GetFunds(fundConfig, fundApiTypeSetting);
      dispatch(sortFundsCachedAction({ responseFunds, walletCode: currentWalletCode }));
      dispatch(setFundsLoadingAction(false));
    } catch (error) {
      dispatch(setFundsLoadingAction(false));
    }
  });

  const fn = useTabsFreshFn(Enums.TabKeyType.Fund, load);
  return fn;
}

export function useLoadFixFunds() {
  const dispatch = useAppDispatch();
  const currentWallet = useAppSelector((state) => state.wallet.currentWallet);

  const load = useMemoizedFn(async () => {
    try {
      const { funds, code } = currentWallet;
      const fixFunds = (await Helpers.Fund.GetFixFunds(funds)).filter(Utils.NotEmpty);
      const now = dayjs().format('MM-DD HH:mm:ss');
      dispatch(syncFixWalletStateAction({ code, funds: fixFunds, updateTime: now }));
    } catch (error) {}
  });
  const fn = useTabsFreshFn(Enums.TabKeyType.Fund, load);
  return fn;
}

export function useLoadRemoteFunds() {
  const dispatch = useAppDispatch();

  const load = useMemoizedFn(async () => {
    try {
      dispatch(setRemoteFundsLoadingAction(true));
      const remoteFunds = await Services.Fund.GetRemoteFundsFromEastmoney();
      dispatch(setRemoteFundsAction(remoteFunds));
      dispatch(setRemoteFundsLoadingAction(false));
    } catch (error) {
      dispatch(setRemoteFundsLoadingAction(false));
    }
  });

  return load;
}

export function useLoadFundRatingMap() {
  const dispatch = useAppDispatch();

  const load = useMemoizedFn(async () => {
    try {
      const remoteRantings = await Services.Fund.GetFundRatingFromEasemoney();
      dispatch(setFundRatingAction(remoteRantings));
    } catch (error) {}
  });

  return load;
}

export function useLoadWalletsFunds() {
  const dispatch = useAppDispatch();
  const { walletConfig } = useAppSelector((state) => state.wallet.config);
  const fundApiTypeSetting = useAppSelector((state) => state.setting.systemSetting.fundApiTypeSetting);

  const load = useMemoizedFn(async () => {
    // 优化多钱包同一支基金重复获取
    const responseMap = {} as Record<string, PromiseInnerType<ReturnType<typeof Helpers.Fund.GetFunds>>[number]>;
    try {
      const collects = walletConfig.map(({ funds: fundsConfig, code: walletCode }) => async () => {
        const unRequestConfig = fundsConfig.filter(({ code }) => !responseMap[code]); // 未请求过的配置
        const responseFunds = await Helpers.Fund.GetFunds(unRequestConfig, fundApiTypeSetting);
        // 将请求的结果保存到map
        responseFunds.forEach((response) => {
          responseMap[response.fundcode!] = response;
        });
        // 用code去取已经获取到的结果
        const finalResponseFunds = fundsConfig
          .filter(({ code }) => !!responseMap[code])
          .map(({ code }) => responseMap[code]);
        const now = dayjs().format('MM-DD HH:mm:ss');
        dispatch(updateWalletStateAction({ code: walletCode, funds: finalResponseFunds, updateTime: now }));
        return responseFunds;
      });
      await Adapters.ChokeAllAdapter(collects, CONST.DEFAULT.LOAD_WALLET_DELAY);
    } catch (error) {}
  });

  const fn = useTabsFreshFn(Enums.TabKeyType.Fund, load);
  return fn;
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
          const fixFunds = await Adapters.ChokeGroupAdapter(collectors, 5, 100);
          const now = dayjs().format('MM-DD HH:mm:ss');
          dispatch(
            syncFixWalletStateAction({ code: wallet.code, funds: fixFunds.filter(Utils.NotEmpty), updateTime: now })
          );
          return fixFunds;
        };
      });

      await Adapters.ChokeAllAdapter(fixCollects, CONST.DEFAULT.LOAD_WALLET_DELAY);
    } catch (error) {}
  });

  return load;
}

export function useFreshZindexs(throttleDelay: number) {
  const loadZindexs = useLoadZindexs(true);
  const { run: runLoadZindexs } = useThrottleFn(loadZindexs, { wait: throttleDelay });
  const freshZindexs = useScrollToTop({ after: () => runLoadZindexs() });
  const fn = useTabsFreshFn(Enums.TabKeyType.Zindex, freshZindexs);
  return fn;
}

export function useLoadZindexs(loading: boolean) {
  const dispatch = useAppDispatch();
  const zindexConfig = useAppSelector((state) => state.zindex.config.zindexConfig);
  const load = useMemoizedFn(async () => {
    try {
      dispatch(setZindexesLoadingAction(loading));
      const responseZindexs = await Helpers.Zindex.GetZindexs(zindexConfig);
      dispatch(sortZindexsCachedAction(responseZindexs));
      dispatch(setZindexesLoadingAction(false));
    } catch (error) {
      dispatch(setZindexesLoadingAction(false));
    }
  });
  const fn = useTabsFreshFn(Enums.TabKeyType.Zindex, load);
  return fn;
}

export function useFreshQuotations(throttleDelay: number) {
  const loadQuotations = useLoadQuotations(true);
  const { run: runLoadQuotations } = useThrottleFn(loadQuotations, { wait: throttleDelay });
  const freshQuotations = useScrollToTop({ after: () => runLoadQuotations() });
  const fn = useTabsFreshFn(Enums.TabKeyType.Quotation, freshQuotations);
  return fn;
}

export function useLoadQuotations(loading: boolean) {
  const dispatch = useAppDispatch();

  const load = useMemoizedFn(async () => {
    try {
      dispatch(setQuotationsLoadingAction(loading));
      const responseQuotations = await Helpers.Quotation.GetQuotations();
      dispatch(sortQuotationsCachedAction(responseQuotations));
      dispatch(setQuotationsLoadingAction(false));
    } catch (error) {
      dispatch(setQuotationsLoadingAction(false));
    }
  });
  const fn = useTabsFreshFn(Enums.TabKeyType.Quotation, load);
  return fn;
}

export function useFreshStocks(throttleDelay: number) {
  const loadStocks = useLoadStocks(true);
  const { run: runLoadStocks } = useThrottleFn(loadStocks, { wait: throttleDelay });
  const freshStocks = useScrollToTop({ after: () => runLoadStocks(true) });
  const fn = useTabsFreshFn(Enums.TabKeyType.Stock, freshStocks);
  return fn;
}

export function useLoadStocks(loading: boolean) {
  const dispatch = useAppDispatch();
  const stockConfig = useAppSelector((state) => state.stock.config.stockConfig);

  const load = useMemoizedFn(async () => {
    try {
      dispatch(setStocksLoadingAction(loading));
      const responseStocks = await Helpers.Stock.GetStocks(stockConfig);
      dispatch(sortStocksCachedAction(responseStocks));
      dispatch(setStocksLoadingAction(false));
    } catch (error) {
      dispatch(setStocksLoadingAction(false));
    }
  });
  const fn = useTabsFreshFn(Enums.TabKeyType.Stock, load);
  return fn;
}

export function useFreshCoins(throttleDelay: number) {
  const loadCoins = useLoadCoins(true);
  const { run: runLoadCoins } = useThrottleFn(loadCoins, { wait: throttleDelay });
  const freshCoins = useScrollToTop({ after: () => runLoadCoins() });
  const fn = useTabsFreshFn(Enums.TabKeyType.Coin, freshCoins);
  return fn;
}

export function useLoadCoins(showLoading: boolean) {
  const dispatch = useAppDispatch();
  const config = useAppSelector((state) => state.coin.config.coinConfig);
  const coinUnitSetting = useAppSelector((state) => state.setting.systemSetting.coinUnitSetting);

  const load = useMemoizedFn(async () => {
    try {
      dispatch(setCoinsLoadingAction(showLoading));
      const responseCoins = await Helpers.Coin.GetCoins(config, coinUnitSetting);
      dispatch(sortCoinsCachedAction(responseCoins));
      dispatch(setCoinsLoadingAction(false));
    } catch (error) {
      dispatch(setCoinsLoadingAction(false));
    }
  });
  const fn = useTabsFreshFn(Enums.TabKeyType.Coin, load);
  return fn;
}

export function useLoadRemoteCoins() {
  const dispatch = useAppDispatch();
  const load = useMemoizedFn(async () => {
    try {
      dispatch(setRemoteCoinsLoadingAction(true));
      const remoteCoins = await Services.Coin.GetRemoteCoinsFromCoingecko();
      dispatch(setRemoteCoinsAction(remoteCoins));
      dispatch(setRemoteCoinsLoadingAction(false));
    } catch (error) {
      dispatch(setRemoteCoinsLoadingAction(false));
    }
  });
  return load;
}

export function useDrawer<T>(initialData: T) {
  const [drawer, setDrawer] = useState({
    data: initialData,
    show: false,
  });

  const set = useMemoizedFn((data: T) => setDrawer({ show: true, data }));
  const close = useMemoizedFn(() => setDrawer({ show: false, data: initialData }));
  const open = useMemoizedFn(() => setDrawer((_) => ({ ..._, show: true })));

  return {
    data: drawer.data,
    show: drawer.show,
    set,
    close,
    open,
  };
}

export function useAfterMountedEffect(fn: any, dep: any[] = []) {
  const flagRef = useRef(false);
  useEffect(() => {
    flagRef.current = true;
  }, []);
  useEffect(() => {
    if (flagRef.current) {
      fn();
    }
  }, dep);
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

export function useIpcRendererListener(
  channel: string,
  listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
) {
  const callback = useMemoizedFn(listener);

  useEffect(() => {
    ipcRenderer.on(channel, callback);
    return () => {
      ipcRenderer.removeListener(channel, callback);
    };
  }, []);
}

export function useTabsFreshFn<T>(key: Enums.TabKeyType, fn: T) {
  const bottomTabsSetting = useAppSelector((state) => state.setting.systemSetting.bottomTabsSetting);
  const bottomTabsSettingKeyMap = Utils.GetCodeMap(bottomTabsSetting, 'key');
  return bottomTabsSettingKeyMap[key].show ? fn : async () => {};
}

export function useInputShortcut(initial: string) {
  const [hotkey, setHotkey] = useState(initial);
  const [isInput, { setTrue, setFalse }] = useBoolean(false);

  useEventListener('keydown', (e) => {
    if (isInput) {
      const { ctrlKey, metaKey, altKey, shiftKey, key } = e;
      const keys = [ctrlKey && 'control', metaKey && 'meta', altKey && 'alt', shiftKey && 'shift', key && key].filter(
        (_) => _
      ) as string[];
      const hotkeys = Array.from(new Set(keys.map((_) => _.toLocaleLowerCase())));
      setHotkey(hotkeys.join(' + '));
    }
  });

  function reset() {
    setHotkey('');
  }

  return {
    hotkey,
    reset,
    onBlur: setFalse,
    onFocus: setTrue,
  };
}

export function useThemeColor() {
  const originPrimaryColor = '#1677ff';
  const themeColorTypeSetting = useAppSelector((state) => state.setting.systemSetting.themeColorTypeSetting);
  const customThemeColorSetting = useAppSelector((state) => state.setting.systemSetting.customThemeColorSetting);
  const customThemeColorEnable = themeColorTypeSetting === Enums.ThemeColorType.Custom;

  return {
    themeColorTypeSetting,
    customThemeColorSetting,
    originPrimaryColor,
    customThemeColorEnable,
  };
}

export function useRouterParams<T = Record<string, unknown>>() {
  const location = useLocation();
  return queryString.parse(location.search, {
    parseBooleans: true,
  }) as T;
}

export function useFakeUA(phone: boolean) {
  const phoneFakeUA =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

  const { data: fakeUA } = useRequest((): Promise<string> => ipcRenderer.invoke('get-fakeUA'), {
    cacheKey: 'invoke-get-fakeUA',
    cacheTime: -1,
    ready: !phone,
  });

  return phone ? phoneFakeUA : fakeUA;
}
