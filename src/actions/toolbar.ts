export const CHANGE_DELETE_STATUS = 'CHANGE_DELETE_STATUS';
export const TOGGLE_DELETE_STATUS = 'TOGGLE_DELETE_STATUS';

export const toggleToolbarDeleteStatus = () => {
  return {
    type: TOGGLE_DELETE_STATUS,
  };
};

export const changeToolbarDeleteStatus = (status: boolean) => {
  return {
    type: CHANGE_DELETE_STATUS,
    payload: status,
  };
};
