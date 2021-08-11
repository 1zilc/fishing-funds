import { batch } from 'react-redux';
import dayjs from 'dayjs';

import { ThunkAction } from '@/reducers/types';
import { setWalletConfigAction, syncWalletStateAction } from '@/actions/wallet';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';

export const SET_REMOTE_FUNDS = 'SET_REMOTE_FUNDS';
export const SET_REMOTE_FUNDS_LOADING = 'SET_REMOTE_FUNDS_LOADING';
export const SET_FUNDS = 'SET_FUNDS';
export const SET_FUNDS_LOADING = 'SET_FUNDS_LOADING';

export function setFundConfigAction(config: Fund.SettingItem[], walletCode: string): ThunkAction {
  return (dispatch, getState) => {
    try {
      const { walletConfig } = Helpers.Wallet.GetWalletConfig();
      const walletState = Helpers.Wallet.GetCurrentWalletState();
      const newWalletConfig = walletConfig.map((item) => ({
        ...item,
        funds: walletCode === item.code ? config : item.funds,
      }));

      batch(() => {
        dispatch(setWalletConfigAction(newWalletConfig));
        dispatch(syncWalletStateAction(walletState));
      });
    } catch (error) {
      console.log('设置基金配置出错', error);
    }
  };
}

export function setRemoteFundsAction(remoteFunds: Fund.RemoteFund[]): ThunkAction {
  return (dispatch, getState) => {
    try {
      const remoteMap = Utils.GetStorage(CONST.STORAGE.REMOTE_FUND_MAP, {});
      const newRemoteMap = remoteFunds.reduce((r, c) => {
        r[c[0]] = c;
        return r;
      }, {} as Record<string, Fund.RemoteFund>);

      Utils.SetStorage(CONST.STORAGE.REMOTE_FUND_MAP, {
        ...remoteMap,
        ...newRemoteMap,
      });
      dispatch(syncRemoteFundsAction());
    } catch (error) {
      console.log('设置基金库出错', error);
    }
  };
}

export function syncRemoteFundsAction(): ThunkAction {
  return (dispatch, getState) => {
    try {
      const remoteFunds = Helpers.Fund.GetRemoteFunds();
      dispatch({ type: SET_REMOTE_FUNDS, payload: remoteFunds });
    } catch (error) {
      console.log('同步基金库出错', error);
    }
  };
}

export function addFundAction(fund: Fund.SettingItem): ThunkAction {
  return (dispatch, getState) => {
    try {
      const currentWalletCode = Helpers.Wallet.GetCurrentWalletCode();
      const { fundConfig } = Helpers.Fund.GetFundConfig(currentWalletCode);
      const cloneFundConfig = Utils.DeepCopy(fundConfig);
      const exist = cloneFundConfig.find((item) => fund.code === item.code);
      if (!exist) {
        cloneFundConfig.push(fund);
      }
      dispatch(setFundConfigAction(cloneFundConfig, currentWalletCode));
    } catch (error) {
      console.log('添加基金出错', error);
    }
  };
}

export function updateFundAction(fund: { code: string; cyfe?: number; name?: string; cbj?: number | null }): ThunkAction {
  return (dispatch, getState) => {
    try {
      const currentWalletCode = Helpers.Wallet.GetCurrentWalletCode();
      const { fundConfig } = Helpers.Fund.GetFundConfig(currentWalletCode);
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

      dispatch(setFundConfigAction(cloneFundConfig, currentWalletCode));
    } catch (error) {
      console.log('更新基金出错', error);
    }
  };
}

export function deleteFundAction(code: string): ThunkAction {
  return (dispatch, getState) => {
    try {
      const currentWalletCode = Helpers.Wallet.GetCurrentWalletCode();
      const { fundConfig } = Helpers.Fund.GetFundConfig(currentWalletCode);
      fundConfig.forEach((item, index) => {
        if (code === item.code) {
          const cloneFundConfig = Utils.DeepCopy(fundConfig);
          cloneFundConfig.splice(index, 1);
          dispatch(setFundConfigAction(cloneFundConfig, currentWalletCode));
        }
      });
    } catch (error) {
      console.log('删除基金出错', error);
    }
  };
}

export function sortFundsAction(): ThunkAction {
  return (dispatch, getState) => {
    try {
      const { funds, updateTime, code } = Helpers.Wallet.GetCurrentWalletState();
      const sortFunds = Helpers.Fund.SortFunds(funds, code);
      dispatch(syncWalletStateAction({ code, funds: sortFunds, updateTime }));
    } catch (error) {
      console.log('基金排序错误', error);
    }
  };
}

export function sortFundsCachedAction(responseFunds: Fund.ResponseItem[], walletCode: string): ThunkAction {
  return (dispatch, getState) => {
    try {
      const { fundConfig } = Helpers.Fund.GetFundConfig(walletCode);
      const { funds, code } = Helpers.Wallet.GetCurrentWalletState();
      const now = dayjs().format('MM-DD HH:mm:ss');
      const fundsCodeToMap = funds.reduce((map, fund) => {
        map[fund.fundcode!] = fund;
        return map;
      }, {} as any);
      const fundsWithChached = responseFunds.map((_) => ({
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
      const sortFunds = Helpers.Fund.SortFunds(fundsWithChached, code);
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
