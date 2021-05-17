import { AnyAction } from 'redux';

import { getSystemSetting, SYNC_SETTING } from '../actions/setting';

export interface SettingState {
  systemSetting: System.Setting;
}

export default function setting(
  state: SettingState = {
    systemSetting: getSystemSetting(),
  },
  action: AnyAction
): SettingState {
  switch (action.type) {
    case SYNC_SETTING:
      return {
        ...state,
        systemSetting: action.payload,
      };
    default:
      return state;
  }
}
