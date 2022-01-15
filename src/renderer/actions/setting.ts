import { ThunkAction } from '@/reducers/types';
import * as Utils from '@/utils';
import * as CONST from '@/constants';

export const SYNC_SETTING = 'SYNC_SETTING';

export function setSystemSettingAction(newSetting: System.Setting): ThunkAction {
  return async (dispatch, getState) => {
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
