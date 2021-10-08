import { Reducer } from '@/reducers/types';
import { SET_TAB_ACTIVE_KEY, SET_TABS_KEY_MAP } from '@/actions/tabs';
import * as Enums from '@/utils/enums';

export interface TabsState {
  activeKey: Enums.TabKeyType;
  tabsKeyMap: Record<Enums.TabKeyType, number>;
}

const tabs: Reducer<TabsState> = (
  state = {
    activeKey: Enums.TabKeyType.Funds,
    tabsKeyMap: {
      [Enums.TabKeyType.Funds]: 0,
      [Enums.TabKeyType.Zindex]: 0,
      [Enums.TabKeyType.Quotation]: 0,
      [Enums.TabKeyType.Stock]: 0,
      [Enums.TabKeyType.Coin]: 0,
    },
  },
  action
) => {
  switch (action.type) {
    case SET_TAB_ACTIVE_KEY:
      return {
        ...state,
        activeKey: action.payload,
      };
    case SET_TABS_KEY_MAP:
      return {
        ...state,
        tabsKeyMap: action.payload,
      };
    default:
      return state;
  }
};

export default tabs;
