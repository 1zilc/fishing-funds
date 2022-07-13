import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { batch } from 'react-redux';

import { AsyncThunkConfig } from '@/store';
import { sortFundsAction } from '@/store/features/fund';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';

export interface WalletState {
  eyeStatus: Enums.EyeStatus;
  currentWalletCode: string;
  currentWallet: Wallet.StateItem;
  wallets: Wallet.StateItem[];
  config: {
    walletConfig: Wallet.SettingItem[];
    codeMap: Wallet.CodeMap;
  };
  fundConfig: Fund.SettingItem[];
  fundConfigCodeMap: Fund.CodeMap;
}

export const defaultWallet: Wallet.SettingItem = {
  name: '默认钱包',
  iconIndex: 0,
  code: '-1',
  funds: [],
};

const initialState: WalletState = {
  wallets: [],
  config: { walletConfig: [], codeMap: {} },
  eyeStatus: Enums.EyeStatus.Open,
  currentWalletCode: '',
  currentWallet: {
    code: '',
    funds: [],
    updateTime: '',
  },
  fundConfig: [],
  fundConfigCodeMap: {},
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    syncEyeStatusAction(state, action: PayloadAction<Enums.EyeStatus>) {
      state.eyeStatus = action.payload;
    },
    changeCurrentWalletCodeAction(state, { payload }: PayloadAction<string>) {
      const wallet = Helpers.Wallet.GetCurrentWalletState(payload, state.wallets);
      const { codeMap, fundConfig } = Helpers.Fund.GetFundConfig(payload, state.config.walletConfig);
      state.currentWalletCode = payload;
      state.fundConfig = fundConfig;
      state.fundConfigCodeMap = codeMap;
      state.currentWallet = wallet;
    },
    syncWalletsAction(state, { payload }: PayloadAction<Wallet.StateItem[]>) {
      const wallet = Helpers.Wallet.GetCurrentWalletState(state.currentWalletCode, payload);
      state.wallets = payload;
      state.currentWallet = wallet;
    },
    syncWalletsConfigAction(state, { payload }: PayloadAction<{ walletConfig: Wallet.SettingItem[]; codeMap: Wallet.CodeMap }>) {
      const { codeMap, fundConfig } = Helpers.Fund.GetFundConfig(state.currentWalletCode, payload.walletConfig);
      state.config = payload;
      state.fundConfig = fundConfig;
      state.fundConfigCodeMap = codeMap;
    },
    toggleFundCollapseAction(state, { payload }: PayloadAction<Fund.ResponseItem & Fund.ExtraRow>) {
      state.currentWallet.funds.forEach((items) => {
        if (items.fundcode === payload.fundcode) {
          items.collapse = !items.collapse;
        }
      });
      state.wallets.forEach((item, index) => {
        if (item.code === state.currentWalletCode) {
          state.wallets[index] = state.currentWallet;
        }
      });
    },
    toggleAllFundsCollapseAction(state) {
      const expandAll = state.currentWallet.funds.every((item) => item.collapse);
      state.currentWallet.funds.forEach((item) => {
        item.collapse = !expandAll;
      });
      state.wallets.forEach((item, index) => {
        if (item.code === state.currentWalletCode) {
          state.wallets[index] = state.currentWallet;
        }
      });
    },
  },
});

export const {
  syncEyeStatusAction,
  changeCurrentWalletCodeAction,
  syncWalletsAction,
  syncWalletsConfigAction,
  toggleFundCollapseAction,
  toggleAllFundsCollapseAction,
} = walletSlice.actions;

export const toggleEyeStatusAction = createAsyncThunk<void, void, AsyncThunkConfig>(
  'wallet/toggleEyeStatusAction',
  async (_, { dispatch, getState }) => {
    try {
      const {
        wallet: { eyeStatus },
      } = getState();

      switch (eyeStatus) {
        case Enums.EyeStatus.Open:
          dispatch(syncEyeStatusAction(Enums.EyeStatus.Close));
          break;
        case Enums.EyeStatus.Close:
        default:
          dispatch(syncEyeStatusAction(Enums.EyeStatus.Open));
          break;
      }
    } catch (error) {}
  }
);

export const setWalletConfigAction = createAsyncThunk<void, Wallet.SettingItem[], AsyncThunkConfig>(
  'wallet/setWalletConfigAction',
  async (walletConfig, { dispatch, getState }) => {
    try {
      const {
        wallet: { wallets },
      } = getState();
      const codeMap = Utils.GetCodeMap(walletConfig, 'code');

      batch(() => {
        dispatch(syncWalletsConfigAction({ walletConfig, codeMap }));
        dispatch(syncWalletStateAction(wallets));
      });
    } catch (error) {}
  }
);

