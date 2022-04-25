import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ZindexState {
  zindexs: (Zindex.ResponseItem & Zindex.ExtraRow)[];
  zindexsLoading: boolean;
  config: { zindexConfig: Zindex.SettingItem[]; codeMap: Zindex.CodeMap };
}

const initialState = {
  zindexs: [],
  zindexsLoading: false,
  config: {
    zindexConfig: [],
    codeMap: {},
  },
} as ZindexState;

const zindexSlice = createSlice({
  name: 'zindex',
  initialState,
  reducers: {
    setZindexesLoading(state, action: PayloadAction<boolean>) {
      state.zindexsLoading = action.payload;
    },
    syncZindexes(state, action) {
      state.zindexs = action.payload;
    },
    syncZindexesConfig(state, action) {
      state.config = action.payload;
    },
  },
});

export const { setZindexesLoading, syncZindexes, syncZindexesConfig } = zindexSlice.actions;

export default zindexSlice.reducer;
