import * as Adapters from '@/utils/adpters';
import * as Services from '@lib/enh/services';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';

export async function GetZindexs(config: Zindex.SettingItem[]) {
  const collectors = config.map(
    ({ code }) =>
      () =>
        GetZindex(code)
  );
  const list = await Adapters.ChokeGroupAdapter(collectors, 3, 800);
  return list.filter(Utils.NotEmpty);
}

export async function GetZindex(code: string) {
  return Services.Zindex.FromEastmoney(code);
}

export function SortZindex({
  codeMap,
  list,
  orderType,
  sortType,
}: {
  list: (Zindex.ResponseItem & Zindex.ExtraRow)[];
  sortType: Enums.ZindexSortType;
  codeMap: Zindex.CodeMap;
  orderType: Enums.SortOrderType;
}) {
  const sortList = list.slice();
  sortList.sort((a, b) => {
    const t = orderType === Enums.SortOrderType.Asc ? 1 : -1;
    switch (sortType) {
      case Enums.ZindexSortType.Zdd:
        return (a.zdd - b.zdd) * t;
      case Enums.ZindexSortType.Zdf:
        return (a.zdf - b.zdf) * t;
      case Enums.ZindexSortType.Zsz:
        return (a.zsz - b.zsz) * t;
      case Enums.ZindexSortType.Name:
        return b.name.localeCompare(a.name, 'zh') * t;
      case Enums.ZindexSortType.Custom:
      default:
        return (codeMap[b.code]?.originSort - codeMap[a.code]?.originSort) * t;
    }
  });
  return sortList;
}
