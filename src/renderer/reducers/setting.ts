import { SYNC_SETTING, UPDATE_ADJUSTMENT_NOTIFICATION_DATE } from '@/actions/setting';
import { Reducer } from '@/reducers/types';
import * as Helpers from '@/helpers';

export type SettingState = {
  systemSetting: System.Setting;
  adjustmentNotificationDate: string;
};

const setting: Reducer<SettingState> = (
  state = {
    systemSetting: Helpers.Setting.defalutSystemSetting,
    adjustmentNotificationDate: '',
  },
  action
) => {
  switch (action.type) {
    case SYNC_SETTING:
      return {
        ...state,
        systemSetting: action.payload,
      };
    case UPDATE_ADJUSTMENT_NOTIFICATION_DATE:
      return {
        ...state,
        adjustmentNotificationDate: action.payload,
      };
    default:
      return state;
  }
};

export default setting;
