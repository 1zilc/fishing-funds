import { GetState, Dispatch } from '@/reducers/types';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';
import * as Utils from '@/utils';

export const UPDATE_UPTATETIME = 'UPDATE_UPTATETIME';
export const CHANGE_EYE_STATUS = 'CHANGE_EYE_STATUS';
export const CHANGE_WALLET_INDEX = 'CHANGE_WALLET_INDEX';

export function updateUpdateTime(updateTime: string) {
  return {
    type: UPDATE_UPTATETIME,
    payload: updateTime,
  };
}

export function changeEyeStatus(status: Enums.EyeStatus) {
  Utils.SetStorage(CONST.STORAGE.EYE_STATUS, status);
  return {
    type: CHANGE_EYE_STATUS,
    payload: status,
  };
}

export function changeWalletIndex(index: number) {
  Utils.SetStorage(CONST.STORAGE.WALLET_INDEX, index);
  return {
    type: CHANGE_WALLET_INDEX,
    payload: index,
  };
}

export function toggleEyeStatus() {
  return (dispatch: Dispatch, getState: GetState) => {
    const { wallet } = getState();
    const { eyeStatus } = wallet;
    switch (eyeStatus) {
      case Enums.EyeStatus.Open:
        dispatch(changeEyeStatus(Enums.EyeStatus.Close));
        break;
      case Enums.EyeStatus.Close:
        dispatch(changeEyeStatus(Enums.EyeStatus.Open));
        break;
      default:
    }
  };
}
