import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CoinState {
  coins: (Coin.ResponseItem & Coin.ExtraRow)[];
  coinsLoading: boolean;
  config: {
    coinConfig: Coin.SettingItem[];
    codeMap: Coin.CodeMap;
  };
  remoteCoins: Coin.RemoteCoin[];
  remoteCoinsLoading: boolean;
}

const initialState = {
  coins: [],
  coinsLoading: false,
  config: { coinConfig: [], codeMap: {} },
  remoteCoins: [],
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
    setRemoteCoins(state, action) {
      state.remoteCoins = action.payload;
    },
    setRemoteCoinsLoading(state, action: PayloadAction<boolean>) {
      state.remoteCoinsLoading = action.payload;
    },
  },
});

export const { setCoinsLoading, syncCoins, syncCoinsConfig, setRemoteCoins, setRemoteCoinsLoading } = coinSlice.actions;

export default coinSlice.reducer;
