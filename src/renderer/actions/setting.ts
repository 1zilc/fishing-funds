import { ThunkAction } from '@/reducers/types';
import * as Utils from '@/utils';
import * as CONST from '@/constants';

export const SYNC_SETTING = 'SYNC_SETTING';
export const UPDATE_ADJUSTMENT_NOTIFICATION_DATE = 'UPDATE_ADJUSTMENT_NOTIFICATION_DATE';

export function setSystemSettingAction(newSetting: System.Setting): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        setting: { systemSetting: oldSystemSetting },
      } = getState();

      const systemSetting = { ...oldSystemSetting, ...newSetting };

      dispatch({ type: SYNC_SETTING, payload: systemSetting });

      Utils.SetStorage(CONST.STORAGE.SYSTEM_SETTING, systemSetting);
    } catch (error) {}
  };
}

export function setAdjustmentNotificationDateAction(date: string): ThunkAction {
  return (dispatch, getState) => {
    try {
      dispatch({ type: UPDATE_ADJUSTMENT_NOTIFICATION_DATE, payload: date });

      Utils.SetStorage(CONST.STORAGE.ADJUSTMENT_NOTIFICATION_DATE, date);
    } catch (error) {}
  };
}

export function clearAdjustmentNotificationDateAction(): ThunkAction {
  return (dispatch, getState) => {
    try {
      dispatch({ type: UPDATE_ADJUSTMENT_NOTIFICATION_DATE, payload: '' });

      Utils.ClearStorage(CONST.STORAGE.ADJUSTMENT_NOTIFICATION_DATE);
    } catch (error) {}
  };
}
