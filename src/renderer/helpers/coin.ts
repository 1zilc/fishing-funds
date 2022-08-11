import * as Services from '@/services';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';

export async function GetCoin(code: string) {
  return Services.Coin.GetDetailFromCoingecko(code);
}
export async function GetCoins(config: Coin.SettingItem[], unit: Enums.CoinUnitType) {
  const ids = config.map(({ code }) => code).join(',');
  const list = await Services.Coin.FromCoingecko(ids, unit);
  return list.filter(Utils.NotEmpty);
}

export function SortCoin({
  codeMap,
  list,
  orderType,
  sortType,
}: {
  list: (Coin.ResponseItem & Stock.ExtraRow)[];
  sortType: Enums.CoinSortType;
  codeMap: Coin.CodeMap;
  orderType: Enums.SortOrderType;
}) {
  const sortList = list.slice();
  sortList.sort((a, b) => {
    const t = orderType === Enums.SortOrderType.Asc ? 1 : -1;
    switch (sortType) {
      case Enums.CoinSortType.Price:
        return (Number(a.price) - Number(b.price)) * t;
      case Enums.CoinSortType.Zdf:
        return (Number(a.change24h) - Number(b.change24h)) * t;
      case Enums.CoinSortType.Volum:
        return (Number(a.vol24h) - Number(b.vol24h)) * t;
      case Enums.CoinSortType.Name:
        return b.code.localeCompare(a.code, 'zh') * t;
      case Enums.CoinSortType.Custom:
      default:
        return (codeMap[b.code!]?.originSort - codeMap[a.code!]?.originSort) * t;
    }
  });
  return sortList;
}
