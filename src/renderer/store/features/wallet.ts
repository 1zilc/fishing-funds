import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { batch } from 'react-redux';

import { TypedThunk } from '@/store';
import { sortFundsAction } from '@/store/features/fund';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';
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
    changeEyeStatus(state, action: PayloadAction<Enums.EyeStatus>) {
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
  changeEyeStatus,
  changeCurrentWalletCodeAction,
  syncWalletsAction,
  syncWalletsConfigAction,
  toggleFundCollapseAction,
  toggleAllFundsCollapseAction,
} = walletSlice.actions;

export function changeEyeStatusAction(status: Enums.EyeStatus): TypedThunk {
  return (dispatch, getState) => {
    try {
      dispatch(changeEyeStatus(status));
      Utils.SetStorage(CONST.STORAGE.EYE_STATUS, status);
    } catch (error) {}
  };
}

export function toggleEyeStatusAction(): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        wallet: { eyeStatus },
      } = getState();

      switch (eyeStatus) {
        case Enums.EyeStatus.Open:
          dispatch(changeEyeStatusAction(Enums.EyeStatus.Close));
          break;
        case Enums.EyeStatus.Close:
        default:
          dispatch(changeEyeStatusAction(Enums.EyeStatus.Open));
          break;
      }
    } catch (error) {}
  };
}

export function setWalletConfigAction(walletConfig: Wallet.SettingItem[]): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        wallet: { wallets },
      } = getState();
      const codeMap = Utils.GetCodeMap(walletConfig, 'code');

      batch(() => {
        dispatch(syncWalletsConfigAction({ walletConfig, codeMap }));
        dispatch(syncWalletStateAction(wallets));
      });
      Utils.SetStorage(CONST.STORAGE.WALLET_SETTING, walletConfig);
    } catch (error) {}
  };
}

export function syncWalletStateAction(wallets: Wallet.StateItem[]): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        wallet: {
          config: { codeMap },
        },
      } = getState();
      const newWallets = wallets.filter((stateItem) => codeMap[stateItem.code]);
      dispatch(syncWalletsAction(newWallets));
    } catch (error) {}
  };
}

export function addWalletConfigAction(wallet: Wallet.SettingItem): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        wallet: {
          config: { walletConfig },
        },
      } = getState();
      dispatch(setWalletConfigAction(walletConfig.concat(wallet)));
    } catch (error) {}
  };
}

export function updateWalletConfigAction(wallet: Wallet.SettingItem): TypedThunk {
  return (dispatch, getState) => {
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
  };
}

export function deleteWalletConfigAction(code: string): TypedThunk {
  return (dispatch, getState) => {
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
  };
}

export function selectWalletAction(code: string): TypedThunk {
  return (dispatch, getState) => {
    try {
      dispatch(changeCurrentWalletCodeAction(code));
      Utils.SetStorage(CONST.STORAGE.CURRENT_WALLET_CODE, code);
    } catch (error) {}
  };
}

export function updateWalletStateAction(state: Wallet.StateItem): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        wallet: {
          wallets,
          config: { codeMap, walletConfig },
        },
      } = getState();
      const cloneState = Utils.DeepCopy(state);
      const cloneWallets = Utils.DeepCopy(wallets);
      const currentWalletConfig = codeMap[cloneState.code];
      const { codeMap: configCodeMap } = Helpers.Fund.GetFundConfig(cloneState.code, walletConfig);
      const walletState = Helpers.Wallet.GetCurrentWalletState(cloneState.code, cloneWallets);
      const fundsStateCodeToMap = Utils.GetCodeMap(walletState.funds, 'fundcode');
      const walletsStateCodeToMap = Utils.GetCodeMap(cloneWallets, 'code');

      cloneState.funds = cloneState.funds.map((_) => ({
        ...(fundsStateCodeToMap[_.fundcode!] || {}),
        ..._,
      }));
      const itemFundsCodeToMap = Utils.GetCodeMap(cloneState.funds, 'fundcode');

      currentWalletConfig.funds.forEach((fund) => {
        const responseFund = itemFundsCodeToMap[fund.code];
        const stateFund = fundsStateCodeToMap[fund.code];
        if (!responseFund && stateFund) {
          cloneState.funds.push(stateFund);
        }
      });

      cloneState.funds = cloneState.funds.filter(({ fundcode }) => configCodeMap[fundcode!]);

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
  };
}

export function setWalletStateAction(state: Wallet.StateItem): TypedThunk {
  return (dispatch, getState) => {
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
  };
}

export function syncFixWalletStateAction(state: Wallet.StateItem): TypedThunk {
  return (dispatch, getState) => {
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
  };
}

export default walletSlice.reducer;
