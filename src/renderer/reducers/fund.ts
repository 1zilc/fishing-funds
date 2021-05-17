import { AnyAction } from 'redux';

import {
  SORT_FUNDS,
  TOGGLE_FUND_COLLAPSE,
  TOGGLE_FUNDS_COLLAPSE,
  SORT_FUNDS_WITH_CHACHED,
  SET_REMOTE_FUNDS,
  SET_FUNDS_LOADING,
  SET_REMOTE_FUNDS_LOADING,
  SET_FIX_FUND,
  getFundConfig,
  calcFund,
  mergeFixFunds,
} from '@/actions/fund';
import { getSortMode } from '@/actions/sort';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';

export interface FundState {
  funds: (Fund.ResponseItem & Fund.ExtraRow & Fund.FixData)[];
  fundsLoading: boolean;
  remoteFunds: Fund.RemoteFund[];
  remoteFundsLoading: boolean;
}

function setRemoteFunds(state: FundState, remoteFunds: Fund.RemoteFund[]) {
  return {
    ...state,
    remoteFunds,
  };
}

function sortFunds(
  state: FundState,
  responseFunds?: Fund.ResponseItem[]
): FundState {
  const { funds } = state;
  const {
    fundSortMode: { type: fundSortType, order: fundSortorder },
  } = getSortMode();
  const { codeMap } = getFundConfig();
  const sortList = Utils.DeepCopy(responseFunds || funds);

  sortList.sort((a, b) => {
    const _a = calcFund(a);
    const _b = calcFund(b);
    const t = fundSortorder === Enums.SortOrderType.Asc ? 1 : -1;
    switch (fundSortType) {
      case Enums.FundSortType.Growth:
        return (Number(_a.gszzl) - Number(_b.gszzl)) * t;
      case Enums.FundSortType.Block:
        return (Number(_a.cyfe) - Number(_b.cyfe)) * t;
      case Enums.FundSortType.Money:
        return (Number(_a.jrsygz) - Number(_b.jrsygz)) * t;
      case Enums.FundSortType.Estimate:
        return (Number(_a.gszz) - Number(_b.gszz)) * t;
      case Enums.FundSortType.Custom:
      default:
        return (
          (codeMap[b.fundcode!]?.originSort -
            codeMap[a.fundcode!]?.originSort) *
          t
        );
    }
  });

  return {
    ...state,
    funds: sortList,
  };
}

function setFundsLoading(state: FundState, loading: boolean): FundState {
  return {
    ...state,
    fundsLoading: loading,
  };
}

function setremoteFundsLoading(state: FundState, loading: boolean): FundState {
  return {
    ...state,
    remoteFundsLoading: loading,
  };
}

function sortFundsWithChached(
  state: FundState,
  responseFunds: Fund.ResponseItem[]
) {
  const { funds } = state;
  const { fundConfig } = getFundConfig();
  const fundsCodeToMap = funds.reduce((map, fund) => {
    map[fund.fundcode!] = fund;
    return map;
  }, {} as any);

  const fundsWithChached = responseFunds
    .filter((_) => !!_)
    .map((_) => ({
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

  return sortFunds(state, fundsWithChached);
}

function toggleFundCollapse(
  state: FundState,
  fund: Fund.ResponseItem & Fund.ExtraRow
) {
  const { funds } = state;
  const cloneFunds = Utils.DeepCopy(funds);
  cloneFunds.forEach((_) => {
    if (_.fundcode === fund.fundcode) {
      _.collapse = !fund.collapse;
    }
  });
  return {
    ...state,
    funds: cloneFunds,
  };
}

function toggleFundsCollapse(state: FundState) {
  const { funds } = state;
  const cloneFunds = Utils.DeepCopy(funds);
  const expandAllFunds = funds.every((_) => _.collapse);
  cloneFunds.forEach((_) => {
    _.collapse = !expandAllFunds;
  });
  return {
    ...state,
    funds: cloneFunds,
  };
}

function setFixfunds(state: FundState, fixFunds: Fund.FixData[]) {
  const { funds } = state;
  const cloneFunds = mergeFixFunds(funds, fixFunds);
  return sortFunds(state, cloneFunds);
}

export default function fund(
  state: FundState = {
    funds: [],
    fundsLoading: false,
    remoteFunds: [],
    remoteFundsLoading: false,
  },
  action: AnyAction
): FundState {
  switch (action.type) {
    case SET_REMOTE_FUNDS:
      return setRemoteFunds(state, action.payload);
    case SORT_FUNDS:
      return sortFunds(state, action.payload);
    case SET_FUNDS_LOADING:
      return setFundsLoading(state, action.payload);
    case SET_REMOTE_FUNDS_LOADING:
      return setremoteFundsLoading(state, action.payload);
    case SORT_FUNDS_WITH_CHACHED:
      return sortFundsWithChached(state, action.payload);
    case TOGGLE_FUND_COLLAPSE:
      return toggleFundCollapse(state, action.payload);
    case TOGGLE_FUNDS_COLLAPSE:
      return toggleFundsCollapse(state);
    case SET_FIX_FUND:
      return setFixfunds(state, action.payload);
    default:
      return state;
  }
}
