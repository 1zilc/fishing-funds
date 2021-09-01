import { useCallback, useLayoutEffect, useState, useEffect, useRef } from 'react';
import { useInterval, useBoolean, useThrottleFn, useSize } from 'ahooks';
import { useDispatch, useSelector } from 'react-redux';
import { compose } from 'redux';
import { Base64 } from 'js-base64';
import dayjs from 'dayjs';
import * as echarts from 'echarts';

import { updateAvaliableAction } from '@/actions/updater';
import { updateStockAction } from '@/actions/stock';
import { updateFundAction, setFundConfigAction } from '@/actions/fund';
import { selectWalletAction } from '@/actions/wallet';
import { StoreState } from '@/reducers/types';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Adapters from '@/utils/adpters';
import * as Services from '@/services';
import * as Helpers from '@/helpers';
import * as Enums from '@/utils/enums';

const { invoke, dialog, ipcRenderer, clipboard, app, saveString, encodeFF, decodeFF, readFile } = window.contextModules.electron;

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
  useInterval(() => autoCheckUpdateSetting && ipcRenderer.invoke('check-update'), 1000 * 60 * 60);

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

export function useFundsClipboard() {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    ipcRenderer.on('clipboard-funds-import', async (e, data) => {
      try {
        const limit = 1024;
        const text = clipboard.readText();
        const json: any[] = JSON.parse(text);
        const currentWalletCode = Helpers.Wallet.GetCurrentWalletCode();
        if (json.length > limit) {
          dialog.showMessageBox({
            type: 'info',
            title: `超过最大限制`,
            message: `最大${limit}个`,
          });
          return;
        }
        const { codeMap: oldCodeMap } = Helpers.Fund.GetFundConfig(currentWalletCode);
        const jsonFundConfig = json
          .map((fund) => ({
            name: '',
            cyfe: Number(fund.cyfe) < 0 ? 0 : Number(fund.cyfe) || 0,
            code: fund.code && String(fund.code),
            cbj: Utils.NotEmpty(fund.cbj) ? (Number(fund.cbj) < 0 ? undefined : Number(fund.cbj)) : undefined,
          }))
          .filter(({ code }) => code);
        const jsonCodeMap = Helpers.Fund.GetCodeMap(jsonFundConfig);
        // 去重复
        const fundConfigSet = Object.entries(jsonCodeMap).map(([code, fund]) => fund);
        const responseFunds = (await Helpers.Fund.GetFunds(fundConfigSet)).filter(Utils.NotEmpty);
        const newFundConfig = responseFunds.map((fund) => ({
          name: fund!.name!,
          code: fund!.fundcode!,
          cyfe: jsonCodeMap[fund!.fundcode!].cyfe,
          cbj: jsonCodeMap[fund!.fundcode!].cbj,
        }));
        const newCodeMap = Helpers.Fund.GetCodeMap(newFundConfig);
        const allCodeMap = {
          ...oldCodeMap,
          ...newCodeMap,
        };
        const allFundConfig = Object.entries(allCodeMap).map(([code, fund]) => fund);
        dispatch(setFundConfigAction(allFundConfig, currentWalletCode));
        Helpers.Fund.LoadFunds(true);
        dialog.showMessageBox({
          type: 'info',
          title: `导入完成`,
          message: `更新：${newFundConfig.length}个，总共：${json.length}个`,
        });
      } catch (error) {
        dialog.showMessageBox({
          type: 'info',
          title: `解析失败`,
          message: `请检查JSON格式`,
        });
        console.log('基金json解析失败', error);
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
        dialog.showMessageBox({
          type: 'info',
          title: `复制失败`,
          message: `基金JSON复制失败`,
        });
        console.log('复制基金json失败', error);
      }
    });
    return () => {
      ipcRenderer.removeAllListeners('clipboard-funds-import');
      ipcRenderer.removeAllListeners('clipboard-funds-copy');
    };
  }, []);
}

