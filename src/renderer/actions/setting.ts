import { AnyAction } from 'redux';
import { ThunkAction } from '@/reducers/types';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';

export const SYNC_SETTING = 'SYNC_SETTING';

export function setSystemSettingAction(setting: System.Setting): ThunkAction {
  return (dispatch, getState) => {
    const {
      setting: { systemSetting },
    } = getState();

    Utils.SetStorage(CONST.STORAGE.SYSTEM_SETTING, {
      ...systemSetting,
      ...setting,
    });

    dispatch(syncSystemSettingAction());
  };
}

export function syncSystemSettingAction(): AnyAction {
  const systemSetting = Helpers.Setting.GetSystemSetting();
  return {
    type: SYNC_SETTING,
    payload: systemSetting,
  };
}
