import { batch } from 'react-redux';

import { TypedThunk } from '@/store';
import { changeEyeStatus, changeCurrentWalletCode, syncWallets, syncWalletsConfig } from '@/store/features/wallet';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';

export function changeEyeStatusAction(status: Enums.EyeStatus): TypedThunk {
  return async (dispatch, getState) => {
    try {
      await Utils.SetStorage(CONST.STORAGE.EYE_STATUS, status);
      dispatch(changeEyeStatus(status));
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
  return async (dispatch, getState) => {
    try {
      const {
        wallet: { wallets },
      } = getState();
      const codeMap = Helpers.Wallet.GetCodeMap(walletConfig);
      await Utils.SetStorage(CONST.STORAGE.WALLET_SETTING, walletConfig);
      batch(() => {
        dispatch(syncWalletsConfig({ walletConfig, codeMap }));
        dispatch(syncWalletStateAction(wallets));
      });
    } catch (error) {}
  };
}

export function syncWalletStateAction(wallets: Wallet.StateItem[]): TypedThunk {
  return (dispatch, getState) => {
    try {
      const { codeMap } = Helpers.Wallet.GetWalletConfig();
      const newWallets = wallets.filter((stateItem) => codeMap[stateItem.code]);
      dispatch(syncWallets(newWallets));
    } catch (error) {}
  };
}

export function addWalletConfigAction(wallet: Wallet.SettingItem): TypedThunk {
  return (dispatch, getState) => {
    try {
      const { walletConfig } = Helpers.Wallet.GetWalletConfig();
      dispatch(setWalletConfigAction([...walletConfig, wallet]));
    } catch (error) {}
  };
}

export function updateWalletConfigAction(wallet: Wallet.SettingItem): TypedThunk {
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

export function deleteWalletConfigAction(code: string): TypedThunk {
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

export function selectWalletAction(code: string): TypedThunk {
  return async (dispatch, getState) => {
    try {
      await Utils.SetStorage(CONST.STORAGE.CURRENT_WALLET_CODE, code);
      dispatch(changeCurrentWalletCode(code));
    } catch (error) {}
  };
}

export function updateWalletStateAction(state: Wallet.StateItem): TypedThunk {
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
      state.funds = Helpers.Fund.SortFunds(state.funds, state.code);

      cloneWallets.forEach((wallet, index) => {
        if (wallet.code === state.code) {
          cloneWallets[index] = state;
        }
      });

      if (!walletState) {
        cloneWallets.push(state);
      }

      dispatch(syncWallets(cloneWallets));
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

      dispatch(syncWallets(cloneWallets));
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
      const { funds } = Helpers.Wallet.GetWalletState(state.code);
      const mergefixFunds = Helpers.Fund.MergeFixFunds(funds, state.funds);
      const sortFunds = Helpers.Fund.SortFunds(mergefixFunds, state.code);

      cloneWallets.forEach((wallet, index) => {
        if (wallet.code === state.code) {
          cloneWallets[index].funds = sortFunds;
        }
      });

      dispatch(syncWallets(cloneWallets));
    } catch (error) {}
  };
}
