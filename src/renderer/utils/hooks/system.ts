import { useLayoutEffect, useState, useEffect, useMemo } from 'react';
import { useDebounceFn, useInterval } from 'ahooks';
import { AnyAction } from 'redux';
import dayjs from 'dayjs';
import NP from 'number-precision';

import { updateAvaliableAction } from '@/store/features/updater';
import { setFundConfigAction } from '@/store/features/fund';
import { syncTabsActiveKeyAction } from '@/store/features/tabs';
import { changeCurrentWalletCodeAction, toggleEyeStatusAction } from '@/store/features/wallet';
import { updateAdjustmentNotificationDateAction, syncDarkMode } from '@/store/features/setting';

import {
  useWorkDayTimeToDo,
  useFixTimeToDo,
  useAfterMountedEffect,
  useFreshFunds,
  useAppDispatch,
  useAppSelector,
  useLoadCoins,
  useLoadRemoteCoins,
  useLoadRemoteFunds,
  useLoadFundRatingMap,
  useLoadWalletsFunds,
  useLoadFixWalletsFunds,
  useLoadQuotations,
  useLoadZindexs,
  useLoadStocks,
  useIpcRendererListener,
} from '@/utils/hooks';
import * as Utils from '@/utils';
import * as Adapters from '@/utils/adpters';
import * as Helpers from '@/helpers';
import * as Enums from '@/utils/enums';
import * as Enhancement from '@/utils/enhancement';
import { useLoadFunds } from './utils';

const { dialog, ipcRenderer, clipboard, app } = window.contextModules.electron;
const { saveString, readFile, encryptFF, decryptFF } = window.contextModules.io;

export function useUpdater() {
  const dispatch = useAppDispatch();
  const { autoCheckUpdateSetting } = useAppSelector((state) => state.setting.systemSetting);
  // 2小时检查一次版本
  useInterval(() => autoCheckUpdateSetting && ipcRenderer.invoke('check-update'), 1000 * 60 * 60 * 2, {
    immediate: true,
  });

  useIpcRendererListener('update-available', (e, data) => {
    if (autoCheckUpdateSetting) {
      dispatch(updateAvaliableAction(data));
    }
  });
}

export function useAdjustmentNotification() {
  const dispatch = useAppDispatch();
  const { adjustmentNotificationSetting, adjustmentNotificationTimeSetting, timestampSetting } = useAppSelector(
    (state) => state.setting.systemSetting
  );
  const lastNotificationDate = useAppSelector((state) => state.setting.adjustmentNotificationDate);

  useInterval(
    async () => {
      if (!adjustmentNotificationSetting) {
        return;
      }
      const timestamp = await Helpers.Time.GetCurrentHours(timestampSetting);
      const { isAdjustmentNotificationTime, now } = Utils.JudgeAdjustmentNotificationTime(
        Number(timestamp),
        adjustmentNotificationTimeSetting
      );
      const month = now.get('month');
      const date = now.get('date');
      const hour = now.get('hour');
      const minute = now.get('minute');
      const currentDate = `${month}-${date}`;
      if (isAdjustmentNotificationTime && currentDate !== lastNotificationDate) {
        const notification = new Notification('调仓提醒', {
          body: `当前时间${hour}:${minute} 注意行情走势`,
        });
        notification.onclick = () => {
          ipcRenderer.invoke('show-current-window');
        };
        dispatch(updateAdjustmentNotificationDateAction(currentDate));
      }
    },
    1000 * 50,
    {
      immediate: true,
    }
  );
}

