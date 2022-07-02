import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TypedThunk, AsyncThunkConfig } from '@/store';
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
