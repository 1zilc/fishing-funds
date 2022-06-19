import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TypedThunk } from '@/store';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';
import * as Utils from '@/utils';

export interface TabsState {
  activeKey: Enums.TabKeyType;
  tabsKeyMap: Record<Enums.TabKeyType, number>;
}

const initialState: TabsState = {
  activeKey: Enums.TabKeyType.Funds,
  tabsKeyMap: {
    [Enums.TabKeyType.Funds]: 0,
    [Enums.TabKeyType.Zindex]: 0,
    [Enums.TabKeyType.Quotation]: 0,
    [Enums.TabKeyType.Stock]: 0,
    [Enums.TabKeyType.Coin]: 0,
  },
};

const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    setTabsActiveKeyAction(state, { payload }: PayloadAction<Enums.TabKeyType>) {
      state.activeKey = payload;
    },
    setTabsKeyMapAction(state, { payload }: PayloadAction<{ key: Enums.TabKeyType; activeKey: number }>) {
      state.tabsKeyMap[payload.key] = payload.activeKey;
    },
  },
});

export const { setTabsActiveKeyAction, setTabsKeyMapAction } = tabsSlice.actions;

export function changeTabsActiveKeyAction(key: Enums.TabKeyType): TypedThunk {
  return (dispatch, getState) => {
    try {
      dispatch(setTabsActiveKeyAction(key));
      Utils.SetStorage(CONST.STORAGE.TABS_ACTIVE_KEY, key);
    } catch (error) {}
  };
}

export default tabsSlice.reducer;
