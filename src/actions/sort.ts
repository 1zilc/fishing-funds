import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import CONST_STORAGE from '@/constants/storage.json';

export interface FundSortMode {
  type: Enums.FundSortType;
  order: Enums.SortOrderType;
}
export interface ZindexSortMode {
  type: Enums.ZindexSortType;
  order: Enums.SortOrderType;
}
export interface QuotationSortType {
  type: Enums.QuotationSortType;
  order: Enums.SortOrderType;
}

export const fundSortModeOptions: Option.EnumsOption<Enums.FundSortType>[] = [
  { key: Enums.FundSortType.Default, value: '默认' },
  { key: Enums.FundSortType.Growth, value: '今日涨幅' },
  { key: Enums.FundSortType.Block, value: '持有份额' },
  { key: Enums.FundSortType.Money, value: '今日收益' },
  { key: Enums.FundSortType.Estimate, value: '今日估值' },
];

export const zindexSortModeOptions: Option.EnumsOption<Enums.ZindexSortType>[] = [
  { key: Enums.ZindexSortType.Custom, value: '自定义' },
  { key: Enums.ZindexSortType.Zdd, value: '涨跌点' },
  { key: Enums.ZindexSortType.Zdf, value: '涨跌幅' },
  { key: Enums.ZindexSortType.Zsz, value: '指数值' },
];

export const quotationSortModeOptions: Option.EnumsOption<Enums.QuotationSortType>[] = [
  { key: Enums.QuotationSortType.Zdf, value: '涨跌幅' },
  { key: Enums.QuotationSortType.Zde, value: '涨跌额' },
  { key: Enums.QuotationSortType.Zsz, value: '总市值' },
  { key: Enums.QuotationSortType.Zxj, value: '最新价' },
  { key: Enums.QuotationSortType.Szjs, value: '上涨家数' },
  { key: Enums.QuotationSortType.Xdjs, value: '下跌家数' },
];

export function getSortConfig() {
  const fundSortModeOptionsMap = fundSortModeOptions.reduce((r, c) => {
    r[c.key] = c;
    return r;
  }, {} as any);

  const zindexSortModeOptionsMap = zindexSortModeOptions.reduce((r, c) => {
    r[c.key] = c;
    return r;
  }, {} as any);

  const quotationSortModeOptionsMap = quotationSortModeOptions.reduce(
    (r, c) => {
      r[c.key] = c;
      return r;
    },
    {} as any
  );

  return {
    fundSortModeOptions,
    zindexSortModeOptions,
    quotationSortModeOptions,
    fundSortModeOptionsMap,
    zindexSortModeOptionsMap,
    quotationSortModeOptionsMap,
  };
}

export function getSortMode() {
  const fundSortMode: FundSortMode = Utils.GetStorage(
    CONST_STORAGE.FUND_SORT_MODE,
    {
      type: Enums.FundSortType.Default,
      order: Enums.SortOrderType.Desc,
    }
  );
  const zindexSortMode: ZindexSortMode = Utils.GetStorage(
    CONST_STORAGE.ZINDEX_SORT_MODE,
    {
      type: Enums.ZindexSortType.Custom,
      order: Enums.SortOrderType.Desc,
    }
  );
  const quotationSortMode: QuotationSortType = Utils.GetStorage(
    CONST_STORAGE.QUOTATION_SORT_MODE,
    {
      type: Enums.ZindexSortType.Zdf,
      order: Enums.SortOrderType.Desc,
    }
  );
  return { fundSortMode, zindexSortMode, quotationSortMode };
}

export function setFundSortMode(fundSortMode: {
  type?: Enums.FundSortType;
  order?: Enums.SortOrderType;
}) {
  const { fundSortMode: _ } = getSortMode();
  Utils.SetStorage(CONST_STORAGE.FUND_SORT_MODE, {
    ..._,
    ...fundSortMode,
  });
}

export function setZindexSortMode(zindexSortMode: {
  type?: Enums.ZindexSortType;
  order?: Enums.SortOrderType;
}) {
  const { zindexSortMode: _ } = getSortMode();
  Utils.SetStorage(CONST_STORAGE.ZINDEX_SORT_MODE, {
    ..._,
    ...zindexSortMode,
  });
}

export function setQuotationSortMode(quotationSortMode: {
  type?: Enums.QuotationSortType;
  order?: Enums.SortOrderType;
}) {
  const { zindexSortMode: _ } = getSortMode();
  Utils.SetStorage(CONST_STORAGE.QUOTATION_SORT_MODE, {
    ..._,
    ...quotationSortMode,
  });
}

export function troggleFundSortOrder() {
  const { fundSortMode } = getSortMode();
  const { order } = fundSortMode;
  Utils.SetStorage(CONST_STORAGE.FUND_SORT_MODE, {
    ...fundSortMode,
    order:
      order === Enums.SortOrderType.Asc
        ? Enums.SortOrderType.Desc
        : Enums.SortOrderType.Asc,
  });
}

export function troggleZindexSortOrder() {
  const { zindexSortMode } = getSortMode();
  const { order } = zindexSortMode;
  Utils.SetStorage(CONST_STORAGE.ZINDEX_SORT_MODE, {
    ...zindexSortMode,
    order:
      order === Enums.SortOrderType.Asc
        ? Enums.SortOrderType.Desc
        : Enums.SortOrderType.Asc,
  });
}

export function troggleQuotationSortOrder() {
  const { quotationSortMode } = getSortMode();
  const { order } = quotationSortMode;
  Utils.SetStorage(CONST_STORAGE.QUOTATION_SORT_MODE, {
    ...quotationSortMode,
    order:
      order === Enums.SortOrderType.Asc
        ? Enums.SortOrderType.Desc
        : Enums.SortOrderType.Asc,
  });
}
