import { useEffect, startTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '@/components/LoadingScreen';
import { setRemoteFundsAction, setFundRatingAction } from '@/store/features/fund';
import { setZindexConfigAction, defaultZindexConfig } from '@/store/features/zindex';
import {
  setSystemSettingAction,
  updateAdjustmentNotificationDateAction,
  defaultSystemSetting,
  syncDarkMode,
  loadSyncConfigAction,
} from '@/store/features/setting';
import {
  setWalletConfigAction,
  syncEyeStatusAction,
  changeCurrentWalletCodeAction,
  defaultWallet,
} from '@/store/features/wallet';
import { setCoinConfigAction, setRemoteCoinsAction } from '@/store/features/coin';
import { syncSortModeAction, setViewModeAction, initialState as sortInitialState } from '@/store/features/sort';
import { syncTabsActiveKeyAction } from '@/store/features/tabs';
import { setWebConfigAction, defaultWebConfig } from '@/store/features/web';
import { syncVersion } from '@/store/features/updater';
import { syncTranslateSettingAction, defaultTranslateSetting } from '@/store/features/translate';
import { useDrawer, useAppDispatch } from '@/utils/hooks';
import { syncFavoriteQuotationMapAction } from '@/store/features/quotation';
import * as CONST from '@/constants';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';

const { ipcRenderer, app } = window.contextModules.electron;
const electronStore = window.contextModules.electronStore;

export type RedirectSearchParams = {
  _redirect: string;
};

async function checkRedundanceStorage() {
  const allConfigStorage = await electronStore.all('config');
  [
    CONST.STORAGE.EYE_STATUS,
    CONST.STORAGE.SORT_MODE,
    CONST.STORAGE.VIEW_MODE,
    CONST.STORAGE.TABS_ACTIVE_KEY,
    CONST.STORAGE.ADJUSTMENT_NOTIFICATION_DATE,
  ].forEach((key) => {
    const content = allConfigStorage[key];
    if (content !== undefined && content !== null) {
      electronStore.set('state', key, content);
      electronStore.delete('config', key);
    }
  });
  [CONST.STORAGE.REMOTE_FUND_MAP, CONST.STORAGE.FUND_RATING_MAP, CONST.STORAGE.REMOTE_COIN_MAP].forEach((key) => {
    const content = allConfigStorage[key];
    if (content !== undefined && content !== null) {
      electronStore.set('cache', key, content);
      electronStore.delete('config', key);
    }
  });
}

async function migrateStock(data: Wallet.SettingItem[]) {
  // 8.0.0 将股票配置迁移到钱包
  const allConfigStorage = await electronStore.all('config');
  const stockConfig = allConfigStorage[CONST.STORAGE.STOCK_SETTING];
  if (stockConfig) {
    data[0]!.stocks = stockConfig;
    await electronStore.set('config', CONST.STORAGE.WALLET_SETTING, data);
    await electronStore.delete('config', CONST.STORAGE.STOCK_SETTING);
  }
  return data;
}

const InitPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: loadingText, show: showLoading, set: setLoading } = useDrawer('加载本地配置中...');

  async function init() {
    setLoading('加载中...');
    /**
     * config部分
     */
    const allConfigStorage = await electronStore.all('config');
    // 系统设置加载完成
    dispatch(setSystemSettingAction(allConfigStorage[CONST.STORAGE.SYSTEM_SETTING] || defaultSystemSetting));
    dispatch(updateAdjustmentNotificationDateAction(allConfigStorage[CONST.STORAGE.ADJUSTMENT_NOTIFICATION_DATE] || ''));
    //web配置加载完成
    dispatch(setZindexConfigAction(allConfigStorage[CONST.STORAGE.ZINDEX_SETTING] || defaultZindexConfig));
    // 关注板块配置加载完成
    dispatch(syncFavoriteQuotationMapAction(allConfigStorage[CONST.STORAGE.FAVORITE_QUOTATION_MAP] || {}));
    // 货币配置加载完成
    dispatch(setCoinConfigAction(allConfigStorage[CONST.STORAGE.COIN_SETTING] || []));
    // web配置加载完成
    dispatch(setWebConfigAction(allConfigStorage[CONST.STORAGE.WEB_SETTING] || defaultWebConfig));
    // 钱包配置加载完成
    dispatch(setWalletConfigAction(await migrateStock(allConfigStorage[CONST.STORAGE.WALLET_SETTING] || [defaultWallet])));
    dispatch(changeCurrentWalletCodeAction(allConfigStorage[CONST.STORAGE.CURRENT_WALLET_CODE] || defaultWallet.code));
    // 翻译配置加载完成
    dispatch(syncTranslateSettingAction(allConfigStorage[CONST.STORAGE.TRANSLATE_SETTING] || defaultTranslateSetting));
    /**
     * state部分
     */
    const allStateStorage = await electronStore.all('state');
    // tabs配置加载完成
    dispatch(syncTabsActiveKeyAction(allStateStorage[CONST.STORAGE.TABS_ACTIVE_KEY] || Enums.TabKeyType.Fund));
    // 排序配置加载完成
    dispatch(syncSortModeAction(allStateStorage[CONST.STORAGE.SORT_MODE] || sortInitialState.sortMode));
    // 视图配置加载完成
    dispatch(setViewModeAction(allStateStorage[CONST.STORAGE.VIEW_MODE] || sortInitialState.viewMode));
    // 保密状态加载完成
    dispatch(syncEyeStatusAction(allStateStorage[CONST.STORAGE.EYE_STATUS] ?? true));
    /**
     * cache部分
     */
    const allCacheStorage = await electronStore.all('cache');
    //远程数据缓存加载完成
    dispatch(setRemoteFundsAction(Object.values(allCacheStorage[CONST.STORAGE.REMOTE_FUND_MAP] || {})));
    dispatch(setFundRatingAction(Object.values(allCacheStorage[CONST.STORAGE.FUND_RATING_MAP] || {})));
    dispatch(setRemoteCoinsAction(Object.values(allCacheStorage[CONST.STORAGE.REMOTE_COIN_MAP] || {})));
    /**
     * 版本号
     */
    const version = await app.getVersion();
    dispatch(syncVersion(version));
    /**
     * 主题
     */
    await ipcRenderer
      .invoke('get-should-use-dark-colors')
      .then((_) => dispatch(syncDarkMode(_)))
      .finally(() => setLoading('系统主题加载完成'));
    /**
     *
     */
    await dispatch(loadSyncConfigAction()).finally(() => setLoading('同步配置加载完成'));

    setLoading('加载完毕');

    startTransition(() => {
      // 入口params使用真实地址window location做解析，其余一律使用router location
      const params: RedirectSearchParams = Utils.ParseLocationParams();
      navigate(params._redirect || CONST.ROUTES.HOME);
    });
  }

  useEffect(() => {
    init();
  }, []);

  return <LoadingScreen loading={showLoading} text={loadingText} />;
};

export default InitPage;
