import { AnyAction } from 'redux';
import { batch } from 'react-redux';

import { ThunkAction } from '@/reducers/types';
import { sortFundsAction } from '@/actions/fund';
import { sortZindexsAction } from '@/actions/zindex';
import { sortQuotationsAction } from '@/actions/quotation';
import { sortStocksAction } from '@/actions/stock';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';

export const SYNC_SORT_MODE = 'SYNC_SORT_MODE';

export function setFundSortModeAction(fundSortMode: { type?: Enums.FundSortType; order?: Enums.SortOrderType }): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        sort: {
          sortMode: { fundSortMode: _ },
        },
      } = getState();
      Utils.SetStorage(CONST.STORAGE.FUND_SORT_MODE, {
        ..._,
        ...fundSortMode,
      });
      batch(() => {
        dispatch(syncSortModeAction());
        dispatch(sortFundsAction());
      });
    } catch (error) {
      console.log('设置基金排序方式出错', error);
    }
  };
}

export function setZindexSortModeAction(zindexSortMode: { type?: Enums.ZindexSortType; order?: Enums.SortOrderType }): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        sort: {
          sortMode: { zindexSortMode: _ },
        },
      } = getState();
      Utils.SetStorage(CONST.STORAGE.ZINDEX_SORT_MODE, {
        ..._,
        ...zindexSortMode,
      });
      batch(() => {
        dispatch(syncSortModeAction());
        dispatch(sortZindexsAction());
      });
    } catch (error) {
      console.log('设置指数排序方式出错', error);
    }
  };
}

export function setQuotationSortModeAction(quotationSortMode: {
  type?: Enums.QuotationSortType;
  order?: Enums.SortOrderType;
}): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        sort: {
          sortMode: { quotationSortMode: _ },
        },
      } = getState();
      Utils.SetStorage(CONST.STORAGE.QUOTATION_SORT_MODE, {
        ..._,
        ...quotationSortMode,
      });
      batch(() => {
        dispatch(syncSortModeAction());
        dispatch(sortQuotationsAction());
      });
    } catch (error) {
      console.log('设置板块排序方式出错', error);
    }
  };
}

export function setStockSortModeAction(stockSortMode: { type?: Enums.StockSortType; order?: Enums.SortOrderType }): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        sort: {
          sortMode: { stockSortMode: _ },
        },
      } = getState();
      Utils.SetStorage(CONST.STORAGE.STOCK_SORT_MODE, {
        ..._,
        ...stockSortMode,
      });
      batch(() => {
        dispatch(syncSortModeAction());
        dispatch(sortStocksAction());
      });
    } catch (error) {
      console.log('设置股票排序方式出错', error);
    }
  };
}

export function troggleFundSortOrderAction(): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        sort: {
          sortMode: {
            fundSortMode,
            fundSortMode: { order },
          },
        },
      } = getState();
      Utils.SetStorage(CONST.STORAGE.FUND_SORT_MODE, {
        ...fundSortMode,
        order: order === Enums.SortOrderType.Asc ? Enums.SortOrderType.Desc : Enums.SortOrderType.Asc,
      });
      batch(() => {
        dispatch(syncSortModeAction());
        dispatch(sortFundsAction());
      });
    } catch (error) {
      console.log('设置基金排序顺序出错', error);
    }
  };
}

export function troggleZindexSortOrderAction(): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        sort: {
          sortMode: {
            zindexSortMode,
            zindexSortMode: { order },
          },
        },
      } = getState();
      Utils.SetStorage(CONST.STORAGE.ZINDEX_SORT_MODE, {
        ...zindexSortMode,
        order: order === Enums.SortOrderType.Asc ? Enums.SortOrderType.Desc : Enums.SortOrderType.Asc,
      });
      batch(() => {
        dispatch(syncSortModeAction());
        dispatch(sortZindexsAction());
      });
    } catch (error) {
      console.log('设置指数排序顺序出错', error);
    }
  };
}

export function troggleQuotationSortOrderAction(): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        sort: {
          sortMode: {
            quotationSortMode,
            quotationSortMode: { order },
          },
        },
      } = getState();
      Utils.SetStorage(CONST.STORAGE.QUOTATION_SORT_MODE, {
        ...quotationSortMode,
        order: order === Enums.SortOrderType.Asc ? Enums.SortOrderType.Desc : Enums.SortOrderType.Asc,
      });
      batch(() => {
        dispatch(syncSortModeAction());
        dispatch(sortQuotationsAction());
      });
    } catch (error) {
      console.log('设置板块排序顺序出错', error);
    }
  };
}

export function troggleStockSortOrderAction(): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        sort: {
          sortMode: {
            stockSortMode,
            stockSortMode: { order },
          },
        },
      } = getState();
      Utils.SetStorage(CONST.STORAGE.STOCK_SORT_MODE, {
        ...stockSortMode,
        order: order === Enums.SortOrderType.Asc ? Enums.SortOrderType.Desc : Enums.SortOrderType.Asc,
      });

      batch(() => {
        dispatch(syncSortModeAction());
        dispatch(sortStocksAction());
      });
    } catch (error) {
      console.log('设置股票排序顺序出错', error);
    }
  };
}

export function syncSortModeAction(): AnyAction {
  const sortMode = Helpers.Sort.GetSortMode();
  return {
    type: SYNC_SORT_MODE,
    payload: sortMode,
  };
}
