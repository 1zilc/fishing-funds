import { AnyAction } from 'redux';

import { ThunkAction } from '@/reducers/types';
import * as Enums from '@/utils/enums';

export const SET_TAB_ACTIVE_KEY = 'SET_TAB_ACTIVE_KEY';
export const SET_TABS_KEY_MAP = 'SET_TABS_KEY_MAP';

export function setTabActiveKeyAction(key: Enums.TabKeyType): AnyAction {
  return {
    type: SET_TAB_ACTIVE_KEY,
    payload: key,
  };
}
export function setTabskeyMapAction(key: Enums.TabKeyType, activeKey: number): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        tabs: { tabsKeyMap },
      } = getState();
      dispatch({ type: SET_TABS_KEY_MAP, payload: { ...tabsKeyMap, [key]: activeKey } });
    } catch (error) {
      console.log('修改tabsKeyMap出错', error);
    }
  };
}
