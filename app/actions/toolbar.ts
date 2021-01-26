import { GetState, Dispatch } from '../reducers/types';

export const CHANGE_DELETE_STATUS = 'CHANGE_DELETE_STATUS';

export function toggleToolbarDeleteStatus() {
  return (dispatch: Dispatch, getState: GetState) => {
    const { toolbar } = getState();
    const { deleteStatus } = toolbar;
    dispatch(changeToolbarDeleteStatus(!deleteStatus));
  };
}

export function changeToolbarDeleteStatus(status: boolean) {
  return {
    type: CHANGE_DELETE_STATUS,
    payload: status
  };
}
