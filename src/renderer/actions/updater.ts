export const UPDATE_AVALIABLE = 'UPDATE_AVALIABLE';

export function updateAvaliable(updateInfo: any) {
  return {
    type: UPDATE_AVALIABLE,
    payload: updateInfo,
  };
}
