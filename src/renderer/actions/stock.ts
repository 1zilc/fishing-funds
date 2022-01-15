import { batch } from 'react-redux';

import { ThunkAction } from '@/reducers/types';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';

export const SET_STOCKS_LOADING = 'SET_STOCKS_LOADING';
export const SYNC_STOCKS = 'SYNC_STOCKS';
export const SYNC_STOCK_CONFIG = 'SYNC_STOCK_CONFIG';
export const SET_INDUSTRY_MAP = 'SET_INDUSTRY_MAP';

export function addStockAction(stock: Stock.SettingItem): ThunkAction {
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

export function updateStockAction(stock: { secid: string; type?: number }): ThunkAction {
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

export function deleteStockAction(secid: string): ThunkAction {
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

export function setStockConfigAction(stockConfig: Stock.SettingItem[]): ThunkAction {
  return async (dispatch, getState) => {
    try {
      const {
        stock: { stocks },
      } = getState();
      const codeMap = Helpers.Stock.GetCodeMap(stockConfig);

      batch(() => {
        dispatch({ type: SYNC_STOCK_CONFIG, payload: { stockConfig, codeMap } });
        dispatch(syncStocksStateAction(stocks));
      });

      Utils.SetStorage(CONST.STORAGE.STOCK_SETTING, stockConfig);
    } catch (error) {}
  };
}

export function sortStocksAction(): ThunkAction {
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

export function sortStocksCachedAction(responseStocks: Stock.ResponseItem[]): ThunkAction {
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

export function toggleStockCollapseAction(stock: Stock.ResponseItem & Stock.ExtraRow): ThunkAction {
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

export function toggleAllStocksCollapseAction(): ThunkAction {
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

export function syncStocksStateAction(stocks: (Stock.ResponseItem & Stock.ExtraRow)[]): ThunkAction {
  return (dispatch, getState) => {
    try {
      const { codeMap } = Helpers.Stock.GetStockConfig();
      const filterStocks = stocks.filter(({ secid }) => codeMap[secid]);
      dispatch({ type: SYNC_STOCKS, payload: filterStocks });
    } catch (error) {}
  };
}

export function setIndustryMapAction(secid: string, industrys: Stock.IndustryItem[]): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        stock: { industryMap },
      } = getState();
      dispatch({ type: SET_INDUSTRY_MAP, payload: { ...industryMap, [secid]: industrys } });
    } catch (error) {}
  };
}
