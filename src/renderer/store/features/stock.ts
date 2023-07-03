import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@/store';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';
import { UnitType } from 'dayjs';

export interface StockState {
  stocks: (Stock.ResponseItem & Stock.ExtraRow)[];
  stocksLoading: boolean;
  config: {
    stockConfig: Stock.SettingItem[];
    codeMap: Stock.CodeMap; // secid做key
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
    setStocksLoadingAction(state, { payload }: PayloadAction<boolean>) {
      state.stocksLoading = payload;
    },
    filterStocksAction(state) {
      state.stocks = state.stocks.filter(({ secid }) => state.config.codeMap[secid]);
    },
    syncStocksStateAction(state, { payload }: PayloadAction<StockState['stocks']>) {
      state.stocks = payload;
    },
    syncStocksConfigAction(state, { payload }: PayloadAction<StockState['config']>) {
      state.config = payload;
    },
    toggleStockCollapseAction(state, { payload }: PayloadAction<StockState['stocks'][number]>) {
      Helpers.Base.Collapse({
        list: state.stocks,
        key: 'secid',
        data: payload,
      });
    },
    toggleAllStocksCollapseAction(state) {
      Helpers.Base.CollapseAll({
        list: state.stocks,
      });
    },
    setIndustryMapAction(state, { payload }: PayloadAction<{ industrys: Stock.IndustryItem[]; secid: string }>) {
      state.industryMap = { ...state.industryMap, [payload.secid]: payload.industrys };
    },
  },
});

export const {
  setStocksLoadingAction,
  filterStocksAction,
  syncStocksStateAction,
  syncStocksConfigAction,
  setIndustryMapAction,
  toggleStockCollapseAction,
  toggleAllStocksCollapseAction,
} = stockSlice.actions;

export const addStockAction = createAsyncThunk<void, Stock.SettingItem, AsyncThunkConfig>(
  'stock/addStockAction',
  (stock, { dispatch, getState }) => {
    try {
      const {
        stock: {
          config: { stockConfig },
        },
      } = getState();

      const config = Helpers.Base.Add({
        list: Utils.DeepCopy(stockConfig),
        key: 'secid',
        data: stock,
      });

      dispatch(setStockConfigAction(config));
    } catch (error) {}
  }
);

export const updateStockAction = createAsyncThunk<
  void,
  Partial<Stock.SettingItem> & {
    secid: string;
  },
  AsyncThunkConfig
>('stock/updateStockAction', (stock, { dispatch, getState }) => {
  try {
    const {
      stock: {
        config: { stockConfig },
      },
    } = getState();

    const config = Helpers.Base.Update({
      list: Utils.DeepCopy(stockConfig),
      key: 'secid',
      data: stock,
    });

    dispatch(setStockConfigAction(config));
  } catch (error) {}
});

export const deleteStockAction = createAsyncThunk<void, string, AsyncThunkConfig>(
  'stock/deleteStockAction',
  (secid, { dispatch, getState }) => {
    try {
      const {
        stock: {
          config: { stockConfig },
        },
      } = getState();

      const config = Helpers.Base.Delete({
        list: Utils.DeepCopy(stockConfig),
        key: 'secid',
        data: secid,
      });

      dispatch(setStockConfigAction(config));
    } catch (error) {}
  }
);

export const sortStocksAction = createAsyncThunk<void, StockState['stocks'] | undefined, AsyncThunkConfig>(
  'stock/sortStocksAction',
  (list, { dispatch, getState }) => {
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

      const sortList = Helpers.Stock.SortStock({
        codeMap,
        list: list || stocks,
        sortType: type,
        orderType: order,
      });

      dispatch(syncStocksStateAction(sortList));
    } catch (error) {}
  }
);

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

      const stocksWithChached = Utils.MergeStateWithResponse({
        config: stockConfig,
        configKey: 'secid',
        stateKey: 'secid',
        state: stocks,
        response: responseStocks,
      });

      dispatch(sortStocksAction(stocksWithChached));
    } catch (error) {}
  }
);

export const setStockConfigAction = createAsyncThunk<void, Stock.SettingItem[], AsyncThunkConfig>(
  'stock/setStockConfigAction',
  (stockConfig, { dispatch }) => {
    try {
      const codeMap = Utils.GetCodeMap(stockConfig, 'secid');
      dispatch(syncStocksConfigAction({ stockConfig, codeMap }));

      dispatch(filterStocksAction());
    } catch (error) {}
  }
);

export default stockSlice.reducer;
