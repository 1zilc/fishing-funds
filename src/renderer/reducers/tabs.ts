import { Reducer } from '@/reducers/types';
import { SET_TAB_ACTIVE_KEY } from '@/actions/tabs';
import * as Enums from '@/utils/enums';

export interface TabsState {
  activeKey: Enums.TabKeyType;
}

const tabs: Reducer<TabsState> = (
  state = {
    activeKey: Enums.TabKeyType.Funds,
  },
  action
) => {
  switch (action.type) {
    case SET_TAB_ACTIVE_KEY:
      return {
        ...state,
        activeKey: action.payload,
      };
    default:
      return state;
  }
};

export default tabs;
