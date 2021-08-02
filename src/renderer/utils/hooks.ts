import { useCallback, useLayoutEffect, useMemo, useState, useEffect, useRef, Fragment } from 'react';
import { useInterval, useBoolean, useThrottleFn, useSize } from 'ahooks';
import { bindActionCreators } from 'redux';
import { batch, useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import * as echarts from 'echarts';

import { updateAvaliableAction } from '@/actions/updater';
import { loadWalletsFundsAction, loadFixWalletsFundsAction } from '@/actions/wallet';
import { loadQuotationsWithoutLoadingAction } from '@/actions/quotation';
import { loadZindexsWithoutLoadingAction } from '@/actions/zindex';
import { loadStocksWithoutLoadingAction, updateStockAction } from '@/actions/stock';
import { updateFundAction, setFundConfigAction, loadFundsAction, loadRemoteFundsAction, loadFixFundsAction } from '@/actions/fund';
import { StoreState } from '@/reducers/types';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Adapter from '@/utils/adpters';
import * as Services from '@/services';
import * as Helpers from '@/helpers';
import * as Enums from '@/utils/enums';

const { invoke, dialog, ipcRenderer, clipboard, app } = window.contextModules.electron;

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

export function useUpdater() {
  const dispatch = useDispatch();
  const { autoCheckUpdateSetting } = useSelector((state: StoreState) => state.setting.systemSetting);
  // 一个小时检查一次版本
  useInterval(() => autoCheckUpdateSetting && ipcRenderer.send('check-update'), 1000 * 60 * 60);

  useEffect(() => {
    ipcRenderer.on('update-available', (e, data) => {
      if (autoCheckUpdateSetting) {
        dispatch(updateAvaliableAction(data));
      }
    });
    return () => {
      ipcRenderer.removeAllListeners('update-available');
    };
  }, [autoCheckUpdateSetting]);
}

export function useConfigClipboard() {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    ipcRenderer.on('clipboard-funds-import', async (e, data) => {
      try {
        const limit = 1024;
        const text = clipboard.readText();
        const json: any[] = JSON.parse(text);
        if (json.length > limit) {
          dialog.showMessageBox({
            type: 'info',
            title: `超过最大限制`,
            message: `最大${limit}个`,
          });
          return;
        }
        const fundConfig = json
          .map((fund) => ({
            name: '',
            cyfe: Number(fund.cyfe) < 0 ? 0 : Number(fund.cyfe) || 0,
            code: fund.code && String(fund.code),
            cbj: Utils.NotEmpty(fund.cbj) ? (Number(fund.cbj) < 0 ? undefined : Number(fund.cbj)) : undefined,
          }))
          .filter(({ code }) => code);
        const codeMap = Helpers.Fund.GetCodeMap(fundConfig);
        // 去重复
        const fundConfigSet = Object.entries(codeMap).map(([code, fund]) => fund);
        const responseFunds = (await Helpers.Fund.GetFunds(fundConfigSet)).filter(Utils.NotEmpty);
        const newFundConfig = responseFunds.map((fund) => ({
          name: fund!.name!,
          code: fund!.fundcode!,
          cyfe: codeMap[fund!.fundcode!].cyfe,
          cbj: codeMap[fund!.fundcode!].cbj,
        }));
        const currentWalletCode = Helpers.Wallet.GetCurrentWalletCode();
        batch(() => {
          dispatch(setFundConfigAction(newFundConfig, currentWalletCode));
          dispatch(loadFundsAction());
        });
        await dialog.showMessageBox({
          type: 'info',
          title: `导入完成`,
          message: `更新：${newFundConfig.length}个，总共：${json.length}个`,
        });
      } catch (error) {
        console.log('基金json解析失败', error);
        dialog.showMessageBox({
          type: 'info',
          title: `基金JSON解析失败`,
          message: `请检查JSON格式`,
        });
      }
    });
    ipcRenderer.on('clipboard-funds-copy', (e, data) => {
      try {
        const currentWalletCode = Helpers.Wallet.GetCurrentWalletCode();
        const { fundConfig } = Helpers.Fund.GetFundConfig(currentWalletCode);
        clipboard.writeText(JSON.stringify(fundConfig));
        dialog.showMessageBox({
          title: `复制成功`,
          type: 'info',
          message: `已复制${fundConfig.length}支基金配置到粘贴板`,
        });
      } catch (error) {
        console.log('复制基金json失败', error);
      }
    });
    return () => {
      ipcRenderer.removeAllListeners('update-available');
      ipcRenderer.removeAllListeners('clipboard-funds-import');
    };
  }, []);
}

export function useTrayContent() {
  const { trayContentSetting } = useSelector((state: StoreState) => state.setting.systemSetting);
  const currentWalletCode = useSelector((state: StoreState) => state.wallet.currentWalletCode);
  const {
    currentWalletState: { funds },
  } = useCurrentWallet();
  const calcResult = Helpers.Fund.CalcFunds(funds, currentWalletCode);

  useEffect(() => {
    let content = '';
    switch (trayContentSetting) {
      case Enums.TrayContent.Sy:
        content = ` ${Utils.Yang(calcResult.sygz.toFixed(2))} ¥`;
        break;
      case Enums.TrayContent.Syl:
        content = ` ${Utils.Yang(calcResult.gssyl.toFixed(2))} %`;
        break;
      case Enums.TrayContent.None:
      default:
        break;
    }
    ipcRenderer.invoke('set-tray-content', content);
    return () => {
      ipcRenderer.removeAllListeners('set-tray-content');
    };
  }, [trayContentSetting, calcResult]);
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

export function useResizeEchart(scale = 1) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);
  const { width: chartRefWidth } = useSize(chartRef);
  useEffect(() => {
    const instance = echarts.init(chartRef.current!, undefined, {
      renderer: 'svg',
    });
    setChartInstance(instance);
  }, []);

  useEffect(() => {
    chartInstance?.resize({ height: chartRefWidth! * scale });
  }, [chartRefWidth]);
  return { ref: chartRef, chartRefWidth, chartInstance, setChartInstance };
}

