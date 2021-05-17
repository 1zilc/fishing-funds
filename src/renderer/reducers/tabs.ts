import { AnyAction } from 'redux';

import { SET_TAB_ACTIVE_KEY } from '../actions/tabs';
import * as Enums from '../utils/enums';

export interface TabsState {
  activeKey: Enums.TabKeyType;
}

export default function tabs(
  state: TabsState = {
    activeKey: Enums.TabKeyType.Funds,
  },
  action: AnyAction
): TabsState {
  switch (action.type) {
    case SET_TAB_ACTIVE_KEY:
      return {
        ...state,
        activeKey: action.payload,
      };
    default:
      return state;
  }
}
