import { TypedThunk } from '@/store';
import { syncSetting, updateAdjustmentNotificationDate } from '@/store/features/setting';
import * as Utils from '@/utils';
import * as CONST from '@/constants';

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
