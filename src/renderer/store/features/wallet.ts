import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Enums from '@/utils/enums';
import * as Helpers from '@/helpers';

export interface WalletState {
  eyeStatus: Enums.EyeStatus;
  currentWalletCode: string;
  wallets: Wallet.StateItem[];
  config: {
    walletConfig: Wallet.SettingItem[];
    codeMap: Helpers.Wallet.CodeWalletMap;
  };
}

const initialState = {
  wallets: [],
  config: { walletConfig: [], codeMap: {} },
  eyeStatus: Enums.EyeStatus.Open,
  currentWalletCode: '',
} as WalletState;

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    changeEyeStatus(state, action: PayloadAction<Enums.EyeStatus>) {
      state.eyeStatus = action.payload;
    },
    changeCurrentWalletCode(state, action: PayloadAction<string>) {
      state.currentWalletCode = action.payload;
    },
    syncWallets(state, action) {
      state.wallets = action.payload;
    },
    syncWalletsConfig(state, action) {
      state.config = action.payload;
    },
  },
});

export const { changeEyeStatus, changeCurrentWalletCode, syncWallets, syncWalletsConfig } = walletSlice.actions;

export default walletSlice.reducer;
