export const CHANGE_DELETE_STATUS = 'CHANGE_DELETE_STATUS';
export const TOGGLE_DELETE_STATUS = 'TOGGLE_DELETE_STATUS';

export function toggleToolbarDeleteStatus() {
  return {
    type: TOGGLE_DELETE_STATUS,
  };
}

export function changeToolbarDeleteStatus(status: boolean) {
  return {
    type: CHANGE_DELETE_STATUS,
    payload: status,
  };
}
