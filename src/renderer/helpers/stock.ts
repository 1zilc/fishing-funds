import * as Adapter from '@/utils/adpters';
import * as Services from '@/services';
import * as Utils from '@/utils';

export async function GetStocks(config: Stock.SettingItem[]) {
  const collectors = config.map(
    ({ secid }) =>
      () =>
        GetStock(secid)
  );
  const list = await Adapter.ChokeGroupAdapter(collectors, 5, 500);
  return list.filter(Utils.NotEmpty);
}

export async function GetStock(secid: string) {
  return Services.Stock.FromEastmoney(secid);
}

export function MergeStateStocks(
  config: Stock.SettingItem[],
  oldStocks: (Stock.ResponseItem & Stock.ExtraRow)[],
  newStocks: Stock.ResponseItem[]
) {
  const oldStocksCodeToMap = Utils.GetCodeMap(oldStocks, 'secid');
  const newStocksCodeToMap = Utils.GetCodeMap(newStocks, 'secid');

  const stocksWithChachedCodeToMap = config.reduce((map, { code }) => {
    const oldFund = oldStocksCodeToMap[code];
    const newFund = newStocksCodeToMap[code];
    if (oldFund || newFund) {
      map[code] = { ...(oldFund || {}), ...(newFund || {}) };
    }
    return map;
  }, {} as Record<string, Stock.ResponseItem & Stock.ExtraRow>);

  const stocksWithChached = Object.values(stocksWithChachedCodeToMap);

  return stocksWithChached;
}
