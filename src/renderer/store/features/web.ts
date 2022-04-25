import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WebState {
  view: {
    show: boolean;
    phone?: boolean;
    title: string;
    url: string;
  };
  config: { webConfig: Web.SettingItem[]; codeMap: Web.CodeMap };
}

const initialState = {
  view: {
    show: false,
    phone: true,
    title: '',
    url: '',
  },
  config: { webConfig: [], codeMap: {} },
} as WebState;

const webSlice = createSlice({
  name: 'web',
  initialState,
  reducers: {
    setWebUrl(state, action: PayloadAction<string>) {
      state.view.url = action.payload;
    },
    setWebPhone(state, action: PayloadAction<boolean>) {
      state.view.phone = action.payload;
    },
    setWeb(state, action) {
      state.view = action.payload;
    },
    syncWebConfig(state, action) {
      state.config = action.payload;
    },
  },
});

export const { setWebUrl, setWebPhone, setWeb, syncWebConfig } = webSlice.actions;

export default webSlice.reducer;
