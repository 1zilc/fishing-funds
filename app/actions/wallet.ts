import { GetState, Dispatch } from '../reducers/types';
import { EyeStatus } from '../utils/enums';
import CONST_STORAGE from '../constants/storage.json';
import * as Utils from '../utils';

export const UPDATE_UPTATETIME = 'UPDATE_UPTATETIME';
export const CHANGE_EYE_STATUS = 'CHANGE_EYE_STATUS';

export const updateUpdateTime = (updateTime: string) => {
  return {
    type: UPDATE_UPTATETIME,
    payload: updateTime
  };
};

export const changeEyeStatus = (status: EyeStatus) => {
  Utils.SetStorage(CONST_STORAGE.EYE_STATUS, status);
  return {
    type: CHANGE_EYE_STATUS,
    payload: status
  };
};

export const toggleEyeStatus = () => {
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
};
