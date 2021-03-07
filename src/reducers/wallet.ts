import { AnyAction } from 'redux';

import {
  UPDATE_UPTATETIME,
  CHANGE_EYE_STATUS,
  CHANGE_WALLET_INDEX,
} from '@/actions/wallet';

import { EyeStatus } from '@/utils/enums';
import * as CONST from '@/constants';
import * as Utils from '@/utils';

export interface WalletState {
  updateTime: string;
  eyeStatus: EyeStatus;
  walletIndex: number;
}

export default function wallet(
  state: WalletState = {
    updateTime: '还没有刷新过哦～',
    eyeStatus: Utils.GetStorage(CONST.STORAGE.EYE_STATUS, EyeStatus.Open),
    walletIndex: Utils.GetStorage(CONST.STORAGE.WALLET_INDEX, 0),
  },

  action: AnyAction
): WalletState {
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

    case CHANGE_WALLET_INDEX:
      return {
        ...state,
        walletIndex: action.payload,
      };
    default:
      return state;
  }
}
