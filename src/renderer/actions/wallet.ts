import dayjs from 'dayjs';
import { batch } from 'react-redux';

import { ThunkAction, PromiseAction } from '@/reducers/types';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';
import * as Utils from '@/utils';
import * as Adapter from '@/utils/adpters';
import * as Services from '@/services';
import * as Helpers from '@/helpers';

export const CHANGE_EYE_STATUS = 'CHANGE_EYE_STATUS';
export const CHANGE_CURRENT_WALLET_CODE = 'CHANGE_CURRENT_WALLET_CODE';
export const SYNC_WALLET_CONFIG = 'SYNC_WALLET_CONFIG';
export const SYNC_WALLETS = 'SYNC_WALLETS';

export function changeEyeStatusAction(status: Enums.EyeStatus): ThunkAction {
  return (dispatch, getState) => {
    try {
      Utils.SetStorage(CONST.STORAGE.EYE_STATUS, status);
      dispatch({ type: CHANGE_EYE_STATUS, payload: status });
    } catch (error) {
      console.log('改变eye状态出错', error);
    }
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
    } catch (error) {
      console.log('开关eye出错', error);
    }
  };
}

export function setWalletConfigAction(config: Wallet.SettingItem[]): ThunkAction {
  return (dispatch, getState) => {
    try {
      Utils.SetStorage(CONST.STORAGE.WALLET_SETTING, config);
      dispatch(syncWalletConfigAction());
    } catch (error) {
      console.log('设置钱包配置出错', error);
    }
  };
}

export function syncWalletConfigAction(): ThunkAction {
  return (dispatch, getState) => {
    try {
      const config = Helpers.Wallet.GetWalletConfig();
      dispatch({ type: SYNC_WALLET_CONFIG, payload: config });
    } catch (error) {
      console.log('同步钱包配置出错', error);
    }
  };
}

export function addWalletAction(wallet: Wallet.SettingItem): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        wallet: {
          config: { walletConfig },
        },
      } = getState();
      Utils.SetStorage(CONST.STORAGE.WALLET_SETTING, [...walletConfig, wallet]);
      dispatch(syncWalletConfigAction());
    } catch (error) {
      console.log('添加钱包出错', error);
    }
  };
}

export function updateWalletAction(wallet: Wallet.SettingItem): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        wallet: {
          config: { walletConfig },
        },
      } = getState();
      walletConfig.forEach((item) => {
        if (wallet.code === item.code) {
          item.name = wallet.name;
          item.iconIndex = wallet.iconIndex;
        }
      });
      Utils.SetStorage(CONST.STORAGE.WALLET_SETTING, walletConfig);
      dispatch(syncWalletConfigAction());
    } catch (error) {
      console.log('更新钱包出错', error);
    }
  };
}

export function deleteWalletAction(code: string): ThunkAction {
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
          Utils.SetStorage(CONST.STORAGE.WALLET_SETTING, cloneWalletSetting);
        }
      });
      dispatch(syncWalletConfigAction());
    } catch (error) {
      console.log('删除钱包出错', error);
    }
  };
}

export function selectWalletAction(code: string): ThunkAction {
  return (dispatch, getState) => {
    try {
      Utils.SetStorage(CONST.STORAGE.CURRENT_WALLET_CODE, code);
      batch(() => {
        dispatch({ type: CHANGE_CURRENT_WALLET_CODE, payload: code });
        dispatch(syncWalletConfigAction());
      });
    } catch (error) {
      console.log('选择钱包出错', error);
    }
  };
}

export function loadWalletsFundsAction(): PromiseAction {
  return async (dispatch, getState) => {
    try {
      const {
        wallet: {
          config: { walletConfig },
        },
      } = getState();
      const collects = walletConfig.map(({ funds: fundsConfig, code: walletCode }) => async () => {
        const responseFunds = (await Helpers.Fund.GetFunds(fundsConfig)).filter(Utils.NotEmpty);
        const sortFunds = Helpers.Fund.SortFunds(responseFunds, walletCode);
        const now = dayjs().format('MM-DD HH:mm:ss');
        dispatch(
          syncWalletStateAction({
            code: walletCode,
            funds: sortFunds,
            updateTime: now,
          })
        );
        return responseFunds;
      });
      await Adapter.ChokeAllAdapter<(Fund.ResponseItem | null)[]>(collects, CONST.DEFAULT.LOAD_WALLET_DELAY);
    } catch (error) {
      console.log('刷新钱包基金出错', error);
    }
  };
}

export function loadFixWalletsFundsAction(): PromiseAction {
  return async (dispatch, getState) => {
    try {
      const {
        wallet: { wallets },
      } = getState();

      const fixCollects = wallets.map((wallet) => {
        const collectors = (wallet.funds || [])
          .filter(({ fixDate, gztime }) => !fixDate || fixDate !== gztime?.slice(5, 10))
          .map(
            ({ fundcode }) =>
              () =>
                Services.Fund.GetFixFromEastMoney(fundcode!)
          );
        return async () => {
          const fixFunds = await Adapter.ConCurrencyAllAdapter<Fund.FixData>(collectors);
          const now = dayjs().format('MM-DD HH:mm:ss');
          dispatch(
            syncFixWalletStateAction({
              code: wallet.code,
              funds: fixFunds.filter(Utils.NotEmpty),
              updateTime: now,
            })
          );
          return fixFunds;
        };
      });

      await Adapter.ChokeAllAdapter<(Fund.FixData | null)[]>(fixCollects, CONST.DEFAULT.LOAD_WALLET_DELAY);
    } catch (error) {
      console.log('刷新钱包基金fix出错', error);
    }
  };
}

export function syncWalletStateAction(state: Wallet.StateItem): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        wallet: {
          wallets,
          config: { codeMap },
        },
      } = getState();
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
    } catch (error) {
      console.log('同步钱包状态出错', error);
    }
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
    } catch (error) {
      console.log('删除钱包状态fix出错', error);
    }
  };
}
