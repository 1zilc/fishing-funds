import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Utils from '@/utils';

export interface CoinState {
  coins: (Coin.ResponseItem & Coin.ExtraRow)[];
  coinsLoading: boolean;
  config: {
    coinConfig: Coin.SettingItem[];
    codeMap: Coin.CodeMap;
  };
  remoteCoins: Coin.RemoteCoin[];
  remoteCoinsMap: Record<string, Coin.RemoteCoin>;
  remoteCoinsLoading: boolean;
}

const initialState = {
  coins: [],
  coinsLoading: false,
  config: { coinConfig: [], codeMap: {} },
  remoteCoins: [],
  remoteCoinsMap: {},
  remoteCoinsLoading: false,
} as CoinState;

const coinSlice = createSlice({
  name: 'coin',
  initialState,
  reducers: {
    setCoinsLoading(state, action: PayloadAction<boolean>) {
      state.coinsLoading = action.payload;
    },
    syncCoins(state, action) {
      state.coins = action.payload;
    },
    syncCoinsConfig(state, action) {
      state.config = action.payload;
    },
    setRemoteCoins(state, { payload }: PayloadAction<Coin.RemoteCoin[]>) {
      state.remoteCoins = payload;
      state.remoteCoinsMap = Utils.GetCodeMap(payload, 'code');
    },
    setRemoteCoinsLoading(state, action: PayloadAction<boolean>) {
      state.remoteCoinsLoading = action.payload;
    },
    toggleCoinCollapseAction(state, { payload }: PayloadAction<Coin.ResponseItem & Coin.ExtraRow>) {
      const { coins } = state;
      coins.forEach((item) => {
        if (item.code === payload.code) {
          item.collapse = !payload.collapse;
        }
      });
    },
    toggleAllCoinsCollapseAction(state) {
      const { coins } = state;
      const expandAll = coins.every((item) => item.collapse);
      coins.forEach((item) => {
        item.collapse = !expandAll;
      });
    },
  },
});

export const {
  setCoinsLoading,
  syncCoins,
  syncCoinsConfig,
  setRemoteCoins,
  setRemoteCoinsLoading,
  toggleCoinCollapseAction,
  toggleAllCoinsCollapseAction,
} = coinSlice.actions;

export default coinSlice.reducer;
