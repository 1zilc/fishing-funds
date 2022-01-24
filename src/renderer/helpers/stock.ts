import { batch } from 'react-redux';
import { store } from '@/.';
import { sortStocksCachedAction, SET_STOCKS_LOADING } from '@/actions/stock';
import * as Adapter from '@/utils/adpters';
import * as Services from '@/services';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Enums from '@/utils/enums';
import * as Helpers from '@/helpers';

export interface CodeStockMap {
  [index: string]: Stock.SettingItem & { originSort: number };
}

export function GetStockConfig() {
  const {
    stock: {
      config: { stockConfig },
    },
  } = store.getState();
  const codeMap = GetCodeMap(stockConfig);

  return { stockConfig, codeMap };
}

export function GetCodeMap(config: Stock.SettingItem[]) {
  return config.reduce((r, c, i) => {
    r[c.secid] = { ...c, originSort: i };
    return r;
  }, {} as CodeStockMap);
}

export async function GetStocks(config?: Stock.SettingItem[]) {
  const { stockConfig } = GetStockConfig();
  const collectors = (config || stockConfig).map(
    ({ secid }) =>
      () =>
        GetStock(secid)
  );
  return Adapter.ChokeGroupAdapter(collectors, 5, 500);
}

export async function GetStock(secid: string) {
  return Services.Stock.FromEastmoney(secid);
}

export function SortStocks(responseStocks: Stock.ResponseItem[]) {
  const {
    sort: {
      sortMode: {
        stockSortMode: { type: stockSortType, order: stockSortorder },
      },
    },
  } = store.getState();
  const { codeMap } = GetStockConfig();
  const sortList = Utils.DeepCopy(responseStocks);

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

  return sortList;
}

export async function LoadStocks(loading: boolean) {
  try {
    store.dispatch({ type: SET_STOCKS_LOADING, payload: loading && true });
    const responseStocks = (await GetStocks()).filter(Utils.NotEmpty) as Stock.ResponseItem[];
    batch(() => {
      store.dispatch(sortStocksCachedAction(responseStocks));
      store.dispatch({ type: SET_STOCKS_LOADING, payload: false });
    });
  } catch (error) {
    store.dispatch({ type: SET_STOCKS_LOADING, payload: false });
  }
}