export function useRiskNotification() {
  const [zdfRangeMap, setZdfRangeMap] = useState<Record<string, boolean>>({});
  const [jzNoticeMap, setJzNoticeMap] = useState<Record<string, boolean>>({});
  const systemSetting = useAppSelector((state) => state.setting.systemSetting);
  const wallets = useAppSelector((state) => state.wallet.wallets);
  const walletsConfig = useAppSelector((state) => state.wallet.config.walletConfig);
  const { riskNotificationSetting } = systemSetting;

  useInterval(
    () => {
      const cloneZdfRangeMap = Utils.DeepCopy(zdfRangeMap);
      const cloneJzNoticeMap = Utils.DeepCopy(jzNoticeMap);
      if (!riskNotificationSetting) {
        return;
      }
      try {
        wallets.forEach((wallet) => {
          const { codeMap } = Helpers.Fund.GetFundConfig(wallet.code, walletsConfig);
          const walletConfig = Helpers.Wallet.GetCurrentWalletConfig(wallet.code, walletsConfig);
          wallet.funds?.forEach((fund) => {
            const zdfRange = codeMap[fund.fundcode!]?.zdfRange;
            const jzNotice = codeMap[fund.fundcode!]?.jzNotice;
            const riskKey = `${wallet.code}-${fund.fundcode}`;
            const zdfRangeNoticed = cloneZdfRangeMap[riskKey];
            const jzNoticeNoticed = cloneJzNoticeMap[riskKey];

            if (zdfRange && Math.abs(zdfRange) < Math.abs(Number(fund.gszzl)) && !zdfRangeNoticed) {
              const notification = new Notification('涨跌提醒', {
                body: `${walletConfig.name} ${fund.name} ${Utils.Yang(fund.gszzl)}%`,
              });
              notification.onclick = () => {
                ipcRenderer.invoke('show-current-window');
              };
              cloneZdfRangeMap[riskKey] = true;
            }

            if (
              jzNotice &&
              ((Number(fund.dwjz) <= jzNotice && Number(fund.gsz) >= jzNotice) ||
                (Number(fund.dwjz) >= jzNotice && Number(fund.gsz) <= jzNotice)) &&
              !jzNoticeNoticed
            ) {
              const notification = new Notification('净值提醒', {
                body: `${walletConfig.name} ${fund.name} ${fund.gsz}`,
              });
              notification.onclick = () => {
                ipcRenderer.invoke('show-current-window');
              };
              cloneJzNoticeMap[riskKey] = true;
            }
          });
        });
        setZdfRangeMap(cloneZdfRangeMap);
        setJzNoticeMap(cloneJzNoticeMap);
      } catch (error) {}
    },
    1000 * 60,
    {
      immediate: true,
    }
  );
}

export function useFundsClipboard() {
  const dispatch = useAppDispatch();
  const currentWalletCode = useAppSelector((state) => state.wallet.currentWalletCode);
  const walletsConfig = useAppSelector((state) => state.wallet.config.walletConfig);
  const fundConfig = useAppSelector((state) => state.wallet.fundConfig);
  const fundApiTypeSetting = useAppSelector((state) => state.setting.systemSetting.fundApiTypeSetting);
  const loadFunds = useLoadFunds(true);

  useIpcRendererListener('clipboard-funds-import', async (e: Electron.IpcRendererEvent, data) => {
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
      const { codeMap: oldCodeMap } = Helpers.Fund.GetFundConfig(currentWalletCode, walletsConfig);
      const jsonFundConfig = json
        .map((fund) => ({
          name: '',
          cyfe: Number(fund.cyfe) < 0 ? 0 : Number(fund.cyfe) || 0,
          code: fund.code && String(fund.code),
          cbj: Utils.NotEmpty(fund.cbj) ? (Number(fund.cbj) < 0 ? undefined : Number(fund.cbj)) : undefined,
        }))
        .filter(({ code }) => code);
      const jsonCodeMap = Utils.GetCodeMap(jsonFundConfig, 'code');
      // 去重复
      const fundConfigSet = Object.entries(jsonCodeMap).map(([code, fund]) => fund);
      const responseFunds = await Helpers.Fund.GetFunds(fundConfigSet, fundApiTypeSetting);
      const newFundConfig = responseFunds.map((fund) => ({
        name: fund!.name!,
        code: fund!.fundcode!,
        cyfe: jsonCodeMap[fund!.fundcode!].cyfe,
        cbj: jsonCodeMap[fund!.fundcode!].cbj,
      }));
      const newCodeMap = Utils.GetCodeMap(newFundConfig, 'code');
      const allCodeMap = {
        ...oldCodeMap,
        ...newCodeMap,
      };
      const allFundConfig = Object.entries(allCodeMap).map(([code, fund]) => fund);
      await dispatch(setFundConfigAction({ config: allFundConfig, walletCode: currentWalletCode }));
      dialog.showMessageBox({
        type: 'info',
        title: `导入完成`,
        message: `更新：${newFundConfig.length}个，总共：${json.length}个`,
      });
      loadFunds();
    } catch (error) {
      dialog.showMessageBox({
        type: 'info',
        title: `解析失败`,
        message: `请检查JSON格式`,
      });
    }
  });

  useIpcRendererListener('clipboard-funds-copy', async (e: Electron.IpcRendererEvent, data) => {
    try {
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
    }
  });
}

