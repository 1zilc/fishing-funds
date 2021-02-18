import * as Enums from '@/utils/enums';

export const SET_TAB_ACTIVE_KEY = 'SET_TAB_ACTIVE_KEY';

export function setTabActiveKey(key: Enums.TabKeyType) {
  return {
    type: SET_TAB_ACTIVE_KEY,
    payload: key,
  };
}
