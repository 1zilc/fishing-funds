import { useCallback, useLayoutEffect, useState, useEffect, useMemo, useRef } from 'react';
import { useInterval, useBoolean, useThrottleFn, useSize } from 'ahooks';
import { useDispatch, useSelector } from 'react-redux';
import { compose } from 'redux';
import { Base64 } from 'js-base64';
import dayjs from 'dayjs';
import NP from 'number-precision';

import { updateAvaliableAction } from '@/actions/updater';
import { setFundConfigAction } from '@/actions/fund';
import { selectWalletAction } from '@/actions/wallet';
import { setAdjustmentNotificationDateAction, clearAdjustmentNotificationDateAction } from '@/actions/setting';
import { StoreState } from '@/reducers/types';
import { useWorkDayTimeToDo, useFixTimeToDo, useAfterMounted, useCurrentWallet, useFreshFunds, useAllCyFunds } from '@/utils/hooks';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Adapters from '@/utils/adpters';
import * as Helpers from '@/helpers';
import * as Enums from '@/utils/enums';
import { NOTIMP } from 'dns';

const { invoke, dialog, ipcRenderer, clipboard, app } = window.contextModules.electron;
const { saveString, encodeFF, decodeFF, readFile } = window.contextModules.io;

export function useUpdater() {
  const dispatch = useDispatch();
  const { autoCheckUpdateSetting } = useSelector((state: StoreState) => state.setting.systemSetting);
  // 6小时检查一次版本
  useInterval(() => autoCheckUpdateSetting && ipcRenderer.invoke('check-update'), 1000 * 60 * 60 * 6);

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

export function useAdjustmentNotification() {
  const dispatch = useDispatch();
  const systemSetting = useSelector((state: StoreState) => state.setting.systemSetting);
  const lastNotificationDate = useSelector((state: StoreState) => state.setting.adjustmentNotificationDate);
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
      if (isAdjustmentNotificationTime && currentDate !== lastNotificationDate) {
        const notification = new Notification('调仓提醒', {
          body: `当前时间${hour}:${minute} 注意行情走势`,
        });
        notification.onclick = () => {
          invoke.showCurrentWindow();
        };
        dispatch(setAdjustmentNotificationDateAction(currentDate));
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
  const systemSetting = useSelector((state: StoreState) => state.setting.systemSetting);
  const wallets = useSelector((state: StoreState) => state.wallet.wallets);
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
          const { codeMap } = Helpers.Fund.GetFundConfig(wallet.code);
          const walletConfig = Helpers.Wallet.GetCurrentWalletConfig(wallet.code);
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
                invoke.showCurrentWindow();
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
                invoke.showCurrentWindow();
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
      }
    });
    return () => {
      ipcRenderer.removeAllListeners('clipboard-funds-import');
      ipcRenderer.removeAllListeners('clipboard-funds-copy');
    };
  }, []);
}

export function useBootStrap() {
  const { freshDelaySetting, autoFreshSetting } = useSelector((state: StoreState) => state.setting.systemSetting);
  const runLoadRemoteFunds = () => Helpers.Fund.LoadRemoteFunds();
  const runLoadFundRatingMap = () => Helpers.Fund.LoadFundRatingMap();
  const runLoadRemoteCoins = () => Helpers.Coin.LoadRemoteCoins();
  const runLoadWalletsFunds = () => Helpers.Wallet.LoadWalletsFunds();
  const runLoadFixWalletsFunds = () => Helpers.Wallet.loadFixWalletsFunds();
  const runLoadZindexs = () => Helpers.Zindex.LoadZindexs(false);
  const runLoadQuotations = () => Helpers.Quotation.LoadQuotations(false);
  const runLoadStocks = () => Helpers.Stock.LoadStocks(false);
  const runLoadCoins = () => Helpers.Coin.LoadCoins(false);

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
  const dispatch = useDispatch();
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
    dispatch(clearAdjustmentNotificationDateAction());
  }, [adjustmentNotificationTimeSetting]);
}

export function useTrayContent() {
  const { trayContentSetting } = useSelector((state: StoreState) => state.setting.systemSetting);
  const currentWalletCode = useSelector((state: StoreState) => state.wallet.currentWalletCode);
  const wallets = useSelector((state: StoreState) => state.wallet.wallets);
  const {
    currentWalletState: { funds },
  } = useCurrentWallet();
  const calcResult = Helpers.Fund.CalcFunds(funds, currentWalletCode);

  const allCalcResult = useMemo(() => {
    const allResult = wallets.reduce(
      (r, { code, funds }) => {
        const result = Helpers.Fund.CalcFunds(funds, code);
        return { zje: r.zje + result.zje, gszje: r.gszje + result.gszje };
      },
      { zje: 0, gszje: 0 }
    );
    const sygz = NP.minus(allResult.gszje, allResult.zje);
    return { sygz, gssyl: allResult.zje ? NP.times(NP.divide(sygz, allResult.zje), 100) : 0 };
  }, [wallets]);

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
  const dispatch = useDispatch();
  const wallets = useSelector((state: StoreState) => state.wallet.wallets);
  const currentWalletCode = useSelector((state: StoreState) => state.wallet.currentWalletCode);
  const freshFunds = useFreshFunds(0);

  useEffect(() => {
    ipcRenderer.invoke(
      'update-tray-context-menu-wallets',
      wallets.map((wallet) => {
        const walletConfig = Helpers.Wallet.GetCurrentWalletConfig(wallet.code);
        const calcResult = Helpers.Fund.CalcFunds(wallet.funds, wallet.code);
        const value = `  ${Utils.Yang(calcResult.sygz.toFixed(2))}  ${Utils.Yang(calcResult.gssyl.toFixed(2))}%`;
        return {
          label: `${walletConfig.name}  ${value}`,
          type: currentWalletCode === wallet.code ? 'radio' : 'normal',
          iconIndex: walletConfig.iconIndex,
          id: wallet.code,
        };
      })
    );
  }, [wallets, currentWalletCode]);
  useLayoutEffect(() => {
    ipcRenderer.on('change-current-wallet-code', (e, code) => {
      try {
        dispatch(selectWalletAction(code));
        freshFunds();
      } catch (error) {}
    });
    return () => {
      ipcRenderer.removeAllListeners('change-current-wallet-code');
    };
  }, []);
}

export function useAllConfigBackup() {
  useLayoutEffect(() => {
    ipcRenderer.on('backup-all-config-export', async (e, data) => {
      try {
        const backupConfig = await Utils.GenerateBackupConfig();
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
        Utils.CoverBackupConfig(backupConfig);
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
          Utils.CoverBackupConfig(backupConfig);
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

    return () => {
      ipcRenderer.removeAllListeners('backup-all-config-export');
      ipcRenderer.removeAllListeners('backup-all-config-import');
      ipcRenderer.removeAllListeners('open-backup-file');
    };
  }, []);
}
