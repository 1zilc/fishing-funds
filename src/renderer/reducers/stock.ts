import { AnyAction } from 'redux';

import {
  SORT_STOCKS,
  SET_STOCKS_LOADING,
  SORT_STOCKS_WITH_COLLAPSE_CHACHED,
  TOGGLE_STOCK_COLLAPSE,
  TOGGLE_STOCKS_COLLAPSE,
  getStockConfig,
} from '@/actions/stock';
import { getSortMode } from '@/actions/sort';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';

export interface StockState {
  stocks: (Stock.ResponseItem & Stock.ExtraRow)[];
  stocksLoading: boolean;
}

function sortStocks(
  state: StockState,
  responseStocks?: Stock.ResponseItem[]
): StockState {
  const { stocks } = state;
  const {
    stockSortMode: { type: stockSortType, order: stockSortorder },
  } = getSortMode();
  const { codeMap } = getStockConfig();
  const sortList = Utils.DeepCopy(responseStocks || stocks);

  sortList.sort((a, b) => {
    const t = stockSortorder === Enums.SortOrderType.Asc ? 1 : -1;
    switch (stockSortType) {
      case Enums.StockSortType.Zdd:
        return (Number(a.zdd) - Number(b.zdd)) * t;
      case Enums.StockSortType.Zdf:
        return (Number(a.zdf) - Number(b.zdf)) * t;
      case Enums.StockSortType.Zx:
        return (Number(a.zx) - Number(b.zx)) * t;
      case Enums.StockSortType.Custom:
      default:
        return (
          (codeMap[b.secid!]?.originSort - codeMap[a.secid!]?.originSort) * t
        );
    }
  });

  return {
    ...state,
    stocks: sortList,
  };
}

function setStocksLoading(state: StockState, loading: boolean): StockState {
  return {
    ...state,
    stocksLoading: loading,
  };
}

function sortStocksWithChached(
  state: StockState,
  responseStocks: Stock.ResponseItem[]
) {
  const { stocks } = state;
  const { stockConfig } = getStockConfig();
  const stocksCodeToMap = stocks.reduce((map, stock) => {
    map[stock.secid] = stock;
    return map;
  }, {} as any);

  const stocksWithChached = responseStocks.filter(Boolean).map((_) => ({
    ...(stocksCodeToMap[_.secid] || {}),
    ..._,
  }));

  const stocksWithChachedCodeToMap = stocksWithChached.reduce((map, stock) => {
    map[stock.secid] = stock;
    return map;
  }, {} as any);

  stockConfig.forEach((stock) => {
    const responseStock = stocksWithChachedCodeToMap[stock.secid];
    const stateStock = stocksCodeToMap[stock.secid];
    if (!responseStock && stateStock) {
      stocksWithChached.push(stateStock);
    }
  });

  return sortStocks(state, stocksWithChached);
}

function toggleStockCollapse(
  state: StockState,
  stock: Stock.ResponseItem & Stock.ExtraRow
) {
  const { stocks } = state;
  const cloneStocks = Utils.DeepCopy(stocks);
  cloneStocks.forEach((_) => {
    if (_.secid === stock.secid) {
      _.collapse = !stock.collapse;
    }
  });
  return {
    ...state,
    stocks: cloneStocks,
  };
}

function toggleStocksCollapse(state: StockState) {
  const { stocks } = state;
  const cloneStocks = Utils.DeepCopy(stocks);
  const expandAllStocks = stocks.every((_) => _.collapse);
  cloneStocks.forEach((_) => {
    _.collapse = !expandAllStocks;
  });
  return {
    ...state,
    stocks: cloneStocks,
  };
}

export default function stock(
  state: StockState = {
    stocks: [],
    stocksLoading: false,
  },
  action: AnyAction
): StockState {
  switch (action.type) {
    case SORT_STOCKS:
      return sortStocks(state, action.payload);
    case SET_STOCKS_LOADING:
      return setStocksLoading(state, action.payload);
    case SORT_STOCKS_WITH_COLLAPSE_CHACHED:
      return sortStocksWithChached(state, action.payload);
    case TOGGLE_STOCK_COLLAPSE:
      return toggleStockCollapse(state, action.payload);
    case TOGGLE_STOCKS_COLLAPSE:
      return toggleStocksCollapse(state);
    default:
      return state;
  }
}
