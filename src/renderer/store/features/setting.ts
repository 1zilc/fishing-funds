import dayjs from 'dayjs';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@/store';
import { setWalletConfigAction } from '@/store/features/wallet';
import { setCoinConfigAction } from '@/store/features/coin';
import { setStockConfigAction } from '@/store/features/stock';
import { setFavoriteQuotationMapAction } from '@/store/features/quotation';
import { setZindexConfigAction } from '@/store/features/zindex';
import { setWebConfigAction } from '@/store/features/web';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Enums from '@/utils/enums';
import * as Enhancement from '@/utils/enhancement';

export type SettingState = {
  systemSetting: System.Setting;
  adjustmentNotificationDate: string;
  darkMode: boolean;
  varibleColors: Record<keyof typeof CONST.VARIBLES, string>;
};

export const defaultSystemSetting: System.Setting = {
  fundApiTypeSetting: Enums.FundApiType.Eastmoney,

  conciseSetting: false,
  lowKeySetting: false,
  baseFontSizeSetting: 12,
  systemThemeSetting: Enums.SystemThemeType.Auto,

  bottomTabsSetting: [
    {
      key: Enums.TabKeyType.Fund,
      name: '基金',
      show: true,
    },
    {
      key: Enums.TabKeyType.Zindex,
      name: '指数',
      show: true,
    },
    {
      key: Enums.TabKeyType.Quotation,
      name: '板块',
      show: true,
    },
    {
      key: Enums.TabKeyType.Stock,
      name: '股票',
      show: true,
    },
    {
      key: Enums.TabKeyType.Coin,
      name: '货币',
      show: true,
    },
  ],

  adjustmentNotificationSetting: true,
  adjustmentNotificationTimeSetting: dayjs().hour(14).minute(30).format(),
  riskNotificationSetting: true,
  trayContentSetting: [Enums.TrayContent.Sy],

  coinUnitSetting: Enums.CoinUnitType.Usd,

  proxyTypeSetting: Enums.ProxyType.System,
  proxyHostSetting: '127.0.0.1',
  proxyPortSetting: '1080',

  hotkeySetting: '',
  autoStartSetting: true,
  autoFreshSetting: true,
  freshDelaySetting: 1,
  autoCheckUpdateSetting: true,
  timestampSetting: Enums.TimestampType.Network,

  syncConfigSetting: false,
  syncConfigPathSetting: '',
};

const initialState: SettingState = {
  systemSetting: defaultSystemSetting,
  adjustmentNotificationDate: '',
  darkMode: false,
  varibleColors: Utils.GetVariblesColor(),
};

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    syncSettingAction(state, action: PayloadAction<System.Setting>) {
      state.systemSetting = action.payload;
    },
    updateAdjustmentNotificationDateAction(state, action: PayloadAction<string>) {
      state.adjustmentNotificationDate = action.payload;
    },
    syncDarkMode(state, action: PayloadAction<boolean>) {
      state.darkMode = action.payload;
      state.varibleColors = Utils.GetVariblesColor();
    },
  },
});
export const { syncSettingAction, updateAdjustmentNotificationDateAction, syncDarkMode } = settingSlice.actions;

export const setSystemSettingAction = createAsyncThunk<void, System.Setting, AsyncThunkConfig>(
  'setting/setSystemSettingAction',
  (newSetting, { dispatch, getState }) => {
    try {
      const {
        setting: { systemSetting: oldSystemSetting },
      } = getState();

      const systemSetting = { ...oldSystemSetting, ...newSetting };

      dispatch(syncSettingAction(systemSetting));
    } catch (error) {}
  }
);

export const saveSyncConfigAction = createAsyncThunk<void, void, AsyncThunkConfig>(
  'setting/setSystemSettingAction',
  async (_, { dispatch, getState }) => {
    try {
      const {
        wallet: {
          config: { walletConfig },
        },
        zindex: {
          config: { zindexConfig },
        },
        quotation: { favoriteQuotationMap },
        stock: {
          config: { stockConfig },
        },
        coin: {
          config: { coinConfig },
        },
        web: {
          config: { webConfig },
        },
        setting: {
          systemSetting: { syncConfigPathSetting },
        },
      } = getState();

      const config = {
        [CONST.STORAGE.WALLET_SETTING]: walletConfig,
        [CONST.STORAGE.ZINDEX_SETTING]: zindexConfig,
        [CONST.STORAGE.FAVORITE_QUOTATION_MAP]: favoriteQuotationMap,
        [CONST.STORAGE.STOCK_SETTING]: stockConfig,
        [CONST.STORAGE.COIN_SETTING]: coinConfig,
        [CONST.STORAGE.WEB_SETTING]: webConfig,
      };
      const syncConfig = Enhancement.GenerateSyncConfig(config);
      await Enhancement.SaveSyncConfig(syncConfigPathSetting, syncConfig);
    } catch (error) {}
  }
);

export const loadSyncConfigAction = createAsyncThunk<void, void, AsyncThunkConfig>(
  'setting/setSystemSettingAction',
  async (_, { dispatch, getState }) => {
    try {
      const {
        setting: {
          systemSetting: { syncConfigSetting, syncConfigPathSetting },
        },
      } = getState();
      if (syncConfigSetting && syncConfigPathSetting) {
        const config = await Enhancement.loadSyncConfig(syncConfigPathSetting);
        dispatch(setZindexConfigAction(config[CONST.STORAGE.ZINDEX_SETTING]));
        dispatch(setFavoriteQuotationMapAction(config[CONST.STORAGE.FAVORITE_QUOTATION_MAP]));
        dispatch(setStockConfigAction(config[CONST.STORAGE.STOCK_SETTING]));
        dispatch(setCoinConfigAction(config[CONST.STORAGE.COIN_SETTING]));
        dispatch(setWebConfigAction(config[CONST.STORAGE.WEB_SETTING]));
        dispatch(setWalletConfigAction(config[CONST.STORAGE.WALLET_SETTING]));
      }
    } catch (error) {}
  }
);

export default settingSlice.reducer;