export function useRenderEcharts(callback: () => void, instance: echarts.ECharts | null, dep: any[] = []) {
  useEffect(() => {
    if (instance) {
      callback();
    }
  }, [instance, ...dep]);
}

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
            cbj: null,
          })
        );
      });
    } catch (error) {
      console.log(error);
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
      await Adapter.ChokeAllAdapter(collectors, 100);
    } catch (error) {
      console.log(error);
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

export function useAdjustmentNotification() {
  const systemSetting = useSelector((state: StoreState) => state.setting.systemSetting);
  const { adjustmentNotificationSetting, adjustmentNotificationTimeSetting } = systemSetting;

  useInterval(
    async () => {
      if (!adjustmentNotificationSetting) {
        return;
      }
      const timestamp = await Helpers.Time.GetCurrentHours();
      const { isAdjustmentNotificationTime, now } = Utils.JudgeAdjustmentNotificationTime(
        Number(timestamp),
        adjustmentNotificationTimeSetting
      );
      const month = now.get('month');
      const date = now.get('date');
      const hour = now.get('hour');
      const minute = now.get('minute');
      const currentDate = `${month}-${date}`;
      const lastNotificationDate = Utils.GetStorage(CONST.STORAGE.ADJUSTMENT_NOTIFICATION_DATE, '');
      if (isAdjustmentNotificationTime && currentDate !== lastNotificationDate) {
        const notification = new Notification('调仓提醒', {
          body: `当前时间${hour}:${minute} 注意行情走势`,
        });
        notification.onclick = () => {
          invoke.showCurrentWindow();
        };
        Utils.SetStorage(CONST.STORAGE.ADJUSTMENT_NOTIFICATION_DATE, currentDate);
      }
    },
    1000 * 50,
    {
      immediate: true,
    }
  );
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
  const { run: runLoadFunds } = useThrottleFn(useActions(loadFundsAction), {
    wait: throttleDelay,
  });
  const { run: runLoadFixFunds } = useThrottleFn(useActions(loadFixFundsAction), {
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

export function useBootStrap() {
  const { freshDelaySetting, autoFreshSetting } = useSelector((state: StoreState) => state.setting.systemSetting);
  const runLoadRemoteFunds = useActions(loadRemoteFundsAction);
  const runLoadWalletsFunds = useActions(loadWalletsFundsAction);
  const runLoadFixWalletsFunds = useActions(loadFixWalletsFundsAction);
  const runLoadZindexs = useActions(loadZindexsWithoutLoadingAction);
  const runLoadQuotations = useActions(loadQuotationsWithoutLoadingAction);
  const runLoadStocks = useActions(loadStocksWithoutLoadingAction);

  // 间隔时间刷新远程基金数据
  useInterval(() => {
    runLoadRemoteFunds();
  }, 1000 * 60 * 60 * 24);

  // 间隔时间刷新基金,指数，板块，钱包
  useWorkDayTimeToDo(() => {
    if (autoFreshSetting) {
      Adapter.ConCurrencyAllAdapter([
        () => Adapter.ChokeAllAdapter([runLoadWalletsFunds]),
        () => Adapter.ChokeAllAdapter([runLoadZindexs, runLoadQuotations, runLoadStocks]),
      ]);
    }
  }, freshDelaySetting * 1000 * 60);

  // 间隔时间检查最新净值
  useFixTimeToDo(() => {
    if (autoFreshSetting) {
      Adapter.ChokeAllAdapter([runLoadFixWalletsFunds]);
    }
  }, freshDelaySetting * 1000 * 60);

  // 第一次刷新所有数据
  useEffect(() => {
    Adapter.ConCurrencyAllAdapter([
      () => Adapter.ChokeAllAdapter([runLoadRemoteFunds, runLoadWalletsFunds, runLoadFixWalletsFunds]),
      () => Adapter.ChokeAllAdapter([runLoadZindexs, runLoadQuotations, runLoadStocks]),
    ]);
  }, []);
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

export function useMappingLocalToSystemSetting() {
  const systemThemeSetting = useSelector((state: StoreState) => state.setting.systemSetting.systemThemeSetting);
  const autoStartSetting = useSelector((state: StoreState) => state.setting.systemSetting.autoStartSetting);
  const lowKeySetting = useSelector((state: StoreState) => state.setting.systemSetting.lowKeySetting);
  const adjustmentNotificationTimeSetting = useSelector(
    (state: StoreState) => state.setting.systemSetting.adjustmentNotificationTimeSetting
  );
  useLayoutEffect(() => {
    Utils.UpdateSystemTheme(systemThemeSetting);
  }, [systemThemeSetting]);
  useLayoutEffect(() => {
    app.setLoginItemSettings({
      openAtLogin: autoStartSetting,
    });
  }, [autoStartSetting]);
  useLayoutEffect(() => {
    if (lowKeySetting) {
      document.body.classList.add('lowKey');
    } else {
      document.body.classList.remove('lowKey');
    }
  }, [lowKeySetting]);
  useLayoutEffect(() => {
    Utils.ClearStorage(CONST.STORAGE.ADJUSTMENT_NOTIFICATION_DATE);
  }, [adjustmentNotificationTimeSetting]);
}
