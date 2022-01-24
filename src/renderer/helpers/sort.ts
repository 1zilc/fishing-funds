import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import * as CONST from '@/constants';

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

export interface StockSortType {
  type: Enums.StockSortType;
  order: Enums.SortOrderType;
}

export interface CoinSortType {
  type: Enums.CoinSortType;
  order: Enums.SortOrderType;
}

export const fundSortModeOptions: Option.EnumsOption<Enums.FundSortType>[] = [
  { key: Enums.FundSortType.Custom, value: '自定义' },
  { key: Enums.FundSortType.Growth, value: '今日涨幅' },
  { key: Enums.FundSortType.Cost, value: '持有成本' },
  { key: Enums.FundSortType.Money, value: '今日收益' },
  { key: Enums.FundSortType.Estimate, value: '今日总值' },
  { key: Enums.FundSortType.Income, value: '持有收益' },
  { key: Enums.FundSortType.IncomeRate, value: '持有收益率' },
  { key: Enums.FundSortType.Name, value: '名称（A-Z）' },
];

export const zindexSortModeOptions: Option.EnumsOption<Enums.ZindexSortType>[] = [
  { key: Enums.ZindexSortType.Custom, value: '自定义' },
  { key: Enums.ZindexSortType.Zdd, value: '涨跌点' },
  { key: Enums.ZindexSortType.Zdf, value: '涨跌幅' },
  { key: Enums.ZindexSortType.Zsz, value: '指数值' },
  { key: Enums.ZindexSortType.Name, value: '名称（A-Z）' },
];

export const quotationSortModeOptions: Option.EnumsOption<Enums.QuotationSortType>[] = [
  { key: Enums.QuotationSortType.Zdf, value: '涨跌幅' },
  { key: Enums.QuotationSortType.Zde, value: '涨跌额' },
  { key: Enums.QuotationSortType.Zdd, value: '涨跌点' },
  { key: Enums.QuotationSortType.Zsz, value: '总市值' },
  { key: Enums.QuotationSortType.Zxj, value: '最新价' },
  { key: Enums.QuotationSortType.Szjs, value: '上涨家数' },
  { key: Enums.QuotationSortType.Xdjs, value: '下跌家数' },
  { key: Enums.QuotationSortType.Name, value: '名称（A-Z）' },
];

export const stockSortModeOptions: Option.EnumsOption<Enums.StockSortType>[] = [
  { key: Enums.StockSortType.Custom, value: '自定义' },
  { key: Enums.StockSortType.Zdd, value: '涨跌点' },
  { key: Enums.StockSortType.Zdf, value: '涨跌幅' },
  { key: Enums.StockSortType.Zx, value: '最新值' },
  { key: Enums.StockSortType.Name, value: '名称（A-Z）' },
];

export const coinSortModeOptions: Option.EnumsOption<Enums.CoinSortType>[] = [
  { key: Enums.CoinSortType.Custom, value: '自定义' },
  { key: Enums.CoinSortType.Price, value: '价格' },
  { key: Enums.CoinSortType.Zdf, value: '24H涨跌幅' },
  { key: Enums.CoinSortType.Volum, value: '24H交易量' },
  { key: Enums.CoinSortType.Name, value: '名称（A-Z）' },
];

export function GetSortConfig() {
  const fundSortModeOptionsMap = fundSortModeOptions.reduce((r, c) => {
    r[c.key] = c;
    return r;
  }, {} as Record<Enums.FundSortType, Option.EnumsOption<Enums.FundSortType>>);

  const zindexSortModeOptionsMap = zindexSortModeOptions.reduce((r, c) => {
    r[c.key] = c;
    return r;
  }, {} as Record<Enums.ZindexSortType, Option.EnumsOption<Enums.ZindexSortType>>);

  const quotationSortModeOptionsMap = quotationSortModeOptions.reduce((r, c) => {
    r[c.key] = c;
    return r;
  }, {} as Record<Enums.QuotationSortType, Option.EnumsOption<Enums.QuotationSortType>>);

  const stockSortModeOptionsMap = stockSortModeOptions.reduce((r, c) => {
    r[c.key] = c;
    return r;
  }, {} as Record<Enums.StockSortType, Option.EnumsOption<Enums.StockSortType>>);

  const coinSortModeOptionsMap = coinSortModeOptions.reduce((r, c) => {
    r[c.key] = c;
    return r;
  }, {} as Record<Enums.CoinSortType, Option.EnumsOption<Enums.CoinSortType>>);

  return {
    fundSortModeOptions,
    zindexSortModeOptions,
    quotationSortModeOptions,
    stockSortModeOptions,
    coinSortModeOptions,
    fundSortModeOptionsMap,
    zindexSortModeOptionsMap,
    quotationSortModeOptionsMap,
    stockSortModeOptionsMap,
    coinSortModeOptionsMap,
  };
}
