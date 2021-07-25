import { SYNC_SORT_MODE } from '@/actions/sort';
import { Reducer } from '@/reducers/types';
import * as Helpers from '@/helpers';

export type SortState = {
  sortMode: {
    fundSortMode: Helpers.Sort.FundSortMode;
    zindexSortMode: Helpers.Sort.ZindexSortMode;
    quotationSortMode: Helpers.Sort.QuotationSortType;
    stockSortMode: Helpers.Sort.StockSortType;
  };
};

const sort: Reducer<SortState> = (
  state = {
    sortMode: Helpers.Sort.GetSortMode(),
  },
  action
) => {
  switch (action.type) {
    case SYNC_SORT_MODE:
      return {
        ...state,
        sortMode: action.payload,
      };
    default:
      return state;
  }
};

export default sort;
