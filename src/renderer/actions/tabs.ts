import { AnyAction } from 'redux';
import * as Enums from '@/utils/enums';

export const SET_TAB_ACTIVE_KEY = 'SET_TAB_ACTIVE_KEY';

export function setTabActiveKeyAction(key: Enums.TabKeyType): AnyAction {
  return {
    type: SET_TAB_ACTIVE_KEY,
    payload: key,
  };
}
