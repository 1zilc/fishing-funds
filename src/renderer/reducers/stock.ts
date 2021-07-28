import { AnyAction } from 'redux';

import { SET_STOCKS_LOADING, SYNC_STOCK_CONFIG, SYNC_STOCKS } from '@/actions/stock';

import { Reducer } from '@/reducers/types';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';

export interface StockState {
  stocks: (Stock.ResponseItem & Stock.ExtraRow)[];
  stocksLoading: boolean;
  config: {
    stockConfig: Stock.SettingItem[];
    codeMap: Helpers.Stock.CodeStockMap;
  };
}

const stock: Reducer<StockState> = (
  state = {
    stocks: [],
    stocksLoading: false,
    config: Helpers.Stock.GetStockConfig(),
  },
  action
) => {
  switch (action.type) {
    case SET_STOCKS_LOADING:
      return {
        ...state,
        stocksLoading: action.payload,
      };
    case SYNC_STOCKS:
      return {
        ...state,
        stocks: action.payload,
      };
    case SYNC_STOCK_CONFIG:
      return {
        ...state,
        config: action.payload,
      };
    default:
      return state;
  }
};
export default stock;
