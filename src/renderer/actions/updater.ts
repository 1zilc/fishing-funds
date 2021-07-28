import { AnyAction } from 'redux';

export const UPDATE_AVALIABLE = 'UPDATE_AVALIABLE';

export function updateAvaliableAction(updateInfo: any): AnyAction {
  return {
    type: UPDATE_AVALIABLE,
    payload: updateInfo,
  };
}
