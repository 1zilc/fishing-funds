import dayjs from 'dayjs';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@/store';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Enums from '@/utils/enums';

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

export default settingSlice.reducer;
