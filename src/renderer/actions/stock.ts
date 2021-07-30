import { batch } from 'react-redux';

import { ThunkAction, PromiseAction } from '@/reducers/types';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';

export const SET_STOCKS_LOADING = 'SET_STOCKS_LOADING';
export const SYNC_STOCKS = 'SYNC_STOCKS';
export const SYNC_STOCK_CONFIG = 'SYNC_STOCK_CONFIG';

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
    } catch (error) {
      console.log('添加指数配置出错', error);
    }
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
    } catch (error) {
      console.log('设置股票配置出错', error);
    }
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
    } catch (error) {
      console.log('删除股票出错', error);
    }
  };
}

export function setStockConfigAction(stockConfig: Stock.SettingItem[]): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        stock: { stocks },
      } = getState();
      Utils.SetStorage(CONST.STORAGE.STOCK_SETTING, stockConfig);
      batch(() => {
        dispatch(syncStockConfigAction());
        dispatch(syncStocksStateAction(stocks));
      });
    } catch (error) {
      console.log('设置股票配置出错', error);
    }
  };
}

export function syncStockConfigAction(): ThunkAction {
  return (dispatch, getState) => {
    try {
      const config = Helpers.Stock.GetStockConfig();
      dispatch({ type: SYNC_STOCK_CONFIG, payload: config });
    } catch (error) {
      console.log('同步股票配置失败', error);
    }
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
    } catch (error) {
      console.log('股票排序错误', error);
    }
  };
}

export function loadStocksAction(): PromiseAction {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: SET_STOCKS_LOADING, payload: true });
      const responseStocks = (await Helpers.Stock.GetStocks()).filter(Utils.NotEmpty) as Stock.ResponseItem[];
      batch(() => {
        dispatch(sortStocksCachedAction(responseStocks));
        dispatch({ type: SET_STOCKS_LOADING, payload: false });
      });
    } catch (error) {
      console.log('加载股票失败', error);
      dispatch({ type: SET_STOCKS_LOADING, payload: false });
    }
  };
}

export function loadStocksWithoutLoadingAction(): PromiseAction {
  return async (dispatch, getState) => {
    try {
      const responseStocks = (await Helpers.Stock.GetStocks()).filter(Utils.NotEmpty) as Stock.ResponseItem[];
      dispatch(sortStocksCachedAction(responseStocks));
    } catch (error) {
      console.log('静默加载股票失败', error);
    }
  };
}

export function sortStocksCachedAction(responseStocks: Stock.ResponseItem[]): PromiseAction {
  return async (dispatch, getState) => {
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
    } catch (error) {
      console.log('股票带缓存排序出错', error);
    }
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
    } catch (error) {
      console.log('股票展开/折叠出错', error);
    }
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
    } catch (error) {
      console.log('全部股票展开/折叠出错', error);
    }
  };
}

export function syncStocksStateAction(stocks: (Stock.ResponseItem & Stock.ExtraRow)[]): ThunkAction {
  return (dispatch, getState) => {
    try {
      const { codeMap } = Helpers.Stock.GetStockConfig();
      const filterStocks = stocks.filter(({ secid }) => codeMap[secid]);
      dispatch({ type: SYNC_STOCKS, payload: filterStocks });
    } catch (error) {
      console.log('同步股票状态出错', error);
    }
  };
}
