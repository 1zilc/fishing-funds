import { useLayoutEffect, useEffect, useMemo, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useInterval } from 'ahooks';
import { theme } from 'antd';
import { AnyAction } from 'redux';
import dayjs from 'dayjs';
import NP from 'number-precision';
import { startListening } from '@/store/listeners';
import { updateAvaliableAction } from '@/store/features/updater';
import { setFundConfigAction } from '@/store/features/fund';
import { syncTabsActiveKeyAction } from '@/store/features/tabs';
import { changeCurrentWalletCodeAction, toggleEyeStatusAction } from '@/store/features/wallet';
import {
  updateAdjustmentNotificationDateAction,
  syncDarkMode,
  saveSyncConfigAction,
  syncVaribleColors,
} from '@/store/features/setting';
import { syncTranslateShowAction } from '@/store/features/translate';
import { syncChatGPTShowAction } from '@/store/features/chatGPT';
import {
  useWorkDayTimeToDo,
  useFixTimeToDo,
  useAfterMountedEffect,
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
import { walletIcons } from '@/helpers/wallet';
import { encryptFF, decryptFF } from '@/utils/coding';
import * as Utils from '@/utils';
import * as Adapters from '@/utils/adpters';
import * as Helpers from '@/helpers';
import * as Enums from '@/utils/enums';
import * as Enhancement from '@/utils/enhancement';
import { useFreshFunds, useLoadFunds } from './utils';

const { dialog, ipcRenderer, clipboard, app } = window.contextModules.electron;
const { saveString, readFile } = window.contextModules.io;
const { useToken } = theme;

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
  const noticeMapRef = useRef<Record<string, boolean>>({});

  const riskNotificationSetting = useAppSelector((state) => state.setting.systemSetting.riskNotificationSetting);
  const wallets = useAppSelector((state) => state.wallet.wallets);
  const walletsConfig = useAppSelector((state) => state.wallet.config.walletConfig);
  const zindexs = useAppSelector((state) => state.zindex.zindexs);
  const zindexsCodeMap = useAppSelector((state) => state.zindex.config.codeMap);

  useInterval(
    () => {
      if (!riskNotificationSetting) {
        return;
      }
      try {
        // 基金提醒
        wallets.forEach((wallet) => {
          const { codeMap } = Helpers.Fund.GetFundConfig(wallet.code, walletsConfig);
          const walletConfig = Helpers.Wallet.GetCurrentWalletConfig(wallet.code, walletsConfig);

          wallet.funds?.forEach((fund) => {
            // 涨跌范围提醒
            checkZdfRange({
              zdf: fund.gszzl,
              preset: codeMap[fund.fundcode!]?.zdfRange,
              key: `${wallet.code}-${fund.fundcode}-zdfRange`,
              content: `${walletConfig.name} ${fund.name} ${Utils.Yang(fund.gszzl)}%`,
            });
            // 净值提醒
            checkJzNotice({
              dwjz: fund.dwjz,
              gsz: fund.gsz,
              preset: codeMap[fund.fundcode!]?.jzNotice,
              key: `${wallet.code}-${fund.fundcode}-jzNotice`,
              content: `${walletConfig.name} ${fund.name} ${fund.gsz}`,
            });
          });
        });
        // 股票提醒

        wallets.forEach((wallet) => {
          const { codeMap } = Helpers.Stock.GetStockConfig(wallet.code, walletsConfig);
          const walletConfig = Helpers.Wallet.GetCurrentWalletConfig(wallet.code, walletsConfig);

          wallet.stocks.forEach((stock) => {
            // 涨跌范围提醒
            checkZdfRange({
              zdf: stock.zdf,
              preset: codeMap[stock.secid!]?.zdfRange,
              key: `${stock.secid}-zdfRange`,
              content: `${walletConfig.name} ${stock.name} ${Utils.Yang(stock.zdf)}%`,
            });
            // 净值提醒
            checkJzNotice({
              dwjz: stock.zs,
              gsz: stock.zx,
              preset: codeMap[stock.secid!]?.jzNotice,
              key: `${stock.secid}-jzNotice`,
              content: `${walletConfig.name} ${stock.name} ${stock.zx}`,
            });
          });
        });

        // 指数提醒
        zindexs.forEach((zindex) => {
          // 涨跌范围提醒
          checkZdfRange({
            zdf: zindex.zdf,
            preset: zindexsCodeMap[zindex.code!]?.zdfRange,
            key: `${zindex.code}-zdfRange`,
            content: `${zindex.name} ${Utils.Yang(zindex.zdf)}%`,
          });
          // 净值提醒
          checkJzNotice({
            dwjz: zindex.zs,
            gsz: zindex.zsz,
            preset: zindexsCodeMap[zindex.code!]?.jzNotice,
            key: `${zindex.code}-jzNotice`,
            content: `${zindex.name} ${zindex.zsz}`,
          });
        });
      } catch (error) {}
    },
    1000 * 60,
    {
      immediate: true,
    }
  );

  // 24小时清除一次
  useInterval(() => {
    noticeMapRef.current = {};
  }, 1000 * 60 * 60 * 24);

  function checkZdfRange(data: { zdf: any; preset: any; key: string; content: string }) {
    const { zdf, preset, key, content } = data;
    const noticed = noticeMapRef.current[key];

    if (preset && Math.abs(preset) < Math.abs(Number(zdf)) && !noticed) {
      const notification = new Notification('涨跌提醒', {
        body: content,
      });
      notification.onclick = () => {
        ipcRenderer.invoke('show-current-window');
      };
      noticeMapRef.current[key] = true;
    }
  }

  function checkJzNotice(data: { dwjz: any; gsz: any; preset: any; key: string; content: string }) {
    const { dwjz, gsz, preset, key, content } = data;
    const noticed = noticeMapRef.current[key];
    if (
      preset &&
      ((Number(dwjz) <= preset && Number(gsz) >= preset) || (Number(dwjz) >= preset && Number(gsz) <= preset)) &&
      !noticed
    ) {
      const notification = new Notification('净值提醒', {
        body: content,
      });
      notification.onclick = () => {
        ipcRenderer.invoke('show-current-window');
      };
      noticeMapRef.current[key] = true;
    }
  }
}

