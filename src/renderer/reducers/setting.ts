import { SYNC_SETTING } from '@/actions/setting';
import { Reducer } from '@/reducers/types';
import * as Helpers from '@/helpers';

export type SettingState = {
  systemSetting: System.Setting;
};

const setting: Reducer<SettingState> = (
  state = {
    systemSetting: Helpers.Setting.GetSystemSetting(),
  },
  action
) => {
  switch (action.type) {
    case SYNC_SETTING:
      return {
        ...state,
        systemSetting: action.payload,
      };
    default:
      return state;
  }
};

export default setting;
