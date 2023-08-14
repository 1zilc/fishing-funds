import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@/store';
import { sortFundsAction } from '@/store/features/fund';
import { sortStocksAction } from '@/store/features/stock';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';

export interface WalletState {
  eyeStatus: boolean;
  currentWalletCode: string;
  currentWallet: Wallet.StateItem;
  wallets: Wallet.StateItem[];
  config: {
    walletConfig: Wallet.SettingItem[];
    codeMap: Wallet.CodeMap;
  };

  fundConfig: Fund.SettingItem[];
  fundConfigCodeMap: Fund.CodeMap;
  stockConfig: Stock.SettingItem[];
  stockConfigCodeMap: Stock.CodeMap;
}

export const defaultWallet: Wallet.SettingItem = {
  name: '默认钱包',
  iconIndex: 0,
  code: '-1',
  funds: [],
  stocks: [],
};

const initialState: WalletState = {
  wallets: [],
  config: { walletConfig: [], codeMap: {} },
  eyeStatus: true,
  currentWalletCode: '',
  currentWallet: {
    code: '',
    funds: [],
    stocks: [],
    updateTime: '',
  },
  fundConfig: [],
  fundConfigCodeMap: {},
  stockConfig: [],
  stockConfigCodeMap: {},
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    syncEyeStatusAction(state, action: PayloadAction<boolean>) {
      state.eyeStatus = action.payload;
    },
    toggleEyeStatusAction(state) {
      state.eyeStatus = !state.eyeStatus;
    },
    changeCurrentWalletCodeAction(state, { payload }: PayloadAction<string>) {
      const wallet = Helpers.Wallet.GetCurrentWalletState(payload, state.wallets);
      const { codeMap: fundConfigCodeMap, fundConfig } = Helpers.Fund.GetFundConfig(payload, state.config.walletConfig);
      const { codeMap: stockConfigCodeMap, stockConfig } = Helpers.Stock.GetStockConfig(
        payload,
        state.config.walletConfig
      );

      state.currentWalletCode = payload;
      state.currentWallet = wallet;
      state.fundConfig = fundConfig;
      state.fundConfigCodeMap = fundConfigCodeMap;
      state.stockConfig = stockConfig;
      state.stockConfigCodeMap = stockConfigCodeMap;
    },
    syncWalletsConfigAction(
      state,
      { payload }: PayloadAction<{ walletConfig: Wallet.SettingItem[]; codeMap: Wallet.CodeMap }>
    ) {
      const { codeMap: fundConfigCodeMap, fundConfig } = Helpers.Fund.GetFundConfig(
        state.currentWalletCode,
        payload.walletConfig
      );
      const { codeMap: stockConfigCodeMap, stockConfig } = Helpers.Stock.GetStockConfig(
        state.currentWalletCode,
        payload.walletConfig
      );

      state.config = payload;
      state.fundConfig = fundConfig;
      state.fundConfigCodeMap = fundConfigCodeMap;
      state.stockConfig = stockConfig;
      state.stockConfigCodeMap = stockConfigCodeMap;
    },
    filterWalletStateAction(state) {
      state.wallets = state.wallets.filter((item) => state.config.codeMap[item.code]);
    },
    syncWalletsAction(state, { payload }: PayloadAction<Wallet.StateItem[]>) {
      const wallet = Helpers.Wallet.GetCurrentWalletState(state.currentWalletCode, payload);
      state.wallets = payload;
      state.currentWallet = wallet;
    },
    toggleFundCollapseAction(state, { payload }: PayloadAction<WalletState['currentWallet']['funds'][number]>) {
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
    toggleStockCollapseAction(state, { payload }: PayloadAction<WalletState['currentWallet']['stocks'][number]>) {
      Helpers.Base.Collapse({
        list: state.currentWallet.stocks,
        key: 'secid',
        data: payload,
      });
      Helpers.Base.Replace({
        list: state.wallets,
        key: 'code',
        data: state.currentWalletCode,
        cover: state.currentWallet,
      });
    },
    toggleAllStocksCollapseAction(state) {
      Helpers.Base.CollapseAll({
        list: state.currentWallet.stocks,
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
  toggleEyeStatusAction,
  changeCurrentWalletCodeAction,
  filterWalletStateAction,
  syncWalletsAction,
  syncWalletsConfigAction,
  toggleFundCollapseAction,
  toggleAllFundsCollapseAction,
  toggleStockCollapseAction,
  toggleAllStocksCollapseAction,
} = walletSlice.actions;

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

export const updateWalletStateAction = createAsyncThunk<
  void,
  Partial<Wallet.StateItem> & { code: string; updateTime: string },
  AsyncThunkConfig
>('wallet/updateWalletStateAction', (state, { dispatch, getState }) => {
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
    const { stockConfig } = Helpers.Stock.GetStockConfig(cloneState.code, walletConfig);
    const walletState = Helpers.Wallet.GetCurrentWalletState(cloneState.code, cloneWallets);
    const walletsStateCodeToMap = Utils.GetCodeMap(cloneWallets, 'code');

    if (cloneState.funds) {
      cloneState.funds = Utils.MergeStateWithResponse({
        config: fundConfig,
        configKey: 'code',
        stateKey: 'fundcode',
        state: walletState.funds,
        response: cloneState.funds,
      });
    }

    if (cloneState.stocks) {
      cloneState.stocks = Utils.MergeStateWithResponse({
        config: stockConfig,
        configKey: 'secid',
        stateKey: 'secid',
        state: walletState.stocks,
        response: cloneState.stocks,
      });
    }

    cloneState.funds = cloneState.funds || walletState.funds || [];
    cloneState.stocks = cloneState.stocks || walletState.stocks || [];

    Helpers.Base.Replace({
      list: cloneWallets,
      key: 'code',
      data: cloneState.code,
      cover: cloneState,
    });

    if (!walletsStateCodeToMap[cloneState.code]) {
      cloneWallets.push(cloneState as Wallet.StateItem);
    }

    dispatch(syncWalletsAction(cloneWallets));

    if (state.funds) {
      dispatch(sortFundsAction(cloneState.code));
    }
    if (state.stocks) {
      dispatch(sortStocksAction(cloneState.code));
    }
  } catch (error) {}
});

export const setWalletStateAction = createAsyncThunk<
  void,
  Partial<Wallet.StateItem> & { code: string },
  AsyncThunkConfig
>('wallet/setWalletStateAction', (state, { dispatch, getState }) => {
  try {
    const {
      wallet: { wallets },
    } = getState();

    const currentWallet = Helpers.Wallet.GetCurrentWalletState(state.code, wallets);
    const mergedWallet = Helpers.Base.Merge({ data: Utils.DeepCopy(currentWallet), overide: state });

    const walletState = Helpers.Base.Update({
      list: Utils.DeepCopy(wallets),
      key: 'code',
      data: mergedWallet,
    });

    dispatch(syncWalletsAction(walletState));
  } catch (error) {}
});

export const syncFixWalletStateAction = createAsyncThunk<void, Omit<Wallet.StateItem, 'stocks'>, AsyncThunkConfig>(
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