export const syncWalletStateAction = createAsyncThunk<void, Wallet.StateItem[], AsyncThunkConfig>(
  'wallet/syncWalletStateAction',
  async (wallets, { dispatch, getState }) => {
    try {
      const {
        wallet: {
          config: { codeMap },
        },
      } = getState();
      const newWallets = wallets.filter((stateItem) => codeMap[stateItem.code]);
      dispatch(syncWalletsAction(newWallets));
    } catch (error) {}
  }
);

export const addWalletConfigAction = createAsyncThunk<void, Wallet.SettingItem, AsyncThunkConfig>(
  'wallet/addWalletConfigAction',
  async (wallet, { dispatch, getState }) => {
    try {
      const {
        wallet: {
          config: { walletConfig },
        },
      } = getState();
      dispatch(setWalletConfigAction(walletConfig.concat(wallet)));
    } catch (error) {}
  }
);

export const updateWalletConfigAction = createAsyncThunk<void, Wallet.SettingItem, AsyncThunkConfig>(
  'wallet/updateWalletConfigAction',
  async (wallet, { dispatch, getState }) => {
    try {
      const {
        wallet: {
          config: { walletConfig },
        },
      } = getState();
      const cloneWalletConfig = Utils.DeepCopy(walletConfig);
      cloneWalletConfig.forEach((item) => {
        if (wallet.code === item.code) {
          item.name = wallet.name;
          item.iconIndex = wallet.iconIndex;
        }
      });
      dispatch(setWalletConfigAction(cloneWalletConfig));
    } catch (error) {}
  }
);

export const deleteWalletConfigAction = createAsyncThunk<void, string, AsyncThunkConfig>(
  'wallet/deleteWalletConfigAction',
  async (code, { dispatch, getState }) => {
    try {
      const {
        wallet: {
          config: { walletConfig },
        },
      } = getState();
      walletConfig.forEach((item, index) => {
        if (code === item.code) {
          const cloneWalletSetting = Utils.DeepCopy(walletConfig);
          cloneWalletSetting.splice(index, 1);
          dispatch(setWalletConfigAction(cloneWalletSetting));
        }
      });
    } catch (error) {}
  }
);

export const updateWalletStateAction = createAsyncThunk<void, Wallet.StateItem, AsyncThunkConfig>(
  'wallet/updateWalletStateAction',
  async (state, { dispatch, getState }) => {
    try {
      const {
        wallet: {
          wallets,
          config: { walletConfig },
        },
      } = getState();
      const cloneState = Utils.DeepCopy(state);
      const cloneWallets = Utils.DeepCopy(wallets);
      const { fundConfig } = Helpers.Fund.GetFundConfig(cloneState.code, walletConfig);
      const walletState = Helpers.Wallet.GetCurrentWalletState(cloneState.code, cloneWallets);
      const walletsStateCodeToMap = Utils.GetCodeMap(cloneWallets, 'code');

      cloneState.funds = Utils.MergeStateWithResponse(fundConfig, 'code', 'fundcode', walletState.funds, cloneState.funds);

      cloneWallets.forEach((wallet, index) => {
        if (wallet.code === cloneState.code) {
          cloneWallets[index] = cloneState;
        }
      });

      if (!walletsStateCodeToMap[cloneState.code]) {
        cloneWallets.push(cloneState);
      }

      batch(() => {
        dispatch(syncWalletsAction(cloneWallets));
        dispatch(sortFundsAction(cloneState.code));
      });
    } catch (error) {}
  }
);

export const setWalletStateAction = createAsyncThunk<void, Wallet.StateItem, AsyncThunkConfig>(
  'wallet/setWalletStateAction',
  async (state, { dispatch, getState }) => {
    try {
      const {
        wallet: { wallets },
      } = getState();

      const cloneWallets = Utils.DeepCopy(wallets);
      cloneWallets.forEach((wallet) => {
        if (wallet.code === state.code) {
          wallet.funds = state.funds;
          wallet.updateTime = state.updateTime;
        }
      });

      dispatch(syncWalletsAction(cloneWallets));
    } catch (error) {}
  }
);

export const syncFixWalletStateAction = createAsyncThunk<void, Wallet.StateItem, AsyncThunkConfig>(
  'wallet/syncFixWalletStateAction',
  async (state, { dispatch, getState }) => {
    try {
      const {
        wallet: { wallets },
      } = getState();
      const cloneWallets = Utils.DeepCopy(wallets);
      const { funds } = Helpers.Wallet.GetCurrentWalletState(state.code, wallets);
      const mergefixFunds = Helpers.Fund.MergeFixFunds(funds, state.funds);

      cloneWallets.forEach((wallet, index) => {
        if (wallet.code === state.code) {
          cloneWallets[index].funds = mergefixFunds;
        }
      });

      batch(() => {
        dispatch(syncWalletsAction(cloneWallets));
        dispatch(sortFundsAction(state.code));
      });
    } catch (error) {}
  }
);

export default walletSlice.reducer;
