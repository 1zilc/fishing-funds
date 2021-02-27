import { GetState, Dispatch } from '@/reducers/types';
import { EyeStatus } from '@/utils/enums';
import * as CONST from '@/constants';
import * as Utils from '@/utils';

export const UPDATE_UPTATETIME = 'UPDATE_UPTATETIME';
export const CHANGE_EYE_STATUS = 'CHANGE_EYE_STATUS';

export function updateUpdateTime(updateTime: string) {
  return {
    type: UPDATE_UPTATETIME,
    payload: updateTime,
  };
}

export function changeEyeStatus(status: EyeStatus) {
  Utils.SetStorage(CONST.STORAGE.EYE_STATUS, status);
  return {
    type: CHANGE_EYE_STATUS,
    payload: status,
  };
}

export function toggleEyeStatus() {
  return (dispatch: Dispatch, getState: GetState) => {
    const { wallet } = getState();
    const { eyeStatus } = wallet;
    switch (eyeStatus) {
      case EyeStatus.Open:
        dispatch(changeEyeStatus(EyeStatus.Close));
        break;
      case EyeStatus.Close:
        dispatch(changeEyeStatus(EyeStatus.Open));
        break;
      default:
    }
  };
}
