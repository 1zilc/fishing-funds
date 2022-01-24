import { SET_REMOTE_FUNDS_LOADING, SET_REMOTE_FUNDS, SET_FUNDS_LOADING, SET_FUND_RATING_MAP } from '@/actions/fund';
import { Reducer } from '@/reducers/types';
import * as Helpers from '@/helpers';

export interface FundState {
  fundsLoading: boolean;
  remoteFunds: Fund.RemoteFund[];
  remoteFundsLoading: boolean;
  fundRatingMap: Record<string, Fund.RantingItem>;
}

const fund: Reducer<FundState> = (
  state = {
    fundsLoading: false,
    remoteFunds: [],
    remoteFundsLoading: false,
    fundRatingMap: {},
  },
  action
) => {
  switch (action.type) {
    case SET_REMOTE_FUNDS:
      return {
        ...state,
        remoteFunds: action.payload,
      };
    case SET_FUNDS_LOADING:
      return {
        ...state,
        fundsLoading: action.payload,
      };
    case SET_REMOTE_FUNDS_LOADING:
      return {
        ...state,
        remoteFundsLoading: action.payload,
      };
    case SET_FUND_RATING_MAP:
      return {
        ...state,
        fundRatingMap: action.payload,
      };
    default:
      return state;
  }
};
export default fund;
