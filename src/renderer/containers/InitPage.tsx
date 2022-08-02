import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '@/components/LoadingScreen';
import { setRemoteFundsAction, setFundRatingMapAction } from '@/store/features/fund';
import { setZindexConfigAction, defaultZindexConfig } from '@/store/features/zindex';
import {
  setSystemSettingAction,
  updateAdjustmentNotificationDateAction,
  defaultSystemSetting,
  syncDarkMode,
  loadSyncConfigAction,
} from '@/store/features/setting';
import { setWalletConfigAction, syncEyeStatusAction, changeCurrentWalletCodeAction, defaultWallet } from '@/store/features/wallet';
import { setStockConfigAction } from '@/store/features/stock';
import { setCoinConfigAction, setRemoteCoinsAction } from '@/store/features/coin';
import { syncSortModeAction, setViewModeAction, initialState as sortInitialState } from '@/store/features/sort';
import { syncTabsActiveKeyAction } from '@/store/features/tabs';
import { setWebConfigAction, defaultWebConfig } from '@/store/features/web';
import { useDrawer, useAppDispatch } from '@/utils/hooks';
import { syncFavoriteQuotationMapAction } from '@/store/features/quotation';
import * as CONST from '@/constants';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';
import * as Enhancement from '@/utils/enhancement';

const { ipcRenderer } = window.contextModules.electron;

const params = Utils.ParseSearchParams();

const InitPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: loadingText, show: showLoading, set: setLoading } = useDrawer('加载本地配置中...');

  async function checkLocalStorage() {
    if (localStorage.length) {
      setLoading('迁移旧版本配置...');
      const config = Object.keys(CONST.STORAGE).reduce<Record<string, any>>((data, key) => {
        const content = localStorage.getItem(key);
        if (content !== undefined && content !== null) {
          data[key] = JSON.parse(content);
        }
        return data;
      }, {});
      await Enhancement.CoverStorage(config);
      localStorage.clear();
    } else {
    }
  }

  async function init() {
    await checkLocalStorage();

    const allStorage = await Enhancement.GetAllStorage();
    //web配置加载完成
    dispatch(setZindexConfigAction(allStorage[CONST.STORAGE.ZINDEX_SETTING] || defaultZindexConfig));
    // 关注板块配置加载完成
    dispatch(syncFavoriteQuotationMapAction(allStorage[CONST.STORAGE.FAVORITE_QUOTATION_MAP] || {}));
    // 股票配置加载完成
    dispatch(setStockConfigAction(allStorage[CONST.STORAGE.STOCK_SETTING] || []));
    // 货币配置加载完成
    dispatch(setCoinConfigAction(allStorage[CONST.STORAGE.COIN_SETTING] || []));
    // web配置加载完成
    dispatch(setWebConfigAction(allStorage[CONST.STORAGE.WEB_SETTING] || defaultWebConfig));
    // 系统设置加载完成
    dispatch(setSystemSettingAction(allStorage[CONST.STORAGE.SYSTEM_SETTING] || defaultSystemSetting));
    dispatch(updateAdjustmentNotificationDateAction(allStorage[CONST.STORAGE.ADJUSTMENT_NOTIFICATION_DATE] || ''));
    // 钱包配置加载完成
    dispatch(setWalletConfigAction(allStorage[CONST.STORAGE.WALLET_SETTING] || [defaultWallet]));
    dispatch(syncEyeStatusAction(allStorage[CONST.STORAGE.EYE_STATUS] || Enums.EyeStatus.Open));
    dispatch(changeCurrentWalletCodeAction(allStorage[CONST.STORAGE.CURRENT_WALLET_CODE] || defaultWallet.code));
    // tabs配置加载完成
    dispatch(syncTabsActiveKeyAction(allStorage[CONST.STORAGE.TABS_ACTIVE_KEY] || Enums.TabKeyType.Fund));
    // 排序配置加载完成
    dispatch(syncSortModeAction(allStorage[CONST.STORAGE.SORT_MODE] || sortInitialState.sortMode));
    // 视图配置加载完成
    dispatch(setViewModeAction(allStorage[CONST.STORAGE.VIEW_MODE] || sortInitialState.viewMode));
    //远程数据缓存加载完成
    dispatch(setRemoteFundsAction(Object.values(allStorage[CONST.STORAGE.REMOTE_FUND_MAP] || {})));
    dispatch(setFundRatingMapAction(Object.values(allStorage[CONST.STORAGE.FUND_RATING_MAP] || {})));
    dispatch(setRemoteCoinsAction(Object.values(allStorage[CONST.STORAGE.REMOTE_COIN_MAP] || {})));

    await ipcRenderer
      .invoke('get-should-use-dark-colors')
      .then((_) => dispatch(syncDarkMode(_)))
      .finally(() => setLoading('系统主题加载完成'));

    await dispatch(loadSyncConfigAction()).finally(() => setLoading('同步配置加载完成'));

    setLoading('加载完毕');

    navigate(params.get('_nav') || '/home');
  }

  useEffect(() => {
    init();
  }, []);

  return <LoadingScreen loading={showLoading} text={loadingText} />;
};

export default InitPage;
