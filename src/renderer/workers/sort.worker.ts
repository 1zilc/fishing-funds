import registerPromiseWorker from 'promise-worker/register';
import * as Enums from '@/utils/enums';
import { CalcFund } from '@/helpers/fund/utils';

interface WorkerRecieveParams {
  module: Enums.TabKeyType;
  list: any[];
  orderType: Enums.SortOrderType;
  sortType: any;
  codeMap: any;
}

interface SortFundPrams extends WorkerRecieveParams {
  list: (Fund.ResponseItem & Fund.FixData & Fund.ExtraRow)[];
  sortType: Enums.FundSortType;
  codeMap: Fund.CodeMap;
}
interface SortZindexPrams extends WorkerRecieveParams {
  list: (Zindex.ResponseItem & Zindex.ExtraRow)[];
  sortType: Enums.ZindexSortType;
  codeMap: Zindex.CodeMap;
}
interface SortQuotationPrams extends WorkerRecieveParams {
  list: (Quotation.ResponseItem & Quotation.ExtraRow)[];
  sortType: Enums.QuotationSortType;
}
interface SortStockPrams extends WorkerRecieveParams {
  list: (Stock.ResponseItem & Stock.ExtraRow)[];
  sortType: Enums.StockSortType;
  codeMap: Stock.CodeMap;
}
interface SortCoinPrams extends WorkerRecieveParams {
  list: (Coin.ResponseItem & Stock.ExtraRow)[];
  sortType: Enums.CoinSortType;
  codeMap: Coin.CodeMap;
}

registerPromiseWorker((params: WorkerRecieveParams) => {
  switch (params.module) {
    case Enums.TabKeyType.Fund:
      return sortFund(params);
    case Enums.TabKeyType.Zindex:
      return sortZindex(params);
    case Enums.TabKeyType.Quotation:
      return sortQuotation(params);
    case Enums.TabKeyType.Stock:
      return sortStock(params);
    case Enums.TabKeyType.Coin:
      return sortCoin(params);
    default:
      return params.list;
  }
});

function sortFund({ codeMap, list, orderType, sortType }: SortFundPrams) {
  list.sort((a, b) => {
    const calcA = CalcFund(a, codeMap);
    const calcB = CalcFund(b, codeMap);
    const t = orderType === Enums.SortOrderType.Asc ? 1 : -1;
    switch (sortType) {
      case Enums.FundSortType.Growth:
        return (Number(calcA.gszzl) - Number(calcB.gszzl)) * t;
      case Enums.FundSortType.Cost:
        return (Number(calcA.cbje || 0) - Number(calcB.cbje || 0)) * t;
      case Enums.FundSortType.Money:
        return (Number(calcA.jrsygz) - Number(calcB.jrsygz)) * t;
      case Enums.FundSortType.Estimate:
        return (Number(calcA.gszz) - Number(calcB.gszz)) * t;
      case Enums.FundSortType.Income:
        return (Number(calcA.cysy || 0) - Number(calcB.cysy || 0)) * t;
      case Enums.FundSortType.IncomeRate:
        return (Number(calcA.cysyl) - Number(calcB.cysyl || 0)) * t;
      case Enums.FundSortType.Name:
        return calcA.name!.localeCompare(calcB.name!, 'zh') * t;
      case Enums.FundSortType.Custom:
      default:
        return (codeMap[b.fundcode!]?.originSort - codeMap[a.fundcode!]?.originSort) * t;
    }
  });
  return list;
}
function sortZindex({ codeMap, list, orderType, sortType }: SortZindexPrams) {
  list.sort((a, b) => {
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
  return list;
}
function sortQuotation({ list, orderType, sortType }: SortQuotationPrams) {
  list.sort((a, b) => {
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
  return list;
}
function sortStock({ codeMap, list, orderType, sortType }: SortStockPrams) {
  list.sort((a, b) => {
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
  return list;
}
function sortCoin({ codeMap, list, orderType, sortType }: SortCoinPrams) {
  list.sort((a, b) => {
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
  return list;
}
