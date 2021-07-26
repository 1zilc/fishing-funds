import { AnyAction } from 'redux';
import { batch } from 'react-redux';
import dayjs from 'dayjs';

import { Dispatch, GetState, ThunkAction, PromiseAction } from '@/reducers/types';
import { syncFixWalletStateAction, setWalletConfigAction, syncWalletStateAction } from '@/actions/wallet';
import * as Services from '@/services';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';

export const SET_REMOTE_FUNDS = 'SET_REMOTE_FUNDS';
export const SET_REMOTE_FUNDS_LOADING = 'SET_REMOTE_FUNDS_LOADING';
export const SET_FUNDS = 'SET_FUNDS';
export const SET_FUNDS_LOADING = 'SET_FUNDS_LOADING';

export function setFundConfigAction(config: Fund.SettingItem[]): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        wallet: {
          currentWalletCode,
          config: { walletConfig },
        },
      } = getState();

      const newWalletConfig = walletConfig.map((item) => ({
        ...item,
        funds: currentWalletCode === item.code ? config : item.funds,
      }));

      dispatch(setWalletConfigAction(newWalletConfig));
    } catch (error) {
      console.log('设置基金配置出错', error);
    }
  };
}

export function setRemoteFundsAction(remoteFunds: Fund.RemoteFund[]): AnyAction {
  const remoteMap = Utils.GetStorage(CONST.STORAGE.REMOTE_FUND_MAP, {});
  const newRemoteMap = remoteFunds.reduce((r, c) => {
    r[c[0]] = c;
    return r;
  }, {} as Record<string, Fund.RemoteFund>);

  Utils.SetStorage(CONST.STORAGE.REMOTE_FUND_MAP, {
    ...remoteMap,
    ...newRemoteMap,
  });

  return { type: SET_REMOTE_FUNDS, payload: remoteFunds };
}

export function addFundAction(fund: Fund.SettingItem): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        fund: {
          config: { fundConfig },
        },
      } = getState();
      const cloneFundConfig = Utils.DeepCopy(fundConfig);
      const exist = cloneFundConfig.find((item) => fund.code === item.code);
      if (!exist) {
        cloneFundConfig.push(fund);
      }
      dispatch(setFundConfigAction(cloneFundConfig));
    } catch (error) {
      console.log('添加基金出错', error);
    }
  };
}

export function updateFundAction(fund: { code: string; cyfe?: number; name?: string; cbj?: number | null }): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        fund: {
          config: { fundConfig },
        },
      } = getState();

      const cloneFundConfig = Utils.DeepCopy(fundConfig);
      cloneFundConfig.forEach((item) => {
        if (fund.code === item.code) {
          if (fund.cyfe !== undefined) {
            item.cyfe = fund.cyfe;
          }
          if (fund.cbj !== null) {
            item.cbj = fund.cbj;
          }
          if (fund.name !== undefined) {
            item.name = fund.name;
          }
        }
      });

      dispatch(setFundConfigAction(cloneFundConfig));
    } catch (error) {
      console.log('更新基金出错', error);
    }
  };
}

export function deleteFundAction(code: string): ThunkAction {
  return (dispatch, getState) => {
    try {
      const { funds } = Helpers.Wallet.GetCurrentWallet();
      funds.forEach((item, index) => {
        if (code === item.code) {
          const cloneFundConfig = Utils.DeepCopy(funds);
          cloneFundConfig.splice(index, 1);
          dispatch(setFundConfigAction(cloneFundConfig));
        }
      });
    } catch (error) {
      console.log('删除基金出错', error);
    }
  };
}

export function loadRemoteFundsAction(): ThunkAction {
  return async (dispatch: Dispatch, getState: GetState) => {
    try {
      dispatch({ type: SET_REMOTE_FUNDS_LOADING, payload: true });
      const remoteFunds = await Services.Fund.GetRemoteFundsFromEastmoney();
      batch(() => {
        dispatch(setRemoteFundsAction(remoteFunds));
        dispatch({ type: SET_REMOTE_FUNDS_LOADING, payload: false });
      });
    } catch {
      console.log('加载远程基金库出错');
      dispatch({ type: SET_REMOTE_FUNDS_LOADING, payload: false });
    }
  };
}

