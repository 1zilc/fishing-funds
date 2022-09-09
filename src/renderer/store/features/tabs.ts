import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Enums from '@/utils/enums';

export interface TabsState {
  activeKey: Enums.TabKeyType;
  tabsKeyMap: Record<Enums.TabKeyType, number>;
}

const initialState: TabsState = {
  activeKey: Enums.TabKeyType.Fund,
  tabsKeyMap: {
    [Enums.TabKeyType.Fund]: 0,
    [Enums.TabKeyType.Zindex]: 0,
    [Enums.TabKeyType.Quotation]: 0,
    [Enums.TabKeyType.Stock]: -1,
    [Enums.TabKeyType.Coin]: 0,
  },
};

const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    syncTabsActiveKeyAction(state, { payload }: PayloadAction<Enums.TabKeyType>) {
      state.activeKey = payload;
    },
    syncTabsKeyMapAction(state, { payload }: PayloadAction<{ key: Enums.TabKeyType; activeKey: number }>) {
      state.tabsKeyMap[payload.key] = payload.activeKey;
    },
  },
});

export const { syncTabsActiveKeyAction, syncTabsKeyMapAction } = tabsSlice.actions;

export default tabsSlice.reducer;