export function useBootStrap() {
  const { freshDelaySetting, autoFreshSetting } = useAppSelector((state) => state.setting.systemSetting);
  const runLoadRemoteFunds = useLoadRemoteFunds();
  const runLoadFundRatingMap = useLoadFundRatingMap();
  const runLoadRemoteCoins = useLoadRemoteCoins();
  const runLoadWalletsFunds = useLoadWalletsFunds();
  const runLoadFixWalletsFunds = useLoadFixWalletsFunds();
  const runLoadZindexs = useLoadZindexs(false);
  const runLoadQuotations = useLoadQuotations(false);
  const runLoadStocks = useLoadStocks(false);
  const runLoadCoins = useLoadCoins(false);

  // 间隔时间刷新远程基金数据,远程货币数据,基金评级
  useInterval(() => {
    runLoadRemoteFunds();
    runLoadRemoteCoins();
    runLoadFundRatingMap();
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
      () => Adapters.ChokeAllAdapter([runLoadRemoteFunds, runLoadRemoteCoins, runLoadFundRatingMap]),
      () => Adapters.ChokeAllAdapter([runLoadWalletsFunds, runLoadFixWalletsFunds]),
      () => Adapters.ChokeAllAdapter([runLoadZindexs, runLoadQuotations, runLoadStocks, runLoadCoins]),
    ]);
  }, []);
}

export function useMappingLocalToSystemSetting() {
  const dispatch = useAppDispatch();
  const {
    systemThemeSetting,
    autoStartSetting,
    lowKeySetting,
    adjustmentNotificationTimeSetting,
    proxyTypeSetting,
    proxyHostSetting,
    proxyPortSetting,
    hotkeySetting,
  } = useAppSelector((state) => state.setting.systemSetting);

  useIpcRendererListener('nativeTheme-updated', (e, data) => {
    requestIdleCallback(() => {
      // TODO: 暂时不清楚，为什么第一时间无法取最新的 property color
      dispatch(syncDarkMode(!!data?.darkMode));
    });
  });

  useEffect(() => {
    Enhancement.UpdateSystemTheme(systemThemeSetting);
  }, [systemThemeSetting]);
  useEffect(() => {
    app.setLoginItemSettings({ openAtLogin: autoStartSetting });
  }, [autoStartSetting]);
  useLayoutEffect(() => {
    if (lowKeySetting) {
      document.body.classList.add('lowKey');
    } else {
      document.body.classList.remove('lowKey');
    }
  }, [lowKeySetting]);
  useAfterMountedEffect(() => {
    dispatch(updateAdjustmentNotificationDateAction(''));
  }, [adjustmentNotificationTimeSetting]);
  useEffect(() => {
    switch (proxyTypeSetting) {
      case Enums.ProxyType.System:
        ipcRenderer.invoke('set-proxy', { mode: 'system' });
        break;
      case Enums.ProxyType.Http:
        ipcRenderer.invoke('set-proxy', { proxyRules: `http=${proxyHostSetting}:${proxyPortSetting}` });
        break;
      case Enums.ProxyType.Socks:
        ipcRenderer.invoke('set-proxy', { proxyRules: `socks=${proxyHostSetting}:${proxyPortSetting}` });
        break;
      case Enums.ProxyType.None:
      default:
        ipcRenderer.invoke('set-proxy', { mode: 'direct' });
    }
  }, [proxyTypeSetting, proxyHostSetting, proxyPortSetting]);
  useEffect(() => {
    ipcRenderer.invoke('set-hotkey', hotkeySetting);
  }, [hotkeySetting]);
}

