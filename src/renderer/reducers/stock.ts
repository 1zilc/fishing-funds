import { SET_STOCKS_LOADING, SYNC_STOCK_CONFIG, SYNC_STOCKS, SET_INDUSTRY_MAP } from '@/actions/stock';
import { Reducer } from '@/reducers/types';
import * as Helpers from '@/helpers';

export interface StockState {
  stocks: (Stock.ResponseItem & Stock.ExtraRow)[];
  stocksLoading: boolean;
  config: {
    stockConfig: Stock.SettingItem[];
    codeMap: Helpers.Stock.CodeStockMap;
  };
  industryMap: Record<string, Stock.IndustryItem[]>;
}

const stock: Reducer<StockState> = (
  state = {
    stocks: [],
    stocksLoading: false,
    config: { stockConfig: [], codeMap: {} },
    industryMap: {},
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
    case SET_INDUSTRY_MAP:
      return {
        ...state,
        industryMap: action.payload,
      };
    default:
      return state;
  }
};
export default stock;
