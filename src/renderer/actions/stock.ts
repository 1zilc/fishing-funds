import { batch } from 'react-redux';

import { TypedThunk } from '@/store';
import { syncStocks, syncStocksConfig, setIndustryMap } from '@/store/features/stock';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';

export function addStockAction(stock: Stock.SettingItem): TypedThunk {
  return (dispatch, getState) => {
    try {
      const { stockConfig } = Helpers.Stock.GetStockConfig();
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
      const { stockConfig } = Helpers.Stock.GetStockConfig();
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
      const { stockConfig } = Helpers.Stock.GetStockConfig();

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
      const codeMap = Helpers.Stock.GetCodeMap(stockConfig);
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
        stock: { stocks },
      } = getState();
      const sortStocks = Helpers.Stock.SortStocks(stocks);
      dispatch(syncStocksStateAction(sortStocks));
    } catch (error) {}
  };
}

export function sortStocksCachedAction(responseStocks: Stock.ResponseItem[]): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        stock: { stocks },
      } = getState();
      const { stockConfig } = Helpers.Stock.GetStockConfig();

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
      const sortStocks = Helpers.Stock.SortStocks(stocksWithChached);
      dispatch(syncStocksStateAction(sortStocks));
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
      const { codeMap } = Helpers.Stock.GetStockConfig();
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
