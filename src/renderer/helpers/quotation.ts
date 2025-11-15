import * as Services from '@lib/enh/services';
import * as Enums from '@/utils/enums';
import * as Adpters from '@/utils/adpters';

export async function GetQuotations() {
  // TODO:
  // 由于东财接口变动，一次性最多返回200条记录，所以需要发起3个请求，截止2025-2-17，一共是578个概念板块
  // 截止2025-2-17，暂时按类型查询
  // 截止2025-6-7，暂时按类型查询,加上分页，一次性最多返回100条记录
  const result = await Adpters.ChokeAllAdapter(
    [
      () => Services.Quotation.GetQuotationsFromEastmoney('t:1'),
      () => Services.Quotation.GetQuotationsFromEastmoney('t:2'),
      () => Services.Quotation.GetQuotationsFromEastmoney('t:3', 1),
      () => Services.Quotation.GetQuotationsFromEastmoney('t:3', 2),
      () => Services.Quotation.GetQuotationsFromEastmoney('t:3', 3),
    ],
    800
  );
  return result.flat();
}

export function SortQuotation({
  list,
  orderType,
  sortType,
}: {
  list: (Quotation.ResponseItem & Quotation.ExtraRow)[];
  sortType: Enums.QuotationSortType;
  orderType: Enums.SortOrderType;
}) {
  const sortList = list.slice();
  sortList.sort((a, b) => {
    const t = orderType === Enums.SortOrderType.Asc ? 1 : -1;
    switch (sortType) {
      case Enums.QuotationSortType.Zde:
        return (Number(a.zde) - Number(b.zde)) * t;
      case Enums.QuotationSortType.Zdd:
        return (Number(a.zdd) - Number(b.zdd)) * t;
      case Enums.QuotationSortType.Zsz:
        return (Number(a.zsz) - Number(b.zsz)) * t;
      case Enums.QuotationSortType.Zxj:
        return (Number(a.zxj) - Number(b.zxj)) * t;
      case Enums.QuotationSortType.Szjs:
        return (Number(a.szjs) - Number(b.szjs)) * t;
      case Enums.QuotationSortType.Xdjs:
        return (Number(a.xdjs) - Number(b.xdjs)) * t;
      case Enums.QuotationSortType.Name:
        return b.name.localeCompare(a.name, 'zh') * t;
      case Enums.QuotationSortType.Zdf:
      default:
        return (Number(a.zdf) - Number(b.zdf)) * t;
    }
  });
  return sortList;
}
