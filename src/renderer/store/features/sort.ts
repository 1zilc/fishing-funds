import { createSlice } from '@reduxjs/toolkit';
import * as Helpers from '@/helpers';
import * as Enums from '@/utils/enums';

export type SortState = {
  sortMode: {
    fundSortMode: Helpers.Sort.FundSortMode;
    zindexSortMode: Helpers.Sort.ZindexSortMode;
    quotationSortMode: Helpers.Sort.QuotationSortType;
    stockSortMode: Helpers.Sort.StockSortType;
    coinSortMode: Helpers.Sort.CoinSortType;
  };
  viewMode: {
    fundViewMode: {
      type: Enums.FundViewType;
    };
    zindexViewMode: {
      type: Enums.ZindexViewType;
    };
    quotationViewMode: {
      type: Enums.QuotationViewType;
    };
    stockViewMode: {
      type: Enums.StockViewType;
    };
    coinViewMode: {
      type: Enums.CoinViewType;
    };
  };
};

const initialState = {
  sortMode: {
    fundSortMode: {
      type: Enums.FundSortType.Custom,
      order: Enums.SortOrderType.Desc,
    },
    zindexSortMode: {
      type: Enums.ZindexSortType.Custom,
      order: Enums.SortOrderType.Desc,
    },
    quotationSortMode: {
      type: Enums.QuotationSortType.Zdf,
      order: Enums.SortOrderType.Desc,
    },
    stockSortMode: {
      type: Enums.StockSortType.Custom,
      order: Enums.SortOrderType.Desc,
    },
    coinSortMode: {
      type: Enums.CoinSortType.Price,
      order: Enums.SortOrderType.Desc,
    },
  },
  viewMode: {
    fundViewMode: {
      type: Enums.FundViewType.List,
    },
    zindexViewMode: {
      type: Enums.ZindexViewType.Grid,
    },
    quotationViewMode: {
      type: Enums.QuotationViewType.List,
    },
    stockViewMode: {
      type: Enums.StockViewType.List,
    },
    coinViewMode: {
      type: Enums.CoinViewType.List,
    },
  },
} as SortState;

const sortSlice = createSlice({
  name: 'sort',
  initialState,
  reducers: {
    syncSortMode(state, action) {
      state.sortMode = action.payload;
    },
    syncViewMode(state, action) {
      state.viewMode = action.payload;
    },
  },
});

export const { syncSortMode, syncViewMode } = sortSlice.actions;

export default sortSlice.reducer;
