export const UPDATE_AVALIABLE = 'UPDATE_AVALIABLE';

export const updateAvaliable = (updateInfo: any) => {
  return {
    type: UPDATE_AVALIABLE,
    payload: updateInfo,
  };
};
