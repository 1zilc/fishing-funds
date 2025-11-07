import NP from 'number-precision';
import { defaultWallet } from '@/store/features/wallet';
import * as Adapter from '@/utils/adpters';
import * as Services from '@/services';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';

export function GetStockConfig(walletCode: string, walletsConfig: Wallet.SettingItem[]) {
  const walletConfig = walletsConfig.find(({ code }) => code === walletCode) || defaultWallet;
  const stockConfig = walletConfig.stocks || [];
  const codeMap = Utils.GetCodeMap(stockConfig, 'secid');
  return { stockConfig, codeMap };
}

export function CalcStock(stock: Stock.ResponseItem, codeMap: Stock.CodeMap) {
  const config = codeMap[stock.secid];
  const cyfe = config?.cyfe || 0;
  const cbj = config?.cbj;
  const memo = config?.memo;

  const gsz = stock.zx;
  const dwjz = stock.zs;
  // 判断 gsz 是否为有效数字（先转为字符串再比较）
  const gszStr = String(gsz);
  const isValidGsz = gsz !== undefined && gsz !== null && gszStr !== '' && gszStr !== 'None' && !isNaN(Number(gsz));
  const priceForCalc = isValidGsz ? Number(gsz) : Number(dwjz);

  const bjz = NP.minus(priceForCalc, dwjz) || 0;
  const jrsygz = NP.times(cyfe, bjz);
  const gszz = NP.times(priceForCalc, cyfe);
  const cyje = NP.times(dwjz, cyfe);
  const cbje = cbj && NP.times(cbj, cyfe);
  const cysyl = cbj && NP.divide(NP.minus(priceForCalc, cbj), cbj, 0.01);
  const cysy = cbj && NP.times(NP.minus(priceForCalc, cbj), cyfe);
  const gszzl = stock.zdf; // 估算收益率
  const gscysyl = cbj && cbj > 0 ? cysyl?.toFixed(2) : '';

  return {
    ...stock,
    cyfe, // 持有份额
    cbj, // 成本价
    memo, // 备注
    cbje, // 成本金额
    cyje, // 持有金额
    cysyl, // 持有收益率
    cysy, // 持有收益
    bjz, // 比较值
    jrsygz, // 今日收益估值
    gszz, // 估算
    gsz, // 估算值（最新）
    dwjz, // 单位净值（上一次）
    gszzl, // 估算收益率
    gscysyl, // 估算持有收益率
  };
}

export function CalcStocks(stocks: Stock.ResponseItem[] = [], codeMap: Stock.CodeMap) {
  const [zje, gszje, sygz, cysy, cbje] = stocks.reduce(
    ([a, b, c, d, e], stock) => {
      const calcStockResult = CalcStock(stock, codeMap);
      const { bjz, gsz, cysy, cbje } = calcStockResult; // 比较值（估算值 - 持有净值）
      const cyfe = codeMap[stock.secid]?.cyfe || 0; // 持有份额
      const jrsygz = NP.times(cyfe, bjz); // 今日收益估值（持有份额 * 比较值）
      const gszz = NP.times(gsz, cyfe); // 估算总值 (持有份额 * 估算值)
      const dwje = NP.times(stock.zs!, cyfe); // 当前金额 (持有份额 * 当前净值)
      return [a + dwje, b + gszz, c + jrsygz, d + (cysy || 0), e + (cbje || 0)];
    },
    [0, 0, 0, 0, 0]
  );
  const gssyl = zje ? NP.times(NP.divide(sygz, zje), 100) : 0;
  const cysyl = cbje ? NP.times(NP.divide(cysy, cbje), 100) : 0;
  // zje: number; // 当前总金额
  // gszje: number; // 估算总金额
  // sygz: number; // 估算总收益
  // gssyl: number; // 估算总收益率
  // cysy:number; // 持有收益
  // cysyl:number; // 持有收益率
  return { zje, gszje, sygz, gssyl, cysy, cysyl };
}

export async function GetStocks(config: Stock.SettingItem[]) {
  const collectors = config.map(
    ({ secid }) =>
      () =>
        GetStock(secid)
  );
  const list = await Adapter.ChokeGroupAdapter(collectors, 3, 800);
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
    const calcA = CalcStock(a, codeMap);
    const calcB = CalcStock(b, codeMap);
    const t = orderType === Enums.SortOrderType.Asc ? 1 : -1;

    switch (sortType) {
      case Enums.StockSortType.Zdf:
        return (Number(calcA.zdf) - Number(calcB.zdf)) * t;
      case Enums.StockSortType.Zx:
        return (Number(calcA.zx) - Number(calcB.zx)) * t;
      case Enums.StockSortType.Cost:
        return (Number(calcA.cbje || 0) - Number(calcB.cbje || 0)) * t;
      case Enums.StockSortType.Money:
        return (Number(calcA.jrsygz) - Number(calcB.jrsygz)) * t;
      case Enums.StockSortType.Estimate:
        return (Number(calcA.gszz) - Number(calcB.gszz)) * t;
      case Enums.StockSortType.Income:
        return (Number(calcA.cysy || 0) - Number(calcB.cysy || 0)) * t;
      case Enums.StockSortType.IncomeRate:
        return (Number(calcA.cysyl || 0) - Number(calcB.cysyl || 0)) * t;
      case Enums.StockSortType.Name:
        return b.name.localeCompare(a.name, 'zh') * t;
      case Enums.StockSortType.Custom:
      default:
        return (codeMap[b.secid!]?.originSort - codeMap[a.secid!]?.originSort) * t;
    }
  });
  return sortList;
}
