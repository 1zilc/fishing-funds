import { SET_REMOTE_FUNDS_LOADING, SET_REMOTE_FUNDS, SET_FUNDS_LOADING } from '@/actions/fund';
import { Reducer } from '@/reducers/types';

export interface FundState {
  fundsLoading: boolean;
  remoteFunds: Fund.RemoteFund[];
  remoteFundsLoading: boolean;
}

const fund: Reducer<FundState> = (
  state = {
    fundsLoading: false,
    remoteFunds: [],
    remoteFundsLoading: false,
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
    default:
      return state;
  }
};
export default fund;
