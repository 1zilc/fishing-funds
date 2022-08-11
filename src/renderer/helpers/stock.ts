import * as Adapter from '@/utils/adpters';
import * as Services from '@/services';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';

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

export function SortStock({
  codeMap,
  list,
  orderType,
  sortType,
}: {
  list: (Stock.ResponseItem & Stock.ExtraRow)[];
  sortType: Enums.StockSortType;
  codeMap: Stock.CodeMap;
  orderType: Enums.SortOrderType;
}) {
  const sortList = list.slice();
  sortList.sort((a, b) => {
    const t = orderType === Enums.SortOrderType.Asc ? 1 : -1;
    switch (sortType) {
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
