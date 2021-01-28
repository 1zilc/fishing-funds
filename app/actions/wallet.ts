import { GetState, Dispatch } from '../reducers/types';

export const UPDATE_UPTATETIME = 'UPDATE_UPTATETIME';

export const updateUpdateTime = (updateTime: string) => {
  return {
    type: UPDATE_UPTATETIME,
    payload: updateTime
  };
};

export const toggleEyeStatus = (status: boolean) => {};
