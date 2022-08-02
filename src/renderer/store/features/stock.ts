import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@/store';
import { sortStock } from '@/workers/sort.worker';
import { mergeStateWithResponse } from '@/workers/merge.worker';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';

export interface StockState {
  stocks: (Stock.ResponseItem & Stock.ExtraRow)[];
  stocksLoading: boolean;
  config: {
    stockConfig: Stock.SettingItem[];
    codeMap: Stock.CodeMap;
  };
  industryMap: Record<string, Stock.IndustryItem[]>;
}

const initialState: StockState = {
  stocks: [],
  stocksLoading: false,
  config: { stockConfig: [], codeMap: {} },
  industryMap: {},
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setStocksLoadingAction(state, action: PayloadAction<boolean>) {
      state.stocksLoading = action.payload;
    },
    syncStocksAction(state, action) {
      state.stocks = action.payload;
    },
    syncStocksConfigAction(state, action: PayloadAction<{ stockConfig: Stock.SettingItem[]; codeMap: Stock.CodeMap }>) {
      state.config = action.payload;
    },
    syncIndustryMapAction(state, action) {
      state.industryMap = action.payload;
    },
  },
});

export const { setStocksLoadingAction, syncStocksAction, syncStocksConfigAction, syncIndustryMapAction } = stockSlice.actions;

export const addStockAction = createAsyncThunk<void, Stock.SettingItem, AsyncThunkConfig>(
  'stock/addStockAction',
  (stock, { dispatch, getState }) => {
    try {
      const {
        stock: {
          config: { stockConfig },
        },
      } = getState();
      const cloneStockConfig = Utils.DeepCopy(stockConfig);
      const exist = cloneStockConfig.find((item) => stock.secid === item.secid);
      if (!exist) {
        cloneStockConfig.push(stock);
      }
      dispatch(setStockConfigAction(cloneStockConfig));
    } catch (error) {}
  }
);

export const updateStockAction = createAsyncThunk<void, { secid: string; type?: number }, AsyncThunkConfig>(
  'stock/updateStockAction',
  (stock, { dispatch, getState }) => {
    try {
      const {
        stock: {
          config: { stockConfig },
        },
      } = getState();
      stockConfig.forEach((item) => {
        if (stock.secid === item.secid) {
          if (stock.type !== undefined) {
            item.type = stock.type;
          }
        }
      });
      dispatch(setStockConfigAction(stockConfig));
    } catch (error) {}
  }
);

export const deleteStockAction = createAsyncThunk<void, string, AsyncThunkConfig>(
  'stock/deleteStockAction',
  (secid, { dispatch, getState }) => {
    try {
      const {
        stock: {
          config: { stockConfig },
        },
      } = getState();
      stockConfig.forEach((item, index) => {
        if (secid === item.secid) {
          const cloneStockSetting = JSON.parse(JSON.stringify(stockConfig));
          cloneStockSetting.splice(index, 1);
          dispatch(setStockConfigAction(cloneStockSetting));
        }
      });
    } catch (error) {}
  }
);

export const setStockConfigAction = createAsyncThunk<void, Stock.SettingItem[], AsyncThunkConfig>(
  'stock/setStockConfigAction',
  (stockConfig, { getState, dispatch }) => {
    try {
      const {
        stock: { stocks },
      } = getState();
      const codeMap = Utils.GetCodeMap(stockConfig, 'secid');
      dispatch(syncStocksConfigAction({ stockConfig, codeMap }));
      dispatch(syncStocksStateAction(stocks));
    } catch (error) {}
  }
);

export const sortStocksAction = createAsyncThunk<void, void, AsyncThunkConfig>('stock/sortStocksAction', (_, { dispatch, getState }) => {
  try {
    const {
      stock: {
        stocks,
        config: { codeMap },
      },
      sort: {
        sortMode: {
          stockSortMode: { type, order },
        },
      },
    } = getState();

    const sortList = sortStock({
      module: Enums.TabKeyType.Stock,
      codeMap,
      list: stocks,
      sortType: type,
      orderType: order,
    });

    dispatch(syncStocksStateAction(sortList));
  } catch (error) {}
});

export const sortStocksCachedAction = createAsyncThunk<void, Stock.ResponseItem[], AsyncThunkConfig>(
  'stock/sortStocksCachedAction',
  (responseStocks, { getState, dispatch }) => {
    try {
      const {
        stock: {
          stocks,
          config: { stockConfig },
        },
      } = getState();

      const stocksWithChached = mergeStateWithResponse({
        config: stockConfig,
        configKey: 'secid',
        stateKey: 'secid',
        state: stocks,
        response: responseStocks,
      });

      dispatch(syncStocksStateAction(stocksWithChached));
      dispatch(sortStocksAction());
    } catch (error) {}
  }
);

export const toggleStockCollapseAction = createAsyncThunk<void, Stock.ResponseItem & Stock.ExtraRow, AsyncThunkConfig>(
  'stock/toggleStockCollapseAction',
  (stock, { getState, dispatch }) => {
    try {
      const {
        stock: { stocks },
      } = getState();

      const cloneStocks = Utils.DeepCopy(stocks);
      cloneStocks.forEach((_) => {
        if (_.secid === stock.secid) {
          _.collapse = !stock.collapse;
        }
      });
      dispatch(syncStocksStateAction(cloneStocks));
    } catch (error) {}
  }
);

export const toggleAllStocksCollapseAction = createAsyncThunk<void, void, AsyncThunkConfig>(
  'stock/toggleAllStocksCollapseAction',
  (_, { getState, dispatch }) => {
    try {
      const {
        stock: { stocks },
      } = getState();
      const cloneStocks = Utils.DeepCopy(stocks);
      const expandAllStocks = stocks.every((_) => _.collapse);
      cloneStocks.forEach((_) => {
        _.collapse = !expandAllStocks;
      });
      dispatch(syncStocksStateAction(cloneStocks));
    } catch (error) {}
  }
);

export const syncStocksStateAction = createAsyncThunk<void, (Stock.ResponseItem & Stock.ExtraRow)[], AsyncThunkConfig>(
  'stock/syncStocksStateAction',
  (stocks, { getState, dispatch }) => {
    try {
      const {
        stock: {
          config: { codeMap },
        },
      } = getState();
      const filterStocks = stocks.filter(({ secid }) => codeMap[secid]);
      dispatch(syncStocksAction(filterStocks));
    } catch {}
  }
);

export const setIndustryMapAction = createAsyncThunk<void, { industrys: Stock.IndustryItem[]; secid: string }, AsyncThunkConfig>(
  'stock/setIndustryMapAction',
  ({ industrys, secid }, { getState, dispatch }) => {
    try {
      const {
        stock: { industryMap },
      } = getState();
      dispatch(syncIndustryMapAction({ ...industryMap, [secid]: industrys }));
    } catch (error) {}
  }
);

export default stockSlice.reducer;
