import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StockState {
  stocks: (Stock.ResponseItem & Stock.ExtraRow)[];
  stocksLoading: boolean;
  config: {
    stockConfig: Stock.SettingItem[];
    codeMap: Stock.CodeMap;
  };
  industryMap: Record<string, Stock.IndustryItem[]>;
}

const initialState = {
  stocks: [],
  stocksLoading: false,
  config: { stockConfig: [], codeMap: {} },
  industryMap: {},
} as StockState;

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setStocksLoading(state, action: PayloadAction<boolean>) {
      state.stocksLoading = action.payload;
    },
    syncStocks(state, action) {
      state.stocks = action.payload;
    },
    syncStocksConfig(state, action) {
      state.config = action.payload;
    },
    setIndustryMap(state, action) {
      state.industryMap = action.payload;
    },
  },
});

export const { setStocksLoading, syncStocks, syncStocksConfig, setIndustryMap } = stockSlice.actions;

export default stockSlice.reducer;
