import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Helpers from '@/helpers';

export type SettingState = {
  systemSetting: System.Setting;
  adjustmentNotificationDate: string;
};

const initialState = {
  systemSetting: Helpers.Setting.defalutSystemSetting,
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

export default settingSlice.reducer;
