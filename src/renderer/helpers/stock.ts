import * as Adapter from '@/utils/adpters';
import * as Services from '@/services';
import * as Utils from '@/utils';

export async function GetStocks(config: Stock.SettingItem[]) {
  const collectors = config.map(
    ({ secid }) =>
      () =>
        GetStock(secid)
  );
  const list = await Adapter.ChokeGroupAdapter<Stock.ResponseItem>(collectors, 5, 500);
  return list.filter(Utils.NotEmpty);
}

export async function GetStock(secid: string) {
  return Services.Stock.FromEastmoney(secid);
}
