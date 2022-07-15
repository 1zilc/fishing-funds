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

    await Promise.all([
      Enhancement.GetStorage(CONST.STORAGE.ZINDEX_SETTING, defaultZindexConfig)
        .then((_) => dispatch(setZindexConfigAction(_)))
        .finally(() => setLoading('web配置加载完成')),

      Enhancement.GetStorage(CONST.STORAGE.FAVORITE_QUOTATION_MAP, {})
        .then((_) => dispatch(syncFavoriteQuotationMapAction(_)))
        .finally(() => setLoading('关注板块配置加载完成')),

      Enhancement.GetStorage(CONST.STORAGE.STOCK_SETTING, [])
        .then((_) => dispatch(setStockConfigAction(_)))
        .finally(() => setLoading('股票配置加载完成')),

      Enhancement.GetStorage(CONST.STORAGE.COIN_SETTING, [])
        .then((_) => dispatch(setCoinConfigAction(_)))
        .finally(() => setLoading('货币配置加载完成')),

      Enhancement.GetStorage(CONST.STORAGE.WEB_SETTING, defaultWebConfig)
        .then((_) => dispatch(setWebConfigAction(_)))
        .finally(() => setLoading('web配置加载完成')),

      Promise.all([
        Enhancement.GetStorage(CONST.STORAGE.SYSTEM_SETTING, defaultSystemSetting).then((_) => dispatch(setSystemSettingAction(_))),
        Enhancement.GetStorage(CONST.STORAGE.ADJUSTMENT_NOTIFICATION_DATE, '').then((_) =>
          dispatch(updateAdjustmentNotificationDateAction(_))
        ),
        ipcRenderer.invoke('get-should-use-dark-colors').then((_) => dispatch(syncDarkMode(_))),
      ]).finally(() => setLoading('系统设置加载完成')),

      Promise.all([
        Enhancement.GetStorage(CONST.STORAGE.WALLET_SETTING, [defaultWallet]).then((_) => dispatch(setWalletConfigAction(_))),
        Enhancement.GetStorage(CONST.STORAGE.EYE_STATUS, Enums.EyeStatus.Open).then((_) => dispatch(syncEyeStatusAction(_))),
        Enhancement.GetStorage(CONST.STORAGE.CURRENT_WALLET_CODE, defaultWallet.code).then((_) =>
          dispatch(changeCurrentWalletCodeAction(_))
        ),
      ]).finally(() => setLoading('钱包配置加载完成')),

      Enhancement.GetStorage(CONST.STORAGE.TABS_ACTIVE_KEY, Enums.TabKeyType.Funds)
        .then((_) => dispatch(syncTabsActiveKeyAction(_)))
        .finally(() => setLoading('tabs配置加载完成')),

      Enhancement.GetStorage(CONST.STORAGE.SORT_MODE, sortInitialState.sortMode)
        .then((_) => dispatch(syncSortModeAction(_)))
        .finally(() => setLoading('排序配置加载完成')),

      Enhancement.GetStorage(CONST.STORAGE.VIEW_MODE, sortInitialState.viewMode)
        .then((_) => dispatch(setViewModeAction(_)))
        .finally(() => setLoading('视图配置加载完成')),

      Promise.all([
        Enhancement.GetStorage(CONST.STORAGE.REMOTE_FUND_MAP, {}).then((_) => dispatch(setRemoteFundsAction(Object.values(_)))),
        Enhancement.GetStorage(CONST.STORAGE.FUND_RATING_MAP, {}).then((_) => dispatch(setFundRatingMapAction(Object.values(_)))),
        Enhancement.GetStorage(CONST.STORAGE.REMOTE_COIN_MAP, {}).then((_) => dispatch(setRemoteCoinsAction(Object.values(_)))),
      ]).finally(() => setLoading('远程数据缓存加载完成')),
    ]).finally(() => setLoading('加载完毕'));

    navigate(params.get('_nav') || '/home');
  }

  useEffect(() => {
    init();
  }, []);

  return <LoadingScreen loading={showLoading} text={loadingText} />;
};

export default InitPage;
