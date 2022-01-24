import { batch } from 'react-redux';

import { ThunkAction } from '@/reducers/types';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';

export const CHANGE_EYE_STATUS = 'CHANGE_EYE_STATUS';
export const CHANGE_CURRENT_WALLET_CODE = 'CHANGE_CURRENT_WALLET_CODE';
export const SYNC_WALLET_CONFIG = 'SYNC_WALLET_CONFIG';
export const SYNC_WALLETS = 'SYNC_WALLETS';

export function changeEyeStatusAction(status: Enums.EyeStatus): ThunkAction {
  return (dispatch, getState) => {
    try {
      dispatch({ type: CHANGE_EYE_STATUS, payload: status });

      Utils.SetStorage(CONST.STORAGE.EYE_STATUS, status);
    } catch (error) {}
  };
}

export function toggleEyeStatusAction(): ThunkAction {
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

export function setWalletConfigAction(walletConfig: Wallet.SettingItem[]): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        wallet: { wallets },
      } = getState();
      const codeMap = Helpers.Wallet.GetCodeMap(walletConfig);

      batch(() => {
        dispatch({ type: SYNC_WALLET_CONFIG, payload: { walletConfig, codeMap } });
        dispatch(syncWalletStateAction(wallets));
      });

      Utils.SetStorage(CONST.STORAGE.WALLET_SETTING, walletConfig);
    } catch (error) {}
  };
}

export function syncWalletStateAction(wallets: Wallet.StateItem[]): ThunkAction {
  return (dispatch, getState) => {
    try {
      const { codeMap } = Helpers.Wallet.GetWalletConfig();
      const newWallets = wallets.filter((stateItem) => codeMap[stateItem.code]);
      dispatch({ type: SYNC_WALLETS, payload: newWallets });
    } catch (error) {}
  };
}

export function addWalletConfigAction(wallet: Wallet.SettingItem): ThunkAction {
  return (dispatch, getState) => {
    try {
      const { walletConfig } = Helpers.Wallet.GetWalletConfig();
      dispatch(setWalletConfigAction([...walletConfig, wallet]));
    } catch (error) {}
  };
}

export function updateWalletConfigAction(wallet: Wallet.SettingItem): ThunkAction {
  return (dispatch, getState) => {
    try {
      const { walletConfig } = Helpers.Wallet.GetWalletConfig();
      walletConfig.forEach((item) => {
        if (wallet.code === item.code) {
          item.name = wallet.name;
          item.iconIndex = wallet.iconIndex;
        }
      });
      dispatch(setWalletConfigAction(walletConfig));
    } catch (error) {}
  };
}

export function deleteWalletConfigAction(code: string): ThunkAction {
  return (dispatch, getState) => {
    try {
      const { walletConfig } = Helpers.Wallet.GetWalletConfig();
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

export function selectWalletAction(code: string): ThunkAction {
  return (dispatch, getState) => {
    try {
      dispatch({ type: CHANGE_CURRENT_WALLET_CODE, payload: code });

      Utils.SetStorage(CONST.STORAGE.CURRENT_WALLET_CODE, code);
    } catch (error) {}
  };
}

export function updateWalletStateAction(state: Wallet.StateItem): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        wallet: { wallets },
      } = getState();
      const { codeMap } = Helpers.Wallet.GetWalletConfig();
      const cloneWallets = Utils.DeepCopy(wallets);
      const currentWalletConfig = codeMap[state.code];
      const { codeMap: configCodeMap } = Helpers.Fund.GetFundConfig(state.code);
      const walletState = cloneWallets.find(({ code }) => code === state.code);
      const stateCodeToMap = (walletState?.funds || []).reduce((map, fund) => {
        map[fund.fundcode!] = fund;
        return map;
      }, {} as Record<string, Fund.ResponseItem & Fund.FixData>);

      state.funds = state.funds.map((_) => ({
        ...(stateCodeToMap[_.fundcode!] || {}),
        ..._,
      }));

      const itemFundsCodeToMap = state.funds.reduce((map, fund) => {
        map[fund.fundcode!] = fund;
        return map;
      }, {} as Record<string, Fund.ResponseItem & Fund.FixData>);

      currentWalletConfig.funds.forEach((fund) => {
        const responseFund = itemFundsCodeToMap[fund.code];
        const stateFund = stateCodeToMap[fund.code];
        if (!responseFund && stateFund) {
          state.funds.push(stateFund);
        }
      });

      state.funds = state.funds.filter(({ fundcode }) => configCodeMap[fundcode!]);

      cloneWallets.forEach((wallet, index) => {
        if (wallet.code === state.code) {
          cloneWallets[index] = state;
        }
      });

      if (!walletState) {
        cloneWallets.push(state);
      }

      dispatch({ type: SYNC_WALLETS, payload: cloneWallets });
    } catch (error) {}
  };
}

export function syncFixWalletStateAction(state: Wallet.StateItem): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        wallet: { wallets },
      } = getState();
      const cloneWallets = Utils.DeepCopy(wallets);
      const { funds } = Helpers.Wallet.GetWalletState(state.code);
      const mergefixFunds = Helpers.Fund.MergeFixFunds(funds, state.funds);
      const sortFunds = Helpers.Fund.SortFunds(mergefixFunds, state.code);

      cloneWallets.forEach((wallet, index) => {
        if (wallet.code === state.code) {
          cloneWallets[index].funds = sortFunds;
        }
      });

      dispatch({ type: SYNC_WALLETS, payload: cloneWallets });
    } catch (error) {}
  };
}