export function useTrayContent() {
  const { trayContentSetting } = useAppSelector((state) => state.setting.systemSetting);
  const fundConfigCodeMap = useAppSelector((state) => state.wallet.fundConfigCodeMap);
  const walletsConfig = useAppSelector((state) => state.wallet.config.walletConfig);
  const wallets = useAppSelector((state) => state.wallet.wallets);
  const { funds } = useAppSelector((state) => state.wallet.currentWallet);
  const calcResult = Helpers.Fund.CalcFunds(funds, fundConfigCodeMap);

  const allCalcResult = useMemo(() => {
    const allResult = wallets.reduce(
      (r, { code, funds }) => {
        const { codeMap } = Helpers.Fund.GetFundConfig(code, walletsConfig);
        const result = Helpers.Fund.CalcFunds(funds, codeMap);
        return { zje: r.zje + result.zje, gszje: r.gszje + result.gszje };
      },
      { zje: 0, gszje: 0 }
    );
    const sygz = NP.minus(allResult.gszje, allResult.zje);
    return { sygz, gssyl: allResult.zje ? NP.times(NP.divide(sygz, allResult.zje), 100) : 0 };
  }, [wallets, walletsConfig]);

  useEffect(() => {
    const group = [trayContentSetting].flat();
    const content = group
      .map((trayContent: Enums.TrayContent) => {
        switch (trayContent) {
          case Enums.TrayContent.Sy:
            return `${Utils.Yang(calcResult.sygz.toFixed(2))}`;
          case Enums.TrayContent.Syl:
            return `${Utils.Yang(calcResult.gssyl.toFixed(2))}%`;
          case Enums.TrayContent.Zsy:
            return `${Utils.Yang(allCalcResult.sygz.toFixed(2))}`;
          case Enums.TrayContent.Zsyl:
            return `${Utils.Yang(allCalcResult.gssyl.toFixed(2))}%`;
          default:
            break;
        }
      })
      .join(' │ ');

    ipcRenderer.invoke('set-tray-content', content ? ` ${content}` : content);
  }, [trayContentSetting, calcResult, allCalcResult]);
}

export function useUpdateContextMenuWalletsState() {
  const dispatch = useAppDispatch();
  const wallets = useAppSelector((state) => state.wallet.wallets);
  const currentWalletCode = useAppSelector((state) => state.wallet.currentWalletCode);
  const walletsConfig = useAppSelector((state) => state.wallet.config.walletConfig);
  const freshFunds = useFreshFunds(0);

  useEffect(() => {
    ipcRenderer.invoke(
      'update-tray-context-menu-wallets',
      walletsConfig.map((walletConfig) => {
        const { codeMap } = Helpers.Fund.GetFundConfig(walletConfig.code, walletsConfig);
        const { funds } = Helpers.Wallet.GetCurrentWalletState(walletConfig.code, wallets);
        const calcResult = Helpers.Fund.CalcFunds(funds, codeMap);
        const value = `  ${Utils.Yang(calcResult.sygz.toFixed(2))}  ${Utils.Yang(calcResult.gssyl.toFixed(2))}%`;
        return {
          label: `${walletConfig.name}  ${value}`,
          type: currentWalletCode === walletConfig.code ? 'radio' : 'normal',
          iconIndex: walletConfig.iconIndex,
          id: walletConfig.code,
        };
      })
    );
  }, [wallets, currentWalletCode, walletsConfig]);

  useIpcRendererListener('change-current-wallet-code', async (e, code) => {
    try {
      await dispatch(changeCurrentWalletCodeAction(code));
      freshFunds();
    } catch (error) {}
  });
}

