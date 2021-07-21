import { batch } from 'react-redux';

import { Dispatch, GetState } from '@/reducers/types';
import * as Adapter from '@/utils/adpters';
import * as Services from '@/services';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Enums from '@/utils/enums';

export const SET_STOCKS = 'SET_STOCKS';
export const SET_STOCKS_LOADING = 'SET_STOCKS_LOADING';
export const TOGGLE_STOCK_COLLAPSE = 'TOGGLE_STOCK_COLLAPSE';
export const TOGGLE_STOCKS_COLLAPSE = 'TOGGLE_STOCKS_COLLAPSE';
export const SORT_STOCKS = 'SORT_STOCKS';
export const SORT_STOCKS_WITH_COLLAPSE_CHACHED =
  'SORT_STOCKS_WITH_COLLAPSE_CHACHED';
export interface CodeStockMap {
  [index: string]: Stock.SettingItem & { originSort: number };
}

export function getStockConfig() {
  const stockConfig: Stock.SettingItem[] = Utils.GetStorage(
    CONST.STORAGE.STOCK_SETTING,
    []
  );
  const codeMap = stockConfig.reduce((r, c, i) => {
    r[c.secid] = { ...c, originSort: i };
    return r;
  }, {} as CodeStockMap);

  return { stockConfig, codeMap };
}

export function addStock(stock: Stock.SettingItem) {
  const { stockConfig } = getStockConfig();
  const notExist =
    stockConfig.filter((item) => stock.secid === item.secid).length === 0;
  if (notExist) {
    setStockConfig([...stockConfig, stock]);
  }
}

export function updateStock(stock: { secid: string; type?: number }) {
  const { stockConfig } = getStockConfig();
  stockConfig.forEach((item) => {
    if (stock.secid === item.secid) {
      if (stock.type !== undefined) {
        item.type = stock.type;
      }
    }
  });
  setStockConfig(stockConfig);
}

export async function getStocks(config?: Stock.SettingItem[]) {
  const { stockConfig } = getStockConfig();
  const collectors = (config || stockConfig).map(
    ({ secid }) =>
      () =>
        getStock(secid)
  );
  return Adapter.ChokeGroupAdapter(collectors, 5, 500);
}

export async function getStock(secid: string) {
  return Services.Stock.FromEastmoney(secid);
}

export async function setStockConfig(stockConfig: Stock.SettingItem[]) {
  Utils.SetStorage(CONST.STORAGE.STOCK_SETTING, stockConfig);
}

export function deleteStock(secid: string) {
  const { stockConfig } = getStockConfig();
  stockConfig.forEach((item, index) => {
    if (secid === item.secid) {
      const cloneStockSetting = JSON.parse(JSON.stringify(stockConfig));
      cloneStockSetting.splice(index, 1);
      setStockConfig(cloneStockSetting);
    }
  });
}

export function loadStocks() {
  return async (dispatch: Dispatch, getState: GetState) => {
    try {
      dispatch({ type: SET_STOCKS_LOADING, payload: true });
      const stocks = await getStocks();
      batch(() => {
        dispatch({
          type: SORT_STOCKS_WITH_COLLAPSE_CHACHED,
          payload: stocks,
        });
        dispatch({ type: SET_STOCKS_LOADING, payload: false });
      });
    } catch {
      dispatch({ type: SET_STOCKS_LOADING, payload: false });
    }
  };
}

export function loadStocksWithoutLoading() {
  return async (dispatch: Dispatch, getState: GetState) => {
    try {
      const stocks = await getStocks();
      batch(() => {
        dispatch({
          type: SORT_STOCKS_WITH_COLLAPSE_CHACHED,
          payload: stocks,
        });
      });
    } catch (error) {
      console.log('静默加载股票失败', error);
    }
  };
}
