import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { batch } from 'react-redux';
import LoadingScreen from '@/components/LoadingScreen';
import { setRemoteFundsAction, setFundRatingMapAction } from '@/store/features/fund';
import { setZindexConfigAction, defaultZindexConfig } from '@/store/features/zindex';
import {
  setSystemSettingAction,
  updateAdjustmentNotificationDateAction,
  defaultSystemSetting,
  syncDarkMode,
} from '@/store/features/setting';
import { setWalletConfigAction, changeEyeStatusAction, selectWalletAction, defaultWallet } from '@/store/features/wallet';
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

const { ipcRenderer } = window.contextModules.electron;

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
      await Utils.CoverStorage(config);
      localStorage.clear();
    } else {
    }
  }

  async function init() {
    await checkLocalStorage();

    setLoading('加载指数配置...');
    const zindexSetting = await Utils.GetStorage(CONST.STORAGE.ZINDEX_SETTING, defaultZindexConfig);
    dispatch(setZindexConfigAction(zindexSetting));

    setLoading('加载关注板块配置...');
    const favoriteQuotationMap = await Utils.GetStorage(CONST.STORAGE.FAVORITE_QUOTATION_MAP, {});
    dispatch(syncFavoriteQuotationMapAction(favoriteQuotationMap));

    setLoading('加载股票配置...');
    const stockSetting = await Utils.GetStorage(CONST.STORAGE.STOCK_SETTING, []);
    dispatch(setStockConfigAction(stockSetting));

    setLoading('加载货币配置...');
    const coinSetting = await Utils.GetStorage(CONST.STORAGE.COIN_SETTING, []);
    dispatch(setCoinConfigAction(coinSetting));

    setLoading('加载web配置...');
    const webSetting = await Utils.GetStorage(CONST.STORAGE.WEB_SETTING, defaultWebConfig);
    dispatch(setWebConfigAction(webSetting));

    setLoading('加载系统设置...');
    const systemSetting = await Utils.GetStorage(CONST.STORAGE.SYSTEM_SETTING, defaultSystemSetting);
    const adjustmentNotificationDate = await Utils.GetStorage(CONST.STORAGE.ADJUSTMENT_NOTIFICATION_DATE, '');
    const darkMode = await ipcRenderer.invoke('get-should-use-dark-colors');
    batch(() => {
      dispatch(setSystemSettingAction(systemSetting));
      dispatch(updateAdjustmentNotificationDateAction(adjustmentNotificationDate));
      dispatch(syncDarkMode(darkMode));
    });

    setLoading('加载钱包配置...');
    const walletSetting = await Utils.GetStorage(CONST.STORAGE.WALLET_SETTING, [defaultWallet]);
    const eyeStatus = await Utils.GetStorage(CONST.STORAGE.EYE_STATUS, Enums.EyeStatus.Open);
    const currentWalletCode = await Utils.GetStorage(CONST.STORAGE.CURRENT_WALLET_CODE, defaultWallet.code);
    batch(() => {
      dispatch(setWalletConfigAction(walletSetting));
      dispatch(changeEyeStatusAction(eyeStatus));
      dispatch(selectWalletAction(currentWalletCode));
    });

    setLoading('加载tabs配置...');
    const tabsActiveKey = await Utils.GetStorage(CONST.STORAGE.TABS_ACTIVE_KEY, Enums.TabKeyType.Funds);
    dispatch(syncTabsActiveKeyAction(tabsActiveKey));

    setLoading('加载排序配置...');
    const sortMode = await Utils.GetStorage(CONST.STORAGE.SORT_MODE, sortInitialState.sortMode);
    dispatch(syncSortModeAction(sortMode));

    setLoading('加载视图配置...');
    const viewMode = await Utils.GetStorage(CONST.STORAGE.VIEW_MODE, sortInitialState.viewMode);
    dispatch(syncSortModeAction(sortMode));
    dispatch(setViewModeAction(viewMode));

    setLoading('加载远程数据缓存...');
    const remoteFundMap = await Utils.GetStorage(CONST.STORAGE.REMOTE_FUND_MAP, {});
    const fundRatingMap = await Utils.GetStorage(CONST.STORAGE.FUND_RATING_MAP, {});
    const remoteCoinMap = await Utils.GetStorage(CONST.STORAGE.REMOTE_COIN_MAP, {});
    batch(() => {
      dispatch(setRemoteFundsAction(Object.values(remoteFundMap)));
      dispatch(setFundRatingMapAction(Object.values(fundRatingMap)));
      dispatch(setRemoteCoinsAction(Object.values(remoteCoinMap)));
    });

    setLoading('加载完毕');

    navigate('/home');
  }

  useEffect(() => {
    init();
  }, []);

  return <LoadingScreen loading={showLoading} text={loadingText} />;
};

export default InitPage;
