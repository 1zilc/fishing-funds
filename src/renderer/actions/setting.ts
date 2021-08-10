import { ThunkAction } from '@/reducers/types';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';

export const SYNC_SETTING = 'SYNC_SETTING';

export function setSystemSettingAction(setting: System.Setting): ThunkAction {
  return (dispatch, getState) => {
    try {
      const systemSetting = Helpers.Setting.GetSystemSetting();

      Utils.SetStorage(CONST.STORAGE.SYSTEM_SETTING, {
        ...systemSetting,
        ...setting,
      });

      dispatch(syncSystemSettingAction());
    } catch (error) {
      console.log('设置系统设置出错', error);
    }
  };
}

export function syncSystemSettingAction(): ThunkAction {
  return (dispatch, getState) => {
    try {
      const systemSetting = Helpers.Setting.GetSystemSetting();
      dispatch({ type: SYNC_SETTING, payload: systemSetting });
    } catch (error) {
      console.log('同步系统设置出错', error);
    }
  };
}
