import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FundState {
  fundsLoading: boolean;
  remoteFunds: Fund.RemoteFund[];
  remoteFundsLoading: boolean;
  fundRatingMap: Record<string, Fund.RantingItem>;
}

const initialState = {
  fundsLoading: false,
  remoteFunds: [],
  remoteFundsLoading: false,
  fundRatingMap: {},
} as FundState;

const fundSlice = createSlice({
  name: 'fund',
  initialState,
  reducers: {
    setRemoteFunds(state, action) {
      state.remoteFunds = action.payload;
    },
    setFundsLoading(state, action: PayloadAction<boolean>) {
      state.fundsLoading = action.payload;
    },
    setRemoteFundsLoading(state, action: PayloadAction<boolean>) {
      state.remoteFundsLoading = action.payload;
    },
    setFundRatingMap(state, action) {
      state.fundRatingMap = action.payload;
    },
  },
});

export const { setRemoteFunds, setFundsLoading, setRemoteFundsLoading, setFundRatingMap } = fundSlice.actions;

export default fundSlice.reducer;
