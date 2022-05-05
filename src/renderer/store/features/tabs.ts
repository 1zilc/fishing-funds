import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Enums from '@/utils/enums';

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
    setTabsActiveKeyAction(state, action) {
      state.activeKey = action.payload;
    },
    setTabsKeyMapAction(state, { payload }: PayloadAction<{ key: Enums.TabKeyType; activeKey: number }>) {
      state.tabsKeyMap[payload.key] = payload.activeKey;
    },
  },
});

export const { setTabsActiveKeyAction, setTabsKeyMapAction } = tabsSlice.actions;

export default tabsSlice.reducer;
