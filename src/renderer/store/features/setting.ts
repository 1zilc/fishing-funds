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
  return (dispatch, getState) => {
    try {
      const {
        setting: { systemSetting: oldSystemSetting },
      } = getState();

      const systemSetting = { ...oldSystemSetting, ...newSetting };

      dispatch(syncSetting(systemSetting));
      Utils.SetStorage(CONST.STORAGE.SYSTEM_SETTING, systemSetting);
    } catch (error) {}
  };
}

export function setAdjustmentNotificationDateAction(date: string): TypedThunk {
  return (dispatch, getState) => {
    try {
      dispatch(updateAdjustmentNotificationDate(date));
      Utils.SetStorage(CONST.STORAGE.ADJUSTMENT_NOTIFICATION_DATE, date);
    } catch (error) {}
  };
}

export function clearAdjustmentNotificationDateAction(): TypedThunk {
  return (dispatch, getState) => {
    try {
      dispatch(updateAdjustmentNotificationDate(''));
      Utils.ClearStorage(CONST.STORAGE.ADJUSTMENT_NOTIFICATION_DATE);
    } catch (error) {}
  };
}

export default settingSlice.reducer;
