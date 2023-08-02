import dayjs from 'dayjs';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@/store';
import { setWalletConfigAction, changeCurrentWalletCodeAction } from '@/store/features/wallet';
import { setCoinConfigAction } from '@/store/features/coin';
import { setStockConfigAction } from '@/store/features/stock';
import { setFavoriteQuotationMapAction } from '@/store/features/quotation';
import { setZindexConfigAction } from '@/store/features/zindex';
import { setWebConfigAction } from '@/store/features/web';
import { setTranslateSettingAction } from '@/store/features/translate';
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

  themeColorTypeSetting: Enums.ThemeColorType.Default,
  customThemeColorSetting: '',
  conciseSetting: false,
  lowKeySetting: false,
  lowKeyDegreeSetting: 80,
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
  timestampSetting: Enums.TimestampType.Local,

  syncConfigSetting: false,
  syncConfigPathSetting: '',
};

const initialState: SettingState = {
  systemSetting: defaultSystemSetting,
  adjustmentNotificationDate: '',
  darkMode: false,
  varibleColors: {} as Record<keyof typeof CONST.VARIBLES, string>,
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
    },
    syncVaribleColors(state) {
      state.varibleColors = Utils.GetVariblesColor();
    },
  },
});
export const { syncSettingAction, updateAdjustmentNotificationDateAction, syncDarkMode, syncVaribleColors } =
  settingSlice.actions;

export const setSystemSettingAction = createAsyncThunk<void, System.Setting, AsyncThunkConfig>(
  'setting/setSystemSettingAction',
  (newSetting, { dispatch, getState }) => {
    try {
      const {
        setting: { systemSetting: oldSetting },
      } = getState();

      const systemSetting = { ...oldSetting, ...newSetting };

      dispatch(syncSettingAction(systemSetting));
    } catch (error) {}
  }
);

export const saveSyncConfigAction = createAsyncThunk<void, void, AsyncThunkConfig>(
  'setting/saveSyncConfigAction',
  async (_, { dispatch, getState }) => {
    try {
      const {
        wallet: {
          config: { walletConfig },
          currentWalletCode,
        },
        zindex: {
          config: { zindexConfig },
        },
        quotation: { favoriteQuotationMap },
        coin: {
          config: { coinConfig },
        },
        web: {
          config: { webConfig },
        },
        translate: { translateSetting },
        chatGPT: { chatGPTSetting },
        setting: {
          systemSetting: { syncConfigPathSetting },
        },
      } = getState();

      const config = {
        [CONST.STORAGE.WALLET_SETTING]: walletConfig,
        [CONST.STORAGE.ZINDEX_SETTING]: zindexConfig,
        [CONST.STORAGE.FAVORITE_QUOTATION_MAP]: favoriteQuotationMap,
        [CONST.STORAGE.COIN_SETTING]: coinConfig,
        [CONST.STORAGE.WEB_SETTING]: webConfig,
        [CONST.STORAGE.CURRENT_WALLET_CODE]: currentWalletCode,
        [CONST.STORAGE.TRANSLATE_SETTING]: translateSetting,
        [CONST.STORAGE.CHATGPT_SETTING]: chatGPTSetting,
      };
      const syncConfig = await Enhancement.GenerateSyncConfig(config);
      await Enhancement.SaveSyncConfig(syncConfigPathSetting, syncConfig);
    } catch (error) {}
  }
);

export const loadSyncConfigAction = createAsyncThunk<void, void, AsyncThunkConfig>(
  'setting/loadSyncConfigAction',
  async (_, { dispatch, getState }) => {
    try {
      const {
        setting: {
          systemSetting: { syncConfigSetting, syncConfigPathSetting },
        },
      } = getState();
      if (syncConfigSetting && syncConfigPathSetting) {
        const config: any = await Enhancement.loadSyncConfig(syncConfigPathSetting);
        dispatch(setWalletConfigAction(config[CONST.STORAGE.WALLET_SETTING]));
        dispatch(setZindexConfigAction(config[CONST.STORAGE.ZINDEX_SETTING]));
        dispatch(setFavoriteQuotationMapAction(config[CONST.STORAGE.FAVORITE_QUOTATION_MAP]));
        dispatch(setCoinConfigAction(config[CONST.STORAGE.COIN_SETTING]));
        dispatch(setWebConfigAction(config[CONST.STORAGE.WEB_SETTING]));
        dispatch(changeCurrentWalletCodeAction(config[CONST.STORAGE.CURRENT_WALLET_CODE]));
        dispatch(setTranslateSettingAction(config[CONST.STORAGE.TRANSLATE_SETTING]));
      }
    } catch (error) {}
  }
);

export default settingSlice.reducer;
