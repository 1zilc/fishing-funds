import { batch } from 'react-redux';
import { AnyAction } from 'redux';

import { Dispatch, GetState, ThunkAction, PromiseAction } from '@/reducers/types';
import * as Adapter from '@/utils/adpters';
import * as Services from '@/services';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Enums from '@/utils/enums';
import * as Helpers from '@/helpers';

export const SET_STOCKS_LOADING = 'SET_STOCKS_LOADING';
export const SYNC_STOCKS = 'SYNC_STOCKS';
export const SYNC_STOCK_CONFIG = 'SYNC_STOCK_CONFIG';

export function addStockAction(stock: Stock.SettingItem): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        stock: {
          config: { stockConfig },
        },
      } = getState();
      const cloneStockConfig = Utils.DeepCopy(stockConfig);
      const exist = cloneStockConfig.find((item) => stock.secid === item.secid);
      if (exist) {
        cloneStockConfig.push(stock);
      }
      dispatch(setStockConfigAction(cloneStockConfig));
    } catch (error) {
      console.log('添加指数配置出错', error);
    }
  };
}

export function updateStockAction(stock: { secid: string; type?: number }) {
  return (dispatch: Dispatch, getState: GetState) => {
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
    } catch (error) {
      console.log('设置股票配置出错', error);
    }
  };
}

export function deleteStockAction(secid: string): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
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
    } catch (error) {
      console.log('删除股票出错', error);
    }
  };
}

export function setStockConfigAction(stockConfig: Stock.SettingItem[]): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    try {
      Utils.SetStorage(CONST.STORAGE.STOCK_SETTING, stockConfig);
      dispatch(syncStockConfigAction());
    } catch (error) {
      console.log('设置股票配置出错', error);
    }
  };
}

export function syncStockConfigAction(): AnyAction {
  const config = Helpers.Stock.GetStockConfig();
  return {
    type: SYNC_STOCK_CONFIG,
    payload: config,
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

export function loadStocksAction() {
  return async (dispatch: Dispatch, getState: GetState) => {
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

export function loadStocksWithoutLoadingAction() {
  return async (dispatch: Dispatch, getState: GetState) => {
    try {
      const responseStocks = (await Helpers.Stock.GetStocks()).filter(Utils.NotEmpty) as Stock.ResponseItem[];
      dispatch(sortStocksCachedAction(responseStocks));
    } catch (error) {
      console.log('静默加载股票失败', error);
    }
  };
}

export function sortStocksCachedAction(responseStocks: Stock.ResponseItem[]) {
  return async (dispatch: Dispatch, getState: GetState) => {
    try {
      const {
        stock: {
          stocks,
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
      const sortStocks = Helpers.Stock.SortStocks(stocksWithChached);
      dispatch(syncStocksStateAction(sortStocks));
    } catch (error) {
      console.log('股票带缓存排序出错', error);
    }
  };
}

export function toggleStockCollapseAction(stock: Stock.ResponseItem & Stock.ExtraRow) {
  return async (dispatch: Dispatch, getState: GetState) => {
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

export function toggleAllStocksCollapseAction() {
  return async (dispatch: Dispatch, getState: GetState) => {
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

export function syncStocksStateAction(stock: (Stock.ResponseItem & Stock.ExtraRow)[]): AnyAction {
  return { type: SYNC_STOCKS, payload: stock };
}
