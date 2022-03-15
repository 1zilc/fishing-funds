import { batch } from 'react-redux';

import { ThunkAction } from '@/reducers/types';
import { sortFundsAction } from '@/actions/fund';
import { sortZindexsAction } from '@/actions/zindex';
import { sortQuotationsAction } from '@/actions/quotation';
import { sortStocksAction } from '@/actions/stock';
import { sortCoinsAction } from '@/actions/coin';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import * as CONST from '@/constants';

export const SYNC_SORT_MODE = 'SYNC_SORT_MODE';
export const SYNC_VIEW_MODE = 'SYNC_VIEW_MODE';

export function setFundSortModeAction(mode: { type?: Enums.FundSortType; order?: Enums.SortOrderType }): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        sort: { sortMode },
      } = getState();

      const fundSortMode = { ...sortMode.fundSortMode, ...mode };

      batch(() => {
        dispatch(syncSortModeAction({ ...sortMode, fundSortMode }));
        dispatch(sortFundsAction());
      });

      Utils.SetStorage(CONST.STORAGE.FUND_SORT_MODE, fundSortMode);
    } catch (error) {}
  };
}

export function setZindexSortModeAction(mode: { type?: Enums.ZindexSortType; order?: Enums.SortOrderType }): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        sort: { sortMode },
      } = getState();

      const zindexSortMode = { ...sortMode.zindexSortMode, ...mode };

      batch(() => {
        dispatch(syncSortModeAction({ ...sortMode, zindexSortMode }));
        dispatch(sortZindexsAction());
      });

      Utils.SetStorage(CONST.STORAGE.ZINDEX_SORT_MODE, zindexSortMode);
    } catch (error) {}
  };
}

export function setQuotationSortModeAction(mode: { type?: Enums.QuotationSortType; order?: Enums.SortOrderType }): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        sort: { sortMode },
      } = getState();

      const quotationSortMode = { ...sortMode.quotationSortMode, ...mode };

      batch(() => {
        dispatch(syncSortModeAction({ ...sortMode, quotationSortMode }));
        dispatch(sortQuotationsAction());
      });

      Utils.SetStorage(CONST.STORAGE.QUOTATION_SORT_MODE, quotationSortMode);
    } catch (error) {}
  };
}

export function setStockSortModeAction(mode: { type?: Enums.StockSortType; order?: Enums.SortOrderType }): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        sort: { sortMode },
      } = getState();

      const stockSortMode = { ...sortMode.stockSortMode, ...mode };

      batch(() => {
        dispatch(syncSortModeAction({ ...sortMode, stockSortMode }));
        dispatch(sortStocksAction());
      });

      Utils.SetStorage(CONST.STORAGE.STOCK_SORT_MODE, stockSortMode);
    } catch (error) {}
  };
}

export function setCoinSortModeAction(mode: { type?: Enums.CoinSortType; order?: Enums.SortOrderType }): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        sort: { sortMode },
      } = getState();

      const coinSortMode = { ...sortMode.coinSortMode, ...sortMode };

      batch(() => {
        dispatch(syncSortModeAction({ ...sortMode, coinSortMode }));
        dispatch(sortCoinsAction());
      });

      Utils.SetStorage(CONST.STORAGE.COIN_SORT_MODE, coinSortMode);
    } catch (error) {}
  };
}

export function troggleFundSortOrderAction(): ThunkAction {
  return async (dispatch, getState) => {
    try {
      const {
        sort: { sortMode },
      } = getState();

      const fundSortMode = {
        ...sortMode.fundSortMode,
        order: sortMode.fundSortMode.order === Enums.SortOrderType.Asc ? Enums.SortOrderType.Desc : Enums.SortOrderType.Asc,
      };

      batch(() => {
        dispatch(syncSortModeAction({ ...sortMode, fundSortMode }));
        dispatch(sortFundsAction());
      });

      Utils.SetStorage(CONST.STORAGE.FUND_SORT_MODE, fundSortMode);
    } catch (error) {}
  };
}

export function troggleZindexSortOrderAction(): ThunkAction {
  return async (dispatch, getState) => {
    try {
      const {
        sort: { sortMode },
      } = getState();

      const zindexSortMode = {
        ...sortMode.zindexSortMode,
        order: sortMode.zindexSortMode.order === Enums.SortOrderType.Asc ? Enums.SortOrderType.Desc : Enums.SortOrderType.Asc,
      };

      batch(() => {
        dispatch(syncSortModeAction({ ...sortMode, zindexSortMode }));
        dispatch(sortZindexsAction());
      });

      Utils.SetStorage(CONST.STORAGE.ZINDEX_SORT_MODE, zindexSortMode);
    } catch (error) {}
  };
}

