import { createSlice } from '@reduxjs/toolkit';
import { batch } from 'react-redux';

import { TypedThunk } from '@/store';
import { sortFundsAction } from '@/store/features/fund';
import { sortZindexsAction } from '@/store/features/zindex';
import { sortQuotationsAction } from '@/store/features/quotation';
import { sortStocksAction } from '@/actions/stock';
import { sortCoinsAction } from '@/store/features/coin';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';

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

export function setFundSortModeAction(mode: { type?: Enums.FundSortType; order?: Enums.SortOrderType }): TypedThunk {
  return async (dispatch, getState) => {
    try {
      const {
        sort: { sortMode },
      } = getState();

      const fundSortMode = { ...sortMode.fundSortMode, ...mode };
      await Utils.SetStorage(CONST.STORAGE.FUND_SORT_MODE, fundSortMode);
      batch(() => {
        dispatch(syncSortModeAction({ ...sortMode, fundSortMode }));
        dispatch(sortFundsAction());
      });
    } catch (error) {}
  };
}
export function setZindexSortModeAction(mode: { type?: Enums.ZindexSortType; order?: Enums.SortOrderType }): TypedThunk {
  return async (dispatch, getState) => {
    try {
      const {
        sort: { sortMode },
      } = getState();

      const zindexSortMode = { ...sortMode.zindexSortMode, ...mode };
      await Utils.SetStorage(CONST.STORAGE.ZINDEX_SORT_MODE, zindexSortMode);

      batch(() => {
        dispatch(syncSortModeAction({ ...sortMode, zindexSortMode }));
        dispatch(sortZindexsAction());
      });
    } catch (error) {}
  };
}
export function setQuotationSortModeAction(mode: { type?: Enums.QuotationSortType; order?: Enums.SortOrderType }): TypedThunk {
  return async (dispatch, getState) => {
    try {
      const {
        sort: { sortMode },
      } = getState();

      const quotationSortMode = { ...sortMode.quotationSortMode, ...mode };
      await Utils.SetStorage(CONST.STORAGE.QUOTATION_SORT_MODE, quotationSortMode);
      batch(() => {
        dispatch(syncSortModeAction({ ...sortMode, quotationSortMode }));
        dispatch(sortQuotationsAction());
      });
    } catch (error) {}
  };
}
export function setStockSortModeAction(mode: { type?: Enums.StockSortType; order?: Enums.SortOrderType }): TypedThunk {
  return async (dispatch, getState) => {
    try {
      const {
        sort: { sortMode },
      } = getState();

      const stockSortMode = { ...sortMode.stockSortMode, ...mode };
      await Utils.SetStorage(CONST.STORAGE.STOCK_SORT_MODE, stockSortMode);
      batch(() => {
        dispatch(syncSortModeAction({ ...sortMode, stockSortMode }));
        dispatch(sortStocksAction());
      });
    } catch (error) {}
  };
}
export function setCoinSortModeAction(mode: { type?: Enums.CoinSortType; order?: Enums.SortOrderType }): TypedThunk {
  return async (dispatch, getState) => {
    try {
      const {
        sort: { sortMode },
      } = getState();

      const coinSortMode = { ...sortMode.coinSortMode, ...mode };
      await Utils.SetStorage(CONST.STORAGE.COIN_SORT_MODE, coinSortMode);
      batch(() => {
        dispatch(syncSortModeAction({ ...sortMode, coinSortMode }));
        dispatch(sortCoinsAction());
      });
    } catch (error) {}
  };
}
export function troggleFundSortOrderAction(): TypedThunk {
  return async (dispatch, getState) => {
    try {
      const {
        sort: { sortMode },
      } = getState();

      const fundSortMode = {
        ...sortMode.fundSortMode,
        order: sortMode.fundSortMode.order === Enums.SortOrderType.Asc ? Enums.SortOrderType.Desc : Enums.SortOrderType.Asc,
      };
      await Utils.SetStorage(CONST.STORAGE.FUND_SORT_MODE, fundSortMode);
      batch(() => {
        dispatch(syncSortModeAction({ ...sortMode, fundSortMode }));
        dispatch(sortFundsAction());
      });
    } catch (error) {}
  };
}
export function troggleZindexSortOrderAction(): TypedThunk {
  return async (dispatch, getState) => {
    try {
      const {
        sort: { sortMode },
      } = getState();

      const zindexSortMode = {
        ...sortMode.zindexSortMode,
        order: sortMode.zindexSortMode.order === Enums.SortOrderType.Asc ? Enums.SortOrderType.Desc : Enums.SortOrderType.Asc,
      };
      await Utils.SetStorage(CONST.STORAGE.ZINDEX_SORT_MODE, zindexSortMode);
      batch(() => {
        dispatch(syncSortModeAction({ ...sortMode, zindexSortMode }));
        dispatch(sortZindexsAction());
      });
    } catch (error) {}
  };
}
export function troggleQuotationSortOrderAction(): TypedThunk {
  return async (dispatch, getState) => {
    try {
      const {
        sort: { sortMode },
      } = getState();

      const quotationSortMode = {
        ...sortMode.quotationSortMode,
        order: sortMode.quotationSortMode.order === Enums.SortOrderType.Asc ? Enums.SortOrderType.Desc : Enums.SortOrderType.Asc,
      };
      await Utils.SetStorage(CONST.STORAGE.QUOTATION_SORT_MODE, quotationSortMode);
      batch(() => {
        dispatch(syncSortModeAction({ ...sortMode, quotationSortMode }));
        dispatch(sortQuotationsAction());
      });
    } catch (error) {}
  };
}
export function troggleStockSortOrderAction(): TypedThunk {
  return async (dispatch, getState) => {
    try {
      const {
        sort: { sortMode },
      } = getState();

      const stockSortMode = {
        ...sortMode.stockSortMode,
        order: sortMode.stockSortMode.order === Enums.SortOrderType.Asc ? Enums.SortOrderType.Desc : Enums.SortOrderType.Asc,
      };
      await Utils.SetStorage(CONST.STORAGE.STOCK_SORT_MODE, stockSortMode);
      batch(() => {
        dispatch(syncSortModeAction({ ...sortMode, stockSortMode }));
        dispatch(sortStocksAction());
      });
    } catch (error) {}
  };
}
export function troggleCoinSortOrderAction(): TypedThunk {
  return async (dispatch, getState) => {
    try {
      const {
        sort: { sortMode },
      } = getState();

      const coinSortMode = {
        ...sortMode.coinSortMode,
        order: sortMode.coinSortMode.order === Enums.SortOrderType.Asc ? Enums.SortOrderType.Desc : Enums.SortOrderType.Asc,
      };
      await Utils.SetStorage(CONST.STORAGE.COIN_SORT_MODE, coinSortMode);
      batch(() => {
        dispatch(syncSortModeAction({ ...sortMode, coinSortMode }));
        dispatch(sortCoinsAction());
      });
    } catch (error) {}
  };
}
export function syncSortModeAction(newSortMode: any): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        sort: { sortMode },
      } = getState();
      dispatch(syncSortMode({ ...sortMode, ...newSortMode }));
    } catch (error) {}
  };
}
export function setFundViewModeAction(mode: { type: Enums.FundViewType }): TypedThunk {
  return async (dispatch, getState) => {
    try {
      const {
        sort: { viewMode },
      } = getState();

      const fundViewMode = { ...viewMode.fundViewMode, ...mode };
      await Utils.SetStorage(CONST.STORAGE.FUND_VIEW_MODE, fundViewMode);
      dispatch(syncViewModeAction({ ...viewMode, fundViewMode }));
    } catch (error) {}
  };
}
export function setZindexViewModeAction(mode: { type: Enums.ZindexViewType }): TypedThunk {
  return async (dispatch, getState) => {
    try {
      const {
        sort: { viewMode },
      } = getState();

      const zindexViewMode = { ...viewMode.zindexViewMode, ...mode };
      await Utils.SetStorage(CONST.STORAGE.ZINDEX_VIEW_MODE, zindexViewMode);
      dispatch(syncViewModeAction({ ...viewMode, zindexViewMode }));
    } catch (error) {}
  };
}
export function setQuotationViewModeAction(mode: { type: Enums.QuotationViewType }): TypedThunk {
  return async (dispatch, getState) => {
    try {
      const {
        sort: { viewMode },
      } = getState();

      const quotationViewMode = { ...viewMode.quotationViewMode, ...mode };
      await Utils.SetStorage(CONST.STORAGE.QUOTATION_VIEW_MODE, quotationViewMode);
      dispatch(syncViewModeAction({ ...viewMode, quotationViewMode }));
    } catch (error) {}
  };
}
export function setStockViewModeAction(mode: { type: Enums.StockViewType }): TypedThunk {
  return async (dispatch, getState) => {
    try {
      const {
        sort: { viewMode },
      } = getState();

      const stockViewMode = { ...viewMode.stockViewMode, ...mode };
      await Utils.SetStorage(CONST.STORAGE.STOCK_VIEW_MODE, stockViewMode);
      dispatch(syncViewModeAction({ ...viewMode, stockViewMode }));
    } catch (error) {}
  };
}
export function setCoinViewModeAction(mode: { type: Enums.CoinViewType }): TypedThunk {
  return async (dispatch, getState) => {
    try {
      const {
        sort: { viewMode },
      } = getState();

      const coinViewMode = { ...viewMode.coinViewMode, ...mode };
      await Utils.SetStorage(CONST.STORAGE.COIN_VIEW_MODE, coinViewMode);
      dispatch(syncViewModeAction({ ...viewMode, coinViewMode }));
    } catch (error) {}
  };
}
export function syncViewModeAction(newViewMode: any): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        sort: { viewMode },
      } = getState();
      dispatch(syncViewMode({ ...viewMode, ...newViewMode }));
    } catch (error) {}
  };
}

export default sortSlice.reducer;