export function useFundsClipboard() {
  const dispatch = useAppDispatch();
  const currentWalletCode = useAppSelector((state) => state.wallet.currentWalletCode);
  const walletsConfig = useAppSelector((state) => state.wallet.config.walletConfig);
  const fundConfig = useAppSelector((state) => state.wallet.fundConfig);
  const fundApiTypeSetting = useAppSelector((state) => state.setting.systemSetting.fundApiTypeSetting);
  const loadFunds = useLoadFunds({
    enableLoading: true,
    autoFix: true,
  });

  useIpcRendererListener('clipboard-funds-import', async (e: Electron.IpcRendererEvent, data) => {
    try {
      const limit = 99;
      const text = await clipboard.readText();
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
  const runLoadZindexs = useLoadZindexs({
    enableLoading: false,
    autoFilter: false,
  });
  const runLoadQuotations = useLoadQuotations({
    enableLoading: false,
    autoFilter: false,
  });
  const runLoadStocks = useLoadStocks({
    enableLoading: false,
    autoFilter: false,
  });
  const runLoadCoins = useLoadCoins({
    enableLoading: false,
    autoFilter: false,
  });

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
  }, 1000 * 60 * 5);

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
  const { hashId } = useToken();
  const {
    systemThemeSetting,
    autoStartSetting,
    lowKeySetting,
    adjustmentNotificationTimeSetting,
    proxyTypeSetting,
    proxyHostSetting,
    proxyPortSetting,
    hotkeySetting: visibleHotkey,
  } = useAppSelector((state) => state.setting.systemSetting);
  const { hotkeySetting: translateHotkey } = useAppSelector((state) => state.translate.translateSetting);
  const { hotkeySetting: chatGPTHotkey } = useAppSelector((state) => state.chatGPT.chatGPTSetting);

  useIpcRendererListener('nativeTheme-updated', (e, data) => {
    dispatch(syncDarkMode(!!data?.darkMode));
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
    ipcRenderer.invoke('set-visible-hotkey', visibleHotkey);
  }, [visibleHotkey]);
  useEffect(() => {
    dispatch(syncVaribleColors());
  }, [hashId]);
  useEffect(() => {
    ipcRenderer.invoke('set-translate-hotkey', translateHotkey);
  }, [translateHotkey]);
  useEffect(() => {
    ipcRenderer.invoke('set-chatGPT-hotkey', chatGPTHotkey);
  }, [chatGPTHotkey]);
}

export function useTrayContent() {
  const trayContentSetting = useAppSelector((state) => state.setting.systemSetting.trayContentSetting);
  const fundConfigCodeMap = useAppSelector((state) => state.wallet.fundConfigCodeMap);
  const stockConfigCodeMap = useAppSelector((state) => state.wallet.stockConfigCodeMap);
  const walletConfig = useAppSelector((state) => state.wallet.config.walletConfig);
  const wallets = useAppSelector((state) => state.wallet.wallets);
  const currentWalletCode = useAppSelector((state) => state.wallet.currentWalletCode);
  const eyeStatus = useAppSelector((state) => state.wallet.eyeStatus);
  const funds = useAppSelector((state) => state.wallet.currentWallet.funds);
  const stocks = useAppSelector((state) => state.wallet.currentWallet.stocks);

  // 当前选中钱包
  const { sygz, gssyl } = Helpers.Wallet.CalcWallet({ code: currentWalletCode, walletConfig, wallets });

  // 所有钱包
  const allCalcResult = (() => {
    const allResult = wallets.reduce(
      (r, { code }) => {
        const { zje, gszje } = Helpers.Wallet.CalcWallet({ code, walletConfig, wallets });

        return {
          zje: r.zje + zje,
          gszje: r.gszje + gszje,
        };
      },
      { zje: 0, gszje: 0 }
    );
    const sygz = NP.minus(allResult.gszje, allResult.zje);
    return { sygz, gssyl: allResult.zje ? NP.times(NP.divide(sygz, allResult.zje), 100) : 0 };
  })();

  const trayContent = (() => {
    const group = [trayContentSetting].flat();
    let content = group
      .map((trayContentType: Enums.TrayContent) => {
        switch (trayContentType) {
          case Enums.TrayContent.Sy:
            return `${Utils.Yang(sygz.toFixed(2))}`;
          case Enums.TrayContent.Syl:
            return `${Utils.Yang(gssyl.toFixed(2))}%`;
          case Enums.TrayContent.Zsy:
            return `${Utils.Yang(allCalcResult.sygz.toFixed(2))}`;
          case Enums.TrayContent.Zsyl:
            return `${Utils.Yang(allCalcResult.gssyl.toFixed(2))}%`;
          default:
            break;
        }
      })
      .join(' │ ');
    content = !!content ? ` ${content}` : content;
    return content;
  })();

  useEffect(() => {
    const content = eyeStatus ? trayContent : '';

    ipcRenderer.invoke('set-tray-content', content);
  }, [trayContent, eyeStatus]);
}

export function useUpdateContextMenuWalletsState() {
  const dispatch = useAppDispatch();
  const wallets = useAppSelector((state) => state.wallet.wallets);
  const currentWalletCode = useAppSelector((state) => state.wallet.currentWalletCode);
  const walletConfig = useAppSelector((state) => state.wallet.config.walletConfig);

  useEffect(() => {
    ipcRenderer.invoke(
      'update-tray-context-menu-wallets',
      walletConfig.map((config) => {
        const { sygz, gssyl } = Helpers.Wallet.CalcWallet({ code: config.code, walletConfig, wallets });
        const value = `  ${Utils.Yang(sygz.toFixed(2))}  ${Utils.Yang(gssyl.toFixed(2))}%`;

        return {
          label: `${config.name}  ${value}`,
          type: currentWalletCode === config.code ? 'radio' : 'normal',
          dataURL: walletIcons[config.iconIndex],
          id: config.code,
        };
      })
    );
  }, [wallets, currentWalletCode, walletConfig]);

  useIpcRendererListener('change-current-wallet-code', (e, code) => {
    try {
      dispatch(changeCurrentWalletCodeAction(code));
    } catch (error) {}
  });
}

export function useUpdateContextMenuStocksState() {
  // const stocks = useAppSelector((state) => state.stock.stocks);
  // const codeMap = useAppSelector((state) => state.stock.config.codeMap);
  // useEffect(() => {
  //   const calcResult = Helpers.Stock.CalcStocks(stocks, codeMap);
  //   const value = `  ${Utils.Yang(calcResult.sygz.toFixed(2))}  ${Utils.Yang(calcResult.gssyl.toFixed(2))}%`;
  //   ipcRenderer.invoke('update-tray-context-menu-stocks', [
  //     {
  //       label: `股票收益  ${value}`,
  //       id: 'stock-income',
  //     },
  //   ]);
  // }, [stocks, codeMap]);
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
      const { response } = await dialog.showMessageBox({
        type: 'info',
        title: `导入成功`,
        message: `请重新启动Fishing Funds`,
        buttons: ['重启', '关闭'],
      });
      if (response === 0) {
        app.relaunch();
      } else {
        app.quit();
      }
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
        message: `备份时间：${dayjs(backupConfig.timestamp).format(
          'YYYY-MM-DD HH:mm:ss'
        )} ，当前数据将被覆盖，请谨慎操作`,
        buttons: ['确定', '取消'],
      });
      if (response === 0) {
        Enhancement.CoverBackupConfig(backupConfig);
        const { response } = await dialog.showMessageBox({
          type: 'info',
          title: `恢复成功`,
          message: `请重新启动Fishing Funds`,
          buttons: ['重启', '关闭'],
        });
        if (response === 0) {
          app.relaunch();
        } else {
          app.quit();
        }
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
  const bottomTabsSetting = useAppSelector((state) => state.setting.systemSetting.bottomTabsSetting);

  useEffect(() => {
    ipcRenderer.invoke(
      'update-touchbar-zindex',
      zindexs.slice(0, 1).map((zindex) => ({
        label: `${zindex.name} ${zindex.zsz}`,
        backgroundColor: Utils.GetValueColor(zindex.zdf).color,
      }))
    );
  }, [zindexs]);

  useEffect(() => {
    const walletConfig = Helpers.Wallet.GetCurrentWalletConfig(currentWalletCode, walletsConfig);
    const calcResult = Helpers.Fund.CalcFunds(currentWallet.funds, fundConfigCodeMap);
    const value = Utils.Yang(calcResult.gssyl.toFixed(2));

    ipcRenderer.invoke('update-touchbar-wallet', [
      {
        id: currentWalletCode,
        label: `${value}%`, // 只显示当前钱包
        dataURL: walletIcons[walletConfig.iconIndex],
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

  useEffect(() => {
    startListening();
  }, []);

  useIpcRendererListener('sync-store-data', (event, action: AnyAction) => {
    dispatch(action);
  });
}

export function useSyncConfig() {
  const dispatch = useAppDispatch();
  const syncConfigSetting = useAppSelector((state) => state.setting.systemSetting.syncConfigSetting);
  const syncConfigPathSetting = useAppSelector((state) => state.setting.systemSetting.syncConfigPathSetting);

  useEffect(() => {
    if (syncConfigSetting && syncConfigPathSetting) {
      dispatch(saveSyncConfigAction());
    }
  }, [syncConfigSetting, syncConfigPathSetting]);
}

export function useTranslate() {
  const dispatch = useAppDispatch();
  const show = useAppSelector((state) => state.translate.show); // translate当前显示状态

  useIpcRendererListener('trigger-translate', (event, visible: boolean) => {
    // menubar 当前显示状态
    if (visible) {
      if (show) {
        ipcRenderer.invoke('set-menubar-visible', false);
        dispatch(syncTranslateShowAction(false));
      } else {
        dispatch(syncTranslateShowAction(true));
      }
    } else {
      if (show) {
        flushSync(() => {
          dispatch(syncTranslateShowAction(false));
        });
      }
      dispatch(syncTranslateShowAction(true));
      ipcRenderer.invoke('set-menubar-visible', true);
    }
  });
}

export function useChatGPT() {
  const dispatch = useAppDispatch();
  const show = useAppSelector((state) => state.chatGPT.show); // chatgpt当前显示状态

  useIpcRendererListener('trigger-chatGPT', (event, visible: boolean) => {
    // menubar 当前显示状态
    if (visible) {
      if (show) {
        ipcRenderer.invoke('set-menubar-visible', false);
        dispatch(syncChatGPTShowAction(false));
      } else {
        dispatch(syncChatGPTShowAction(true));
      }
    } else {
      if (show) {
        flushSync(() => {
          dispatch(syncChatGPTShowAction(false));
        });
      }
      dispatch(syncChatGPTShowAction(true));
      ipcRenderer.invoke('set-menubar-visible', true);
    }
  });
}
