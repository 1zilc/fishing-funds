import registerPromiseWorker from 'promise-worker/register';
import * as Enums from '@/utils/enums';
import { CalcFund } from '@/helpers/fund/utils';

interface WorkerRecieveData {
  module: Enums.TabKeyType;
  list: any[];
  orderType: Enums.SortOrderType;
  sortType: any;
  codeMap: any;
}

interface SortFundPrams extends WorkerRecieveData {
  list: (Fund.ResponseItem & Fund.FixData & Fund.ExtraRow)[];
  sortType: Enums.FundSortType;
  codeMap: Fund.CodeMap;
}

registerPromiseWorker(function (data: WorkerRecieveData) {
  console.log(666);
  switch (data.module) {
    case Enums.TabKeyType.Funds:
      return sortFund(data);
  }
});

function sortFund({ codeMap, list, orderType, sortType }: SortFundPrams) {
  const sortList = list.slice();

  sortList.sort((a, b) => {
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

  return sortList;
}
