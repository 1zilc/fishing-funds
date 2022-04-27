import dayjs from 'dayjs';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TypedThunk } from '@/store';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Enums from '@/utils/enums';

export type SettingState = {
  systemSetting: System.Setting;
  adjustmentNotificationDate: string;
};

export const defaultSystemSetting: System.Setting = {
  fundApiTypeSetting: Enums.FundApiType.Eastmoney,

  conciseSetting: false,
  lowKeySetting: false,
  baseFontSizeSetting: 12,
  systemThemeSetting: Enums.SystemThemeType.Auto,

  adjustmentNotificationSetting: true,
  adjustmentNotificationTimeSetting: dayjs().hour(14).minute(30).format(),
  riskNotificationSetting: true,
  trayContentSetting: [Enums.TrayContent.Sy],

  coinUnitSetting: Enums.CoinUnitType.Usd,

  autoStartSetting: true,
  autoFreshSetting: true,
  freshDelaySetting: 1,
  autoCheckUpdateSetting: true,
  timestampSetting: Enums.TimestampType.Network,
};

const initialState = {
  systemSetting: defaultSystemSetting,
  adjustmentNotificationDate: '',
} as SettingState;

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    syncSetting(state, action) {
      state.systemSetting = action.payload;
    },
    updateAdjustmentNotificationDate(state, action: PayloadAction<string>) {
      state.adjustmentNotificationDate = action.payload;
    },
  },
});
export const { syncSetting, updateAdjustmentNotificationDate } = settingSlice.actions;

export function setSystemSettingAction(newSetting: System.Setting): TypedThunk {
  return async (dispatch, getState) => {
    try {
      const {
        setting: { systemSetting: oldSystemSetting },
      } = getState();

      const systemSetting = { ...oldSystemSetting, ...newSetting };
      await Utils.SetStorage(CONST.STORAGE.SYSTEM_SETTING, systemSetting);
      dispatch(syncSetting(systemSetting));
    } catch (error) {}
  };
}

export function setAdjustmentNotificationDateAction(date: string): TypedThunk {
  return async (dispatch, getState) => {
    try {
      await Utils.SetStorage(CONST.STORAGE.ADJUSTMENT_NOTIFICATION_DATE, date);
      dispatch(updateAdjustmentNotificationDate(date));
    } catch (error) {}
  };
}

export function clearAdjustmentNotificationDateAction(): TypedThunk {
  return async (dispatch, getState) => {
    try {
      await Utils.ClearStorage(CONST.STORAGE.ADJUSTMENT_NOTIFICATION_DATE);
      dispatch(updateAdjustmentNotificationDate(''));
    } catch (error) {}
  };
}

export default settingSlice.reducer;