export function loadFundsAction(): ThunkAction {
  return async (dispatch: Dispatch, getState: GetState) => {
    try {
      dispatch({ type: SET_FUNDS_LOADING, payload: true });
      const responseFunds = (await Helpers.Fund.GetFunds()).filter(Utils.NotEmpty);

      batch(() => {
        dispatch({ type: SET_FUNDS_LOADING, payload: false });
        dispatch(sortFundsCachedAction(responseFunds));
      });
    } catch {
      console.log('加载基金出错');
      dispatch({ type: SET_FUNDS_LOADING, payload: false });
    }
  };
}

export function loadFundsWithoutLoadingAction(): PromiseAction {
  return async (dispatch, getState) => {
    try {
      const responseFunds = (await Helpers.Fund.GetFunds()).filter(Utils.NotEmpty);
      dispatch(sortFundsCachedAction(responseFunds));
    } catch (error) {
      console.log('静默加载基金失败', error);
    }
  };
}

export function loadFixFundsAction(): PromiseAction {
  return async (dispatch, getState) => {
    try {
      const { funds, code } = Helpers.Wallet.GetCurrentWalletState();
      const fixFunds = (await Helpers.Fund.GetFixFunds(funds)).filter(Utils.NotEmpty);
      const now = dayjs().format('MM-DD HH:mm:ss');
      dispatch(syncFixWalletStateAction({ code, funds: fixFunds, updateTime: now }));
    } catch (error) {
      console.log('加载最新净值失败', error);
    }
  };
}

export function sortFundsAction(): ThunkAction {
  return (dispatch, getState) => {
    try {
      const { funds, updateTime, code } = Helpers.Wallet.GetCurrentWalletState();
      const sortFunds = Helpers.Fund.SortFunds(funds);
      dispatch(syncWalletStateAction({ code, funds: sortFunds, updateTime }));
    } catch (error) {
      console.log('基金排序错误', error);
    }
  };
}

export function sortFundsCachedAction(responseFunds: Fund.ResponseItem[]): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        fund: {
          config: { fundConfig },
        },
      } = getState();
      const { funds, code } = Helpers.Wallet.GetCurrentWalletState();
      const now = dayjs().format('MM-DD HH:mm:ss');
      const fundsCodeToMap = funds.reduce((map, fund) => {
        map[fund.fundcode!] = fund;
        return map;
      }, {} as any);
      const fundsWithChached = responseFunds.filter(Utils.NotEmpty).map((_) => ({
        ...(fundsCodeToMap[_.fundcode!] || {}),
        ..._,
      }));
      const fundsWithChachedCodeToMap = fundsWithChached.reduce((map, fund) => {
        map[fund.fundcode!] = fund;
        return map;
      }, {} as any);
      fundConfig.forEach((fund) => {
        const responseFund = fundsWithChachedCodeToMap[fund.code];
        const stateFund = fundsCodeToMap[fund.code];
        if (!responseFund && stateFund) {
          fundsWithChached.push(stateFund);
        }
      });
      const sortFunds = Helpers.Fund.SortFunds(fundsWithChached);
      dispatch(syncWalletStateAction({ code, funds: sortFunds, updateTime: now }));
    } catch (error) {
      console.log('基金带缓存排序出错', error);
    }
  };
}

export function toggleFundCollapseAction(fund: Fund.ResponseItem & Fund.ExtraRow): ThunkAction {
  return (dispatch, getState) => {
    try {
      const { funds, updateTime, code } = Helpers.Wallet.GetCurrentWalletState();
      const cloneFunds = Utils.DeepCopy(funds);
      cloneFunds.forEach((_) => {
        if (_.fundcode === fund.fundcode) {
          _.collapse = !fund.collapse;
        }
      });
      dispatch(syncWalletStateAction({ code, funds: cloneFunds, updateTime }));
    } catch (error) {
      console.log('基金展开/折叠出错', error);
    }
  };
}

export function toggleAllFundsCollapseAction(): ThunkAction {
  return (dispatch, getState) => {
    try {
      const { funds, updateTime, code } = Helpers.Wallet.GetCurrentWalletState();
      const cloneFunds = Utils.DeepCopy(funds);
      const expandAllFunds = funds.every((_) => _.collapse);
      cloneFunds.forEach((_) => {
        _.collapse = !expandAllFunds;
      });
      dispatch(syncWalletStateAction({ code, funds: cloneFunds, updateTime }));
    } catch (error) {
      console.log('全部基金展开/折叠出错', error);
    }
  };
}
