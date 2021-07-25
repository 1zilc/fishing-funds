import { AnyAction } from 'redux';
import { batch } from 'react-redux';

import { ThunkAction } from '@/reducers/types';
import { sortFundsAction } from '@/actions/fund';
import { SORT_ZINDEXS } from '@/actions/zindex';
import { SORT_QUOTATIONS } from '@/actions/quotation';
import { SORT_STOCKS } from '@/actions/stock';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';

export const SYNC_SORT_MODE = 'SYNC_SORT_MODE';

export function setFundSortModeAction(fundSortMode: { type?: Enums.FundSortType; order?: Enums.SortOrderType }): ThunkAction {
  return (dispatch, getState) => {
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
  };
}

export function setZindexSortModeAction(zindexSortMode: { type?: Enums.ZindexSortType; order?: Enums.SortOrderType }): ThunkAction {
  return (dispatch, getState) => {
    const {
      sort: {
        sortMode: { zindexSortMode: _ },
      },
    } = getState();
    Utils.SetStorage(CONST.STORAGE.ZINDEX_SORT_MODE, {
      ..._,
      ...zindexSortMode,
    });
    dispatch(syncSortModeAction());
  };
}

export function setQuotationSortModeAction(quotationSortMode: {
  type?: Enums.QuotationSortType;
  order?: Enums.SortOrderType;
}): ThunkAction {
  return (dispatch, getState) => {
    const {
      sort: {
        sortMode: { quotationSortMode: _ },
      },
    } = getState();
    Utils.SetStorage(CONST.STORAGE.QUOTATION_SORT_MODE, {
      ..._,
      ...quotationSortMode,
    });
    dispatch(syncSortModeAction());
  };
}

export function setStockSortModeAction(stockSortMode: { type?: Enums.StockSortType; order?: Enums.SortOrderType }): ThunkAction {
  return (dispatch, getState) => {
    const {
      sort: {
        sortMode: { stockSortMode: _ },
      },
    } = getState();
    Utils.SetStorage(CONST.STORAGE.STOCK_SORT_MODE, {
      ..._,
      ...stockSortMode,
    });
    dispatch(syncSortModeAction());
  };
}

export function troggleFundSortOrderAction(): ThunkAction {
  return (dispatch, getState) => {
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
  };
}

export function troggleZindexSortOrderAction(): ThunkAction {
  return (dispatch, getState) => {
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
      dispatch({ type: SORT_ZINDEXS });
    });
  };
}

export function troggleQuotationSortOrderAction(): ThunkAction {
  return (dispatch, getState) => {
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
      dispatch({ type: SORT_QUOTATIONS });
    });
  };
}

export function troggleStockSortOrderAction(): ThunkAction {
  return (dispatch, getState) => {
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
      dispatch({ type: SORT_STOCKS });
    });
  };
}

export function syncSortModeAction(): AnyAction {
  const sortMode = Helpers.Sort.GetSortMode();
  return {
    type: SYNC_SORT_MODE,
    payload: sortMode,
  };
}
