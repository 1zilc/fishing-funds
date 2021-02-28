import { AnyAction } from 'redux';

import { UPDATE_UPTATETIME, CHANGE_EYE_STATUS } from '@/actions/wallet';
import { EyeStatus } from '@/utils/enums';
import * as CONST from '@/constants';
import * as Utils from '@/utils';
export interface WalletState {
  updateTime: string;
  eyeStatus: EyeStatus;
}

export default function wallet(
  state = {
    updateTime: '还没有刷新过哦～',
    eyeStatus: Utils.GetStorage(CONST.STORAGE.EYE_STATUS, EyeStatus.Open),
  },
  action: AnyAction
) {
  switch (action.type) {
    case UPDATE_UPTATETIME:
      return {
        ...state,
        updateTime: action.payload,
      };
    case CHANGE_EYE_STATUS:
      return {
        ...state,
        eyeStatus: action.payload,
      };
    default:
      return state;
  }
}
