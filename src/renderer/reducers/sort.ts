import { SYNC_SORT_MODE, SYNC_VIEW_MODE } from '@/actions/sort';
import { Reducer } from '@/reducers/types';
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

const sort: Reducer<SortState> = (
  state = {
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
  },
  action
) => {
  switch (action.type) {
    case SYNC_SORT_MODE:
      return {
        ...state,
        sortMode: action.payload,
      };
    case SYNC_VIEW_MODE:
      return {
        ...state,
        viewMode: action.payload,
      };
    default:
      return state;
  }
};

export default sort;