export function troggleQuotationSortOrderAction(): ThunkAction {
  return async (dispatch, getState) => {
    try {
      const {
        sort: { sortMode },
      } = getState();

      const quotationSortMode = {
        ...sortMode.quotationSortMode,
        order: sortMode.quotationSortMode.order === Enums.SortOrderType.Asc ? Enums.SortOrderType.Desc : Enums.SortOrderType.Asc,
      };

      batch(() => {
        dispatch(syncSortModeAction({ ...sortMode, quotationSortMode }));
        dispatch(sortQuotationsAction());
      });

      Utils.SetStorage(CONST.STORAGE.QUOTATION_SORT_MODE, quotationSortMode);
    } catch (error) {}
  };
}

export function troggleStockSortOrderAction(): ThunkAction {
  return async (dispatch, getState) => {
    try {
      const {
        sort: { sortMode },
      } = getState();

      const stockSortMode = {
        ...sortMode.stockSortMode,
        order: sortMode.stockSortMode.order === Enums.SortOrderType.Asc ? Enums.SortOrderType.Desc : Enums.SortOrderType.Asc,
      };

      batch(() => {
        dispatch(syncSortModeAction({ ...sortMode, stockSortMode }));
        dispatch(sortStocksAction());
      });

      Utils.SetStorage(CONST.STORAGE.STOCK_SORT_MODE, stockSortMode);
    } catch (error) {}
  };
}

export function troggleCoinSortOrderAction(): ThunkAction {
  return async (dispatch, getState) => {
    try {
      const {
        sort: { sortMode },
      } = getState();

      const coinSortMode = {
        ...sortMode.coinSortMode,
        order: sortMode.coinSortMode.order === Enums.SortOrderType.Asc ? Enums.SortOrderType.Desc : Enums.SortOrderType.Asc,
      };

      batch(() => {
        dispatch(syncSortModeAction({ ...sortMode, coinSortMode }));
        dispatch(sortCoinsAction());
      });

      Utils.SetStorage(CONST.STORAGE.COIN_SORT_MODE, coinSortMode);
    } catch (error) {}
  };
}

export function syncSortModeAction(newSortMode: any): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        sort: { sortMode },
      } = getState();
      dispatch({ type: SYNC_SORT_MODE, payload: { ...sortMode, ...newSortMode } });
    } catch (error) {}
  };
}

export function setFundViewModeAction(mode: { type: Enums.FundViewType }): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        sort: { viewMode },
      } = getState();

      const fundViewMode = { ...viewMode.fundViewMode, ...mode };

      dispatch(syncViewModeAction({ ...viewMode, fundViewMode }));

      Utils.SetStorage(CONST.STORAGE.FUND_VIEW_MODE, fundViewMode);
    } catch (error) {}
  };
}

export function setZindexViewModeAction(mode: { type: Enums.ZindexViewType }): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        sort: { viewMode },
      } = getState();

      const zindexViewMode = { ...viewMode.zindexViewMode, ...mode };

      dispatch(syncViewModeAction({ ...viewMode, zindexViewMode }));

      Utils.SetStorage(CONST.STORAGE.ZINDEX_VIEW_MODE, zindexViewMode);
    } catch (error) {}
  };
}

export function setQuotationViewModeAction(mode: { type: Enums.QuotationViewType }): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        sort: { viewMode },
      } = getState();

      const quotationViewMode = { ...viewMode.quotationViewMode, ...mode };

      dispatch(syncViewModeAction({ ...viewMode, quotationViewMode }));

      Utils.SetStorage(CONST.STORAGE.QUOTATION_VIEW_MODE, quotationViewMode);
    } catch (error) {}
  };
}
export function setStockViewModeAction(mode: { type: Enums.StockViewType }): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        sort: { viewMode },
      } = getState();

      const stockViewMode = { ...viewMode.stockViewMode, ...mode };

      dispatch(syncViewModeAction({ ...viewMode, stockViewMode }));

      Utils.SetStorage(CONST.STORAGE.STOCK_VIEW_MODE, stockViewMode);
    } catch (error) {}
  };
}
export function setCoinViewModeAction(mode: { type: Enums.CoinViewType }): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        sort: { viewMode },
      } = getState();

      const coinViewMode = { ...viewMode.coinViewMode, ...mode };

      dispatch(syncViewModeAction({ ...viewMode, coinViewMode }));

      Utils.SetStorage(CONST.STORAGE.COIN_VIEW_MODE, coinViewMode);
    } catch (error) {}
  };
}

export function syncViewModeAction(newViewMode: any): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        sort: { viewMode },
      } = getState();
      dispatch({ type: SYNC_VIEW_MODE, payload: { ...viewMode, ...newViewMode } });
    } catch (error) {}
  };
}