export function useAllConfigBackup() {
  useIpcRendererListener('backup-all-config-export', async (e, code) => {
    try {
      const backupConfig = await Enhancement.GenerateBackupConfig();
      const { filePath, canceled } = await dialog.showSaveDialog({
        title: '保存',
        defaultPath: `${backupConfig.name}-${backupConfig.timestamp}.${backupConfig.suffix}`,
      });
      if (canceled) {
        return;
      }
      const encodeBackupConfig = await encryptFF(backupConfig);
      await saveString(filePath!, encodeBackupConfig);
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
    }
  });
  useIpcRendererListener('backup-all-config-import', async (e, code) => {
    try {
      const { filePaths, canceled } = await dialog.showOpenDialog({
        title: '选择备份文件',
        filters: [{ name: 'Fishing Funds', extensions: ['ff'] }],
      });
      const filePath = filePaths[0];
      if (canceled || !filePath) {
        return;
      }
      const encodeBackupConfig = await readFile(filePath);
      const backupConfig: Backup.Config = await decryptFF(encodeBackupConfig);
      Enhancement.CoverBackupConfig(backupConfig);
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
    }
  });
  useIpcRendererListener('open-backup-file', async (e, filePath) => {
    try {
      const encodeBackupConfig = await readFile(filePath);
      const backupConfig: Backup.Config = await decryptFF(encodeBackupConfig);
      const { response } = await dialog.showMessageBox({
        title: `确认从备份文件恢复`,
        message: `备份时间：${dayjs(backupConfig.timestamp).format('YYYY-MM-DD HH:mm:ss')} ，当前数据将被覆盖，请谨慎操作`,
        buttons: ['确定', '取消'],
      });
      if (response === 0) {
        Enhancement.CoverBackupConfig(backupConfig);
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
    }
  });
}

export function useTouchBar() {
  const dispatch = useAppDispatch();
  const zindexs = useAppSelector((state) => state.zindex.zindexs);
  const activeKey = useAppSelector((state) => state.tabs.activeKey);
  const eyeStatus = useAppSelector((state) => state.wallet.eyeStatus);
  const currentWallet = useAppSelector((state) => state.wallet.currentWallet);
  const currentWalletCode = useAppSelector((state) => state.wallet.currentWalletCode);
  const walletsConfig = useAppSelector((state) => state.wallet.config.walletConfig);
  const fundConfigCodeMap = useAppSelector((state) => state.wallet.fundConfigCodeMap);
  const varibleColors = useAppSelector((state) => state.setting.varibleColors);
  const bottomTabsSetting = useAppSelector((state) => state.setting.systemSetting.bottomTabsSetting);

  useEffect(() => {
    ipcRenderer.invoke(
      'update-touchbar-zindex',
      zindexs.slice(0, 1).map((zindex) => ({
        label: `${zindex.name} ${zindex.zsz}`,
        backgroundColor: Utils.GetValueColor(zindex.zdf).color,
      }))
    );
  }, [varibleColors, zindexs]);

  useEffect(() => {
    const walletConfig = Helpers.Wallet.GetCurrentWalletConfig(currentWalletCode, walletsConfig);
    const calcResult = Helpers.Fund.CalcFunds(currentWallet.funds, fundConfigCodeMap);
    const value = Utils.Yang(calcResult.gssyl.toFixed(2));

    ipcRenderer.invoke('update-touchbar-wallet', [
      {
        id: currentWalletCode,
        label: `${value}%`, // 只显示当前钱包
        iconIndex: walletConfig.iconIndex,
      },
    ]);
  }, [currentWallet, currentWalletCode, walletsConfig, fundConfigCodeMap]);

  useEffect(() => {
    ipcRenderer.invoke(
      'update-touchbar-tab',
      bottomTabsSetting
        .filter(({ show }) => show)
        .map((tab) => ({
          label: tab.name,
          selected: tab.key === activeKey,
        }))
    );
  }, [activeKey]);

  useEffect(() => {
    ipcRenderer.invoke('update-touchbar-eye-status', eyeStatus);
  }, [eyeStatus]);

  useIpcRendererListener('change-tab-active-key', (e, key) => {
    dispatch(syncTabsActiveKeyAction(key));
  });
  useIpcRendererListener('change-eye-status', (e, key) => {
    dispatch(toggleEyeStatusAction());
  });
}

export function useShareStoreState() {
  const dispatch = useAppDispatch();
  const { run } = useDebounceFn(
    (event, action: AnyAction) => {
      Utils.SetUpdatingStoreStateStatus(true);
      dispatch(action);
    },
    {
      leading: true,
      wait: 1000,
    }
  );
  useIpcRendererListener('sync-store-data', run);
}

export function useSyncConfig() {
  const syncConfigSetting = useAppSelector((state) => state.setting.systemSetting.syncConfigSetting);
  const syncConfigPathSetting = useAppSelector((state) => state.setting.systemSetting.syncConfigPathSetting);

  useEffect(() => {
    if (syncConfigSetting && syncConfigPathSetting) {
      Enhancement.DoSyncConfig(syncConfigPathSetting);
    }
  }, [syncConfigSetting, syncConfigPathSetting]);
}