export function useAllConfigBackup() {
  useLayoutEffect(() => {
    ipcRenderer.on('backup-all-config-export', async (e, data) => {
      try {
        const backupConfig = Utils.GenerateBackupConfig();
        const { filePath, canceled } = await dialog.showSaveDialog({
          title: '保存',
          defaultPath: `${backupConfig.name}-${backupConfig.timestamp}.${backupConfig.suffix}`,
        });
        if (canceled) {
          return;
        }
        const encodeBackupConfig = compose(Base64.encode, encodeFF)(backupConfig);
        saveString(filePath!, encodeBackupConfig);
        dialog.showMessageBox({
          type: 'info',
          title: `导出成功`,
          message: `已导出全局配置文件至${filePath}`,
        });
      } catch (error) {
        dialog.showMessageBox({
          type: 'info',
          title: `导出失败`,
          message: `导出全局配置文件失败`,
        });
        console.log('导出全局配置文件失败', error);
      }
    });
    ipcRenderer.on('backup-all-config-import', async (e, data) => {
      try {
        const { filePaths, canceled } = await dialog.showOpenDialog({
          title: '选择备份文件',
          filters: [{ name: 'Fishing Funds', extensions: ['ff'] }],
        });
        const filePath = filePaths[0];
        if (canceled || !filePath) {
          return;
        }
        const encodeBackupConfig = readFile(filePath);
        const backupConfig: Backup.Config = compose(decodeFF, Base64.decode)(encodeBackupConfig);
        Utils.coverBackupConfig(backupConfig);
        await dialog.showMessageBox({
          type: 'info',
          title: `导入成功`,
          message: `导入全局配置成功, 请重新启动Fishing Funds`,
        });
        app.quit();
      } catch (error) {
        dialog.showMessageBox({
          type: 'info',
          title: `导入失败`,
          message: `导入全局配置文件失败`,
        });
        console.log('导入全局配置文件失败', error);
      }
    });
    ipcRenderer.on('open-backup-file', async (e, filePath) => {
      try {
        const encodeBackupConfig = readFile(filePath);
        const backupConfig: Backup.Config = compose(decodeFF, Base64.decode)(encodeBackupConfig);
        const { response } = await dialog.showMessageBox({
          title: `确认从备份文件恢复`,
          message: `备份时间：${dayjs(backupConfig.timestamp).format('YYYY-MM-DD HH:mm:ss')} ，当前数据将被覆盖，请谨慎操作`,
          buttons: ['确定', '取消'],
        });
        if (response === 0) {
          Utils.coverBackupConfig(backupConfig);
          await dialog.showMessageBox({
            type: 'info',
            title: `恢复成功`,
            message: `恢复备份成功, 请重新启动Fishing Funds`,
          });
          app.quit();
        }
      } catch (error) {
        dialog.showMessageBox({
          type: 'info',
          title: `恢复失败`,
          message: `恢复备份文件失败`,
        });
        console.log('恢复备份文件失败', error);
      }
    });

    return () => {
      ipcRenderer.removeAllListeners('backup-all-config-export');
      ipcRenderer.removeAllListeners('backup-all-config-import');
      ipcRenderer.removeAllListeners('open-backup-file');
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
      await Adapters.ChokeAllAdapter(collectors, 100);
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

export function useBootStrap() {
  const { freshDelaySetting, autoFreshSetting } = useSelector((state: StoreState) => state.setting.systemSetting);
  const runLoadRemoteFunds = () => Helpers.Fund.LoadRemoteFunds();
  const runLoadRemoteCoins = () => Helpers.Coin.LoadRemoteCoins();
  const runLoadWalletsFunds = () => Helpers.Wallet.LoadWalletsFunds();
  const runLoadFixWalletsFunds = () => Helpers.Wallet.loadFixWalletsFunds();
  const runLoadZindexs = () => Helpers.Zindex.LoadZindexs(false);
  const runLoadQuotations = () => Helpers.Quotation.LoadQuotations(false);
  const runLoadStocks = () => Helpers.Stock.LoadStocks(false);
  const runLoadCoins = () => Helpers.Coin.LoadCoins(false);

  // 间隔时间刷新远程基金数据,远程货币数据
  useInterval(() => {
    runLoadRemoteFunds();
    runLoadRemoteCoins();
  }, 1000 * 60 * 60 * 24);

  // 间隔时间刷新基金,指数，板块，钱包
  useWorkDayTimeToDo(() => {
    if (autoFreshSetting) {
      Adapters.ConCurrencyAllAdapter([
        () => Adapters.ChokeAllAdapter([runLoadWalletsFunds]),
        () => Adapters.ChokeAllAdapter([runLoadZindexs, runLoadQuotations, runLoadStocks]),
      ]);
    }
  }, freshDelaySetting * 1000 * 60);

  // 间隔时间检查最新净值
  useFixTimeToDo(() => {
    if (autoFreshSetting) {
      Adapters.ChokeAllAdapter([runLoadFixWalletsFunds]);
    }
  }, freshDelaySetting * 1000 * 60);

  // 间隔时间刷新货币
  useInterval(() => {
    if (autoFreshSetting) {
      Adapters.ChokeAllAdapter([runLoadCoins]);
    }
  }, freshDelaySetting * 1000 * 60);

  // 第一次刷新所有数据
  useEffect(() => {
    Adapters.ConCurrencyAllAdapter([
      () => Adapters.ChokeAllAdapter([runLoadRemoteFunds, runLoadRemoteCoins, runLoadWalletsFunds, runLoadFixWalletsFunds]),
      () => Adapters.ChokeAllAdapter([runLoadZindexs, runLoadQuotations, runLoadStocks, runLoadCoins]),
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
    app.setLoginItemSettings({ openAtLogin: autoStartSetting });
  }, [autoStartSetting]);
  useLayoutEffect(() => {
    if (lowKeySetting) {
      document.body.classList.add('lowKey');
    } else {
      document.body.classList.remove('lowKey');
    }
  }, [lowKeySetting]);
  useAfterMounted(() => {
    Utils.ClearStorage(CONST.STORAGE.ADJUSTMENT_NOTIFICATION_DATE);
  }, [adjustmentNotificationTimeSetting]);
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

export function useUpdateContextMenuWalletsState() {
  const dispatch = useDispatch();
  const wallets = useSelector((state: StoreState) => state.wallet.wallets);
  const trayContentSetting = useSelector((state: StoreState) => state.setting.systemSetting.trayContentSetting);
  const currentWalletCode = useSelector((state: StoreState) => state.wallet.currentWalletCode);
  const freshFunds = useFreshFunds(0);

  useEffect(() => {
    ipcRenderer.invoke(
      'update-tray-context-menu-wallets',
      wallets.map((wallet) => {
        const walletConfig = Helpers.Wallet.GetCurrentWalletConfig(wallet.code);
        const calcResult = Helpers.Fund.CalcFunds(wallet.funds, wallet.code);
        let value = '';
        switch (trayContentSetting) {
          case Enums.TrayContent.Sy:
            value = ` ${Utils.Yang(calcResult.sygz.toFixed(2))} ¥`;
            break;
          case Enums.TrayContent.Syl:
            value = ` ${Utils.Yang(calcResult.gssyl.toFixed(2))} %`;
            break;
          case Enums.TrayContent.None:
          default:
            break;
        }
        return {
          label: `${walletConfig.name}  ${value}`,
          type: currentWalletCode === wallet.code ? 'radio' : 'normal',
          iconIndex: walletConfig.iconIndex,
          id: wallet.code,
        };
      })
    );
  }, [wallets, trayContentSetting, currentWalletCode]);
  useLayoutEffect(() => {
    ipcRenderer.on('change-current-wallet-code', (e, code) => {
      try {
        dispatch(selectWalletAction(code));
        freshFunds();
      } catch (error) {
        console.log(`切换钱包${code}失败`, error);
      }
    });
    return () => {
      ipcRenderer.removeAllListeners('change-current-wallet-code');
    };
  }, []);
}
