import { AnyAction } from 'redux';

import {
  SORT_FUNDS,
  TOGGLE_FUND_COLLAPSE,
  TOGGLE_FUNDS_COLLAPSE,
  SORT_FUNDS_WITH_COLLAPSE_CHACHED,
  SET_REMOTE_FUNDS,
  getFundConfig,
  calcFund,
} from '@/actions/fund';
import { getSortMode } from '@/actions/sort';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';

export interface FundState {
  funds: (Fund.ResponseItem & Fund.ExtraRow)[];
  remoteFunds: Fund.RemoteFund[];
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
  const sortList: Fund.ResponseItem[] = Utils.DeepCopy(responseFunds || funds);

  sortList.sort((a, b) => {
    const _a = calcFund(a);
    const _b = calcFund(b);
    const t = fundSortorder === Enums.SortOrderType.Asc ? 1 : -1;
    switch (fundSortType) {
      case Enums.FundSortType.Growth:
        return Number(_a.gszzl) > Number(_b.gszzl) ? 1 * t : -1 * t;
      case Enums.FundSortType.Block:
        return Number(_a.cyfe) > Number(_b.cyfe) ? 1 * t : -1 * t;
      case Enums.FundSortType.Money:
        return Number(_a.jrsygz) > Number(_b.jrsygz) ? 1 * t : -1 * t;
      case Enums.FundSortType.Estimate:
        return Number(_a.gszz) > Number(_b.gszz) ? 1 * t : -1 * t;
      case Enums.FundSortType.Default:
      default:
        return codeMap[a.fundcode]?.originSort > codeMap[b.fundcode]?.originSort
          ? -1 * t
          : 1 * t;
    }
  });

  return {
    ...state,
    funds: sortList,
  };
}

function sortFundsWithCollapseChached(
  state: FundState,
  responseFunds: Fund.ResponseItem[]
): FundState {
  const { funds } = state;
  const fundsCodeToMap = funds.reduce((map, fund) => {
    map[fund.fundcode] = fund;
    return map;
  }, {} as any);

  const fundsWithCollapseChached = responseFunds
    .filter((_) => !!_)
    .map((_) => ({
      ..._,
      collapse: fundsCodeToMap[_?.fundcode]?.collapse,
    }));

  return sortFunds(state, fundsWithCollapseChached);
}

function toggleFundCollapse(
  state: FundState,
  fund: Fund.ResponseItem & Fund.ExtraRow
): FundState {
  const { funds } = state;
  const cloneFunds: (Fund.ResponseItem & Fund.ExtraRow)[] = Utils.DeepCopy(
    funds
  );
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

function toggleFundsCollapse(state: FundState): FundState {
  const { funds } = state;
  const cloneFunds: (Fund.ResponseItem & Fund.ExtraRow)[] = Utils.DeepCopy(
    funds
  );
  const expandAllFunds = funds.every((_) => _.collapse);
  cloneFunds.forEach((_) => {
    _.collapse = !expandAllFunds;
  });
  return {
    ...state,
    funds: cloneFunds,
  };
}

export default function fund(
  state = {
    funds: [],
    remoteFunds: [],
  },
  action: AnyAction
) {
  switch (action.type) {
    case SET_REMOTE_FUNDS:
      return setRemoteFunds(state, action.payload);
    case SORT_FUNDS:
      return sortFunds(state, action.payload);
    case SORT_FUNDS_WITH_COLLAPSE_CHACHED:
      return sortFundsWithCollapseChached(state, action.payload);
    case TOGGLE_FUND_COLLAPSE:
      return toggleFundCollapse(state, action.payload);
    case TOGGLE_FUNDS_COLLAPSE:
      return toggleFundsCollapse(state);
    default:
      return state;
  }
}
