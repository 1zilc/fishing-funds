import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { batch } from 'react-redux';
import { TypedThunk } from '@/store';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
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
export function addStockAction(stock: Stock.SettingItem): TypedThunk {
  return (dispatch, getState) => {
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
  };
}

export function updateStockAction(stock: { secid: string; type?: number }): TypedThunk {
  return (dispatch, getState) => {
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
  };
}

export function deleteStockAction(secid: string): TypedThunk {
  return (dispatch, getState) => {
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
  };
}

export function setStockConfigAction(stockConfig: Stock.SettingItem[]): TypedThunk {
  return async (dispatch, getState) => {
    try {
      const {
        stock: { stocks },
      } = getState();
      const codeMap = Utils.GetCodeMap(stockConfig, 'secid');
      await Utils.SetStorage(CONST.STORAGE.STOCK_SETTING, stockConfig);
      batch(() => {
        dispatch(syncStocksConfig({ stockConfig, codeMap }));
        dispatch(syncStocksStateAction(stocks));
      });
    } catch (error) {}
  };
}

export function sortStocksAction(): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        stock: {
          stocks,
          config: { codeMap },
        },
        sort: {
          sortMode: {
            stockSortMode: { type: stockSortType, order: stockSortorder },
          },
        },
      } = getState();

      const sortList = stocks.slice();

      sortList.sort((a, b) => {
        const t = stockSortorder === Enums.SortOrderType.Asc ? 1 : -1;
        switch (stockSortType) {
          case Enums.StockSortType.Zdd:
            return (Number(a.zdd) - Number(b.zdd)) * t;
          case Enums.StockSortType.Zdf:
            return (Number(a.zdf) - Number(b.zdf)) * t;
          case Enums.StockSortType.Zx:
            return (Number(a.zx) - Number(b.zx)) * t;
          case Enums.StockSortType.Name:
            return b.name.localeCompare(a.name, 'zh') * t;
          case Enums.StockSortType.Custom:
          default:
            return (codeMap[b.secid!]?.originSort - codeMap[a.secid!]?.originSort) * t;
        }
      });

      dispatch(syncStocksStateAction(sortList));
    } catch (error) {}
  };
}

export function sortStocksCachedAction(responseStocks: Stock.ResponseItem[]): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        stock: { stocks },
      } = getState();
      const {
        stock: {
          config: { stockConfig },
        },
      } = getState();

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
      batch(() => {
        dispatch(syncStocksStateAction(stocksWithChached));
        dispatch(sortStocksAction());
      });
    } catch (error) {}
  };
}

export function toggleStockCollapseAction(stock: Stock.ResponseItem & Stock.ExtraRow): TypedThunk {
  return (dispatch, getState) => {
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
  };
}

export function toggleAllStocksCollapseAction(): TypedThunk {
  return async (dispatch, getState) => {
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
  };
}

export function syncStocksStateAction(stocks: (Stock.ResponseItem & Stock.ExtraRow)[]): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        stock: {
          config: { codeMap },
        },
      } = getState();
      const filterStocks = stocks.filter(({ secid }) => codeMap[secid]);
      dispatch(syncStocks(filterStocks));
    } catch (error) {}
  };
}

export function setIndustryMapAction(secid: string, industrys: Stock.IndustryItem[]): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        stock: { industryMap },
      } = getState();
      dispatch(setIndustryMap({ ...industryMap, [secid]: industrys }));
    } catch (error) {}
  };
}

export default stockSlice.reducer;
