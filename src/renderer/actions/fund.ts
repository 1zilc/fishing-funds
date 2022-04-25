import { batch } from 'react-redux';
import dayjs from 'dayjs';

import { TypedThunk } from '@/store';
import { setRemoteFunds, setFundRatingMap } from '@/store/features/fund';
import { setWalletConfigAction, updateWalletStateAction, setWalletStateAction } from '@/actions/wallet';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';

export function setFundConfigAction(config: Fund.SettingItem[], walletCode: string): TypedThunk {
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
        dispatch(updateWalletStateAction(walletState));
      });
    } catch (error) {}
  };
}

export function setRemoteFundsAction(newRemoteFunds: Fund.RemoteFund[]): TypedThunk {
  return async (dispatch, getState) => {
    try {
      const {
        fund: { remoteFunds },
      } = getState();
      const oldRemoteMap = remoteFunds.reduce((r, c) => {
        r[c[0]] = c;
        return r;
      }, {} as Record<string, Fund.RemoteFund>);

      const newRemoteMap = newRemoteFunds.reduce((r, c) => {
        r[c[0]] = c;
        return r;
      }, {} as Record<string, Fund.RemoteFund>);

      const remoteMap = { ...oldRemoteMap, ...newRemoteMap };

      await Utils.SetStorage(CONST.STORAGE.REMOTE_FUND_MAP, remoteMap);

      dispatch(setRemoteFunds(Object.values(remoteMap)));
    } catch (error) {}
  };
}

export function setFundRatingMapAction(newFundRantings: Fund.RantingItem[]): TypedThunk {
  return async (dispatch, getState) => {
    try {
      const {
        fund: { fundRatingMap: oldFundRatingMap },
      } = getState();

      const nweFundRantingMap = newFundRantings.reduce((map, rant) => {
        map[rant.code] = rant;
        return map;
      }, {} as Record<string, Fund.RantingItem>);

      const fundRatingMap = { ...oldFundRatingMap, ...nweFundRantingMap };
      await Utils.SetStorage(CONST.STORAGE.FUND_RATING_MAP, fundRatingMap);

      dispatch(setFundRatingMap(fundRatingMap));
    } catch (error) {}
  };
}

export function addFundAction(fund: Fund.SettingItem): TypedThunk {
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
    } catch (error) {}
  };
}

export function updateFundAction(fund: {
  code: string;
  cyfe?: number;
  name?: string;
  cbj?: number;
  zdfRange?: number;
  jzNotice?: number;
  memo?: string;
}): TypedThunk {
  return (dispatch, getState) => {
    try {
      const currentWalletCode = Helpers.Wallet.GetCurrentWalletCode();
      const { fundConfig } = Helpers.Fund.GetFundConfig(currentWalletCode);
      const cloneFundConfig = Utils.DeepCopy(fundConfig);
      cloneFundConfig.forEach((item) => {
        if (fund.code === item.code) {
          Object.keys(fund).forEach((key) => {
            (item[key as keyof Fund.SettingItem] as any) = fund[key as keyof Fund.SettingItem];
          });
        }
      });

      dispatch(setFundConfigAction(cloneFundConfig, currentWalletCode));
    } catch (error) {}
  };
}

export function deleteFundAction(code: string): TypedThunk {
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
    } catch (error) {}
  };
}

export function sortFundsAction(): TypedThunk {
  return (dispatch, getState) => {
    try {
      const { funds, updateTime, code } = Helpers.Wallet.GetCurrentWalletState();
      const sortFunds = Helpers.Fund.SortFunds(funds, code);
      dispatch(setWalletStateAction({ code, funds: sortFunds, updateTime }));
    } catch (error) {}
  };
}

export function sortFundsCachedAction(responseFunds: Fund.ResponseItem[], walletCode: string): TypedThunk {
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
      dispatch(setWalletStateAction({ code, funds: sortFunds, updateTime: now }));
    } catch (error) {}
  };
}

export function toggleFundCollapseAction(fund: Fund.ResponseItem & Fund.ExtraRow): TypedThunk {
  return (dispatch, getState) => {
    try {
      const { funds, updateTime, code } = Helpers.Wallet.GetCurrentWalletState();
      const cloneFunds = Utils.DeepCopy(funds);
      cloneFunds.forEach((_) => {
        if (_.fundcode === fund.fundcode) {
          _.collapse = !fund.collapse;
        }
      });
      dispatch(setWalletStateAction({ code, funds: cloneFunds, updateTime }));
    } catch (error) {}
  };
}

export function toggleAllFundsCollapseAction(): TypedThunk {
  return (dispatch, getState) => {
    try {
      const { funds, updateTime, code } = Helpers.Wallet.GetCurrentWalletState();
      const cloneFunds = Utils.DeepCopy(funds);
      const expandAllFunds = funds.every((_) => _.collapse);
      cloneFunds.forEach((_) => {
        _.collapse = !expandAllFunds;
      });
      dispatch(setWalletStateAction({ code, funds: cloneFunds, updateTime }));
    } catch (error) {}
  };
}
