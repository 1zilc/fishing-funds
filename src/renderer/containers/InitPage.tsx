import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { batch } from 'react-redux';
import LoadingScreen from '@/components/LoadingScreen';
import { setRemoteFundsAction, setFundRatingMapAction } from '@/actions/fund';
import { setZindexConfigAction } from '@/actions/zindex';
import { SYNC_FAVORITE_QUOTATION_MAP } from '@/actions/quotation';
import { setSystemSettingAction, setAdjustmentNotificationDateAction } from '@/actions/setting';
import { setWalletConfigAction, changeEyeStatusAction, selectWalletAction } from '@/actions/wallet';
import { setStockConfigAction } from '@/actions/stock';
import { setCoinConfigAction, setRemoteCoinsAction } from '@/actions/coin';
import { syncSortModeAction, syncViewModeAction } from '@/actions/sort';
import { setWebConfigAction } from '@/actions/web';
import { useDrawer, useAppDispatch } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';
import * as Enums from '@/utils/enums';

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
    const zindexSetting = await Utils.GetStorage(CONST.STORAGE.ZINDEX_SETTING, Helpers.Zindex.defaultZindexConfig);
    dispatch(setZindexConfigAction(zindexSetting));

    setLoading('加载关注板块配置...');
    const favoriteQuotationMap = await Utils.GetStorage(CONST.STORAGE.FAVORITE_QUOTATION_MAP, {});
    dispatch({ type: SYNC_FAVORITE_QUOTATION_MAP, payload: favoriteQuotationMap });

    setLoading('加载股票配置...');
    const stockSetting = await Utils.GetStorage(CONST.STORAGE.STOCK_SETTING, []);
    dispatch(setStockConfigAction(stockSetting));

    setLoading('加载货币配置...');
    const coinSetting = await Utils.GetStorage(CONST.STORAGE.COIN_SETTING, []);
    dispatch(setCoinConfigAction(coinSetting));

    setLoading('加载web配置...');
    const webSetting = await Utils.GetStorage(CONST.STORAGE.WEB_SETTING, Helpers.Web.defaultWebConfig);
    dispatch(setWebConfigAction(webSetting));

    setLoading('加载系统设置...');
    const systemSetting = await Utils.GetStorage(CONST.STORAGE.SYSTEM_SETTING, Helpers.Setting.defalutSystemSetting);
    const adjustmentNotificationDate = await Utils.GetStorage(CONST.STORAGE.ADJUSTMENT_NOTIFICATION_DATE, '');
    batch(() => {
      dispatch(setSystemSettingAction(systemSetting));
      dispatch(setAdjustmentNotificationDateAction(adjustmentNotificationDate));
    });

    setLoading('加载钱包配置...');
    const walletSetting = await Utils.GetStorage(CONST.STORAGE.WALLET_SETTING, [Helpers.Wallet.defaultWallet]);
    const eyeStatus = await Utils.GetStorage(CONST.STORAGE.EYE_STATUS, Enums.EyeStatus.Open);
    const currentWalletCode = await Utils.GetStorage(CONST.STORAGE.CURRENT_WALLET_CODE, Helpers.Wallet.defaultWallet.code);
    batch(() => {
      dispatch(setWalletConfigAction(walletSetting));
      dispatch(changeEyeStatusAction(eyeStatus));
      dispatch(selectWalletAction(currentWalletCode));
    });

    setLoading('加载排序配置...');
    const fundSortMode = await Utils.GetStorage(CONST.STORAGE.FUND_SORT_MODE, {
      type: Enums.FundSortType.Custom,
      order: Enums.SortOrderType.Desc,
    });
    const zindexSortMode = await Utils.GetStorage(CONST.STORAGE.ZINDEX_SORT_MODE, {
      type: Enums.ZindexSortType.Custom,
      order: Enums.SortOrderType.Desc,
    });
    const quotationSortMode = await Utils.GetStorage(CONST.STORAGE.QUOTATION_SORT_MODE, {
      type: Enums.QuotationSortType.Zdf,
      order: Enums.SortOrderType.Desc,
    });
    const stockSortMode = await Utils.GetStorage(CONST.STORAGE.STOCK_SORT_MODE, {
      type: Enums.StockSortType.Custom,
      order: Enums.SortOrderType.Desc,
    });
    const coinSortMode = await Utils.GetStorage(CONST.STORAGE.COIN_SORT_MODE, {
      type: Enums.CoinSortType.Price,
      order: Enums.SortOrderType.Desc,
    });
    dispatch(syncSortModeAction({ fundSortMode, zindexSortMode, quotationSortMode, stockSortMode, coinSortMode }));

    setLoading('加载视图配置...');
    const fundViewMode = await Utils.GetStorage(CONST.STORAGE.FUND_VIEW_MODE, {
      type: Enums.FundViewType.List,
    });
    const zindexViewMode = await Utils.GetStorage(CONST.STORAGE.ZINDEX_VIEW_MODE, {
      type: Enums.ZindexViewType.Grid,
    });
    const quotationViewMode = await Utils.GetStorage(CONST.STORAGE.QUOTATION_VIEW_MODE, {
      type: Enums.QuotationViewType.List,
    });
    const stockViewMode = await Utils.GetStorage(CONST.STORAGE.STOCK_VIEW_MODE, {
      type: Enums.StockViewType.List,
    });
    const coinViewMode = await Utils.GetStorage(CONST.STORAGE.COIN_VIEW_MODE, {
      type: Enums.CoinViewType.List,
    });
    dispatch(syncViewModeAction({ fundViewMode, zindexViewMode, quotationViewMode, stockViewMode, coinViewMode }));

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
