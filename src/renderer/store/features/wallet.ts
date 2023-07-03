import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@/store';
import { sortFundsAction } from '@/store/features/fund';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';
import { helper } from 'echarts';

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
    filterWalletStateAction(state) {
      state.wallets = state.wallets.filter((item) => state.config.codeMap[item.code]);
    },
    syncWalletsAction(state, { payload }: PayloadAction<Wallet.StateItem[]>) {
      const wallet = Helpers.Wallet.GetCurrentWalletState(state.currentWalletCode, payload);
      state.wallets = payload;
      state.currentWallet = wallet;
    },
    syncWalletsConfigAction(
      state,
      { payload }: PayloadAction<{ walletConfig: Wallet.SettingItem[]; codeMap: Wallet.CodeMap }>
    ) {
      const { codeMap, fundConfig } = Helpers.Fund.GetFundConfig(state.currentWalletCode, payload.walletConfig);
      state.config = payload;
      state.fundConfig = fundConfig;
      state.fundConfigCodeMap = codeMap;
    },
    toggleFundCollapseAction(state, { payload }: PayloadAction<Fund.ResponseItem & Fund.ExtraRow>) {
      Helpers.Base.Collapse({
        list: state.currentWallet.funds,
        key: 'fundcode',
        data: payload,
      });
      Helpers.Base.Replace({
        list: state.wallets,
        key: 'code',
        data: state.currentWalletCode,
        cover: state.currentWallet,
      });
    },
    toggleAllFundsCollapseAction(state) {
      Helpers.Base.CollapseAll({
        list: state.currentWallet.funds,
      });
      Helpers.Base.Replace({
        list: state.wallets,
        key: 'code',
        data: state.currentWalletCode,
        cover: state.currentWallet,
      });
    },
  },
});

export const {
  syncEyeStatusAction,
  changeCurrentWalletCodeAction,
  filterWalletStateAction,
  syncWalletsAction,
  syncWalletsConfigAction,
  toggleFundCollapseAction,
  toggleAllFundsCollapseAction,
} = walletSlice.actions;

export const toggleEyeStatusAction = createAsyncThunk<void, void, AsyncThunkConfig>(
  'wallet/toggleEyeStatusAction',
  (_, { dispatch, getState }) => {
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
  (walletConfig, { dispatch, getState }) => {
    try {
      const codeMap = Utils.GetCodeMap(walletConfig, 'code');
      dispatch(syncWalletsConfigAction({ walletConfig, codeMap }));

      dispatch(filterWalletStateAction());
    } catch (error) {}
  }
);

export const addWalletConfigAction = createAsyncThunk<void, Wallet.SettingItem, AsyncThunkConfig>(
  'wallet/addWalletConfigAction',
  (wallet, { dispatch, getState }) => {
    try {
      const {
        wallet: {
          config: { walletConfig },
        },
      } = getState();

      const config = Helpers.Base.Add({
        list: Utils.DeepCopy(walletConfig),
        key: 'code',
        data: wallet,
      });

      dispatch(setWalletConfigAction(config));
    } catch (error) {}
  }
);

export const updateWalletConfigAction = createAsyncThunk<void, Wallet.SettingItem, AsyncThunkConfig>(
  'wallet/updateWalletConfigAction',
  (wallet, { dispatch, getState }) => {
    try {
      const {
        wallet: {
          config: { walletConfig },
        },
      } = getState();

      const config = Helpers.Base.Update({
        list: Utils.DeepCopy(walletConfig),
        key: 'code',
        data: wallet,
      });

      dispatch(setWalletConfigAction(config));
    } catch (error) {}
  }
);

export const deleteWalletConfigAction = createAsyncThunk<void, string, AsyncThunkConfig>(
  'wallet/deleteWalletConfigAction',
  (code, { dispatch, getState }) => {
    try {
      const {
        wallet: {
          config: { walletConfig },
        },
      } = getState();

      const config = Helpers.Base.Delete({
        list: Utils.DeepCopy(walletConfig),
        key: 'code',
        data: code,
      });

      dispatch(setWalletConfigAction(config));
    } catch (error) {}
  }
);

export const updateWalletStateAction = createAsyncThunk<void, Wallet.StateItem, AsyncThunkConfig>(
  'wallet/updateWalletStateAction',
  (state, { dispatch, getState }) => {
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

      cloneState.funds = Utils.MergeStateWithResponse({
        config: fundConfig,
        configKey: 'code',
        stateKey: 'fundcode',
        state: walletState.funds,
        response: cloneState.funds,
      });

      Helpers.Base.Replace({
        list: cloneWallets,
        key: 'code',
        data: cloneState.code,
        cover: cloneState,
      });

      if (!walletsStateCodeToMap[cloneState.code]) {
        cloneWallets.push(cloneState);
      }

      dispatch(syncWalletsAction(cloneWallets));
      dispatch(sortFundsAction(cloneState.code));
    } catch (error) {}
  }
);

export const setWalletStateAction = createAsyncThunk<void, Wallet.StateItem, AsyncThunkConfig>(
  'wallet/setWalletStateAction',
  (state, { dispatch, getState }) => {
    try {
      const {
        wallet: { wallets },
      } = getState();

      const config = Helpers.Base.Update({
        list: Utils.DeepCopy(wallets),
        key: 'code',
        data: state,
      });

      dispatch(syncWalletsAction(config));
    } catch (error) {}
  }
);

export const syncFixWalletStateAction = createAsyncThunk<void, Wallet.StateItem, AsyncThunkConfig>(
  'wallet/syncFixWalletStateAction',
  (state, { dispatch, getState }) => {
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

      dispatch(syncWalletsAction(cloneWallets));
      dispatch(sortFundsAction(state.code));
    } catch (error) {}
  }
);

export default walletSlice.reducer;
