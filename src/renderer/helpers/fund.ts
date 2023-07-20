import NP from 'number-precision';
import { defaultWallet } from '@/store/features/wallet';
import * as Services from '@/services';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import * as Adapter from '@/utils/adpters';

export function GetFundConfig(walletCode: string, walletsConfig: Wallet.SettingItem[]) {
  const walletConfig = walletsConfig.find(({ code }) => code === walletCode) || defaultWallet;
  const fundConfig = walletConfig.funds || [];
  const codeMap = Utils.GetCodeMap(fundConfig, 'code');
  return { fundConfig, codeMap };
}

export function GetFundConfigMaps(codes: string[], walletsConfig: Wallet.SettingItem[]) {
  return codes.map((code) => GetFundConfig(code, walletsConfig).codeMap);
}

export async function GetFixFunds(funds: (Fund.ResponseItem & Fund.FixData)[]) {
  const collectors = funds
    .filter(({ fixDate, gztime }) => !fixDate || fixDate !== gztime?.slice(5, 10))
    .map(
      ({ fundcode }) =>
        () =>
          Services.Fund.GetFixFromEastMoney(fundcode!)
    );
  const list = await Adapter.ChokeGroupAdapter(collectors, 3, 500);
  return list.filter(Utils.NotEmpty);
}

export async function GetFunds(config: Fund.SettingItem[], fundApiTypeSetting: Enums.FundApiType) {
  const collectors = config.map(
    ({ code }) =>
      () =>
        GetFund(code, fundApiTypeSetting)
  );
  const load = () => {
    switch (fundApiTypeSetting) {
      case Enums.FundApiType.Tencent:
        return Adapter.ChokeGroupAdapter(collectors, 3, 300);
      case Enums.FundApiType.Ant:
        return Adapter.ChokeGroupAdapter(collectors, 4, 400);
      case Enums.FundApiType.Fund10jqka:
        return Adapter.ChokeGroupAdapter(collectors, 5, 500);
      case Enums.FundApiType.Eastmoney:
      default:
        return Adapter.ChokeGroupAdapter(collectors, 5, 500);
    }
  };
  const list = await load();

  return list.filter(Utils.NotEmpty);
}

export async function GetFund(code: string, fundApiTypeSetting: Enums.FundApiType) {
  switch (fundApiTypeSetting) {
    case Enums.FundApiType.Tencent:
      return Services.Fund.FromTencent(code);
    case Enums.FundApiType.Ant:
      return Services.Fund.FromFund123(code);
    case Enums.FundApiType.Fund10jqka:
      return Services.Fund.FromFund10jqka(code);
    case Enums.FundApiType.Eastmoney:
    default:
      // 默认请求天天基金
      return Services.Fund.FromEastmoney(code);
  }
}

export function CalcFund(fund: Fund.ResponseItem & Fund.FixData, codeMap: Fund.CodeMap) {
  const config = codeMap[fund.fundcode!];
  const cyfe = config?.cyfe || 0;
  const cbj = config?.cbj;
  const memo = config?.memo;

  const gzrq = fund.gztime?.slice(5, 10);
  const jzrq = fund.jzrq?.slice(5);
  const isFix = fund.fixDate && fund.fixDate === gzrq;
  const gsz = isFix ? fund.fixDwjz! : fund.gsz!;
  const dwjz = isFix ? fund.fixDwjz! : fund.dwjz!;
  const bjz = NP.minus(gsz!, fund.dwjz!);
  const jrsygz = NP.times(cyfe, bjz);
  const gszz = NP.times(gsz!, cyfe);
  const cyje = NP.times(fund.dwjz!, cyfe);
  const cbje = cbj && NP.times(cbj, cyfe);
  const cysyl = cbj && NP.divide(NP.minus(dwjz, cbj), cbj, 0.01);
  const cysy = cbj && NP.times(NP.minus(dwjz, cbj), cyfe);
  const gszzl = isFix ? fund.fixZzl : fund.gszzl; // 估算收益率
  const gscysyl = cbj && cbj > 0 ? (isFix ? cysyl?.toFixed(2) : (Number(cysyl) + Number(gszzl)).toFixed(2)) : '';
  // cyfe: number; // 持有份额
  // bjz: number; // 比较值
  // jrsygz: number; // 今日收益估值
  // gszz: number; // 估算总值

  return {
    ...fund,
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
    isFix, // 是否更新净值
    gsz, // 估算值（最新）
    dwjz, // 单位净值（上一次）
    gszzl, // 估算收益率
    gscysyl, // 估算持有收益率
    jzrq: isFix ? fund.fixDate : jzrq, // 净值日期
  };
}

export function CalcFunds(funds: Fund.ResponseItem[] = [], codeMap: Fund.CodeMap) {
  const [zje, gszje, sygz, cysy, cbje] = funds.reduce(
    ([a, b, c, d, e], fund) => {
      const calcFundResult = CalcFund(fund, codeMap);
      const { bjz, gsz, cysy, cbje } = calcFundResult; // 比较值（估算值 - 持有净值）
      const cyfe = codeMap[fund.fundcode!]?.cyfe || 0; // 持有份额
      const jrsygz = NP.times(cyfe, bjz); // 今日收益估值（持有份额 * 比较值）
      const gszz = NP.times(gsz, cyfe); // 估算总值 (持有份额 * 估算值)
      const dwje = NP.times(fund.dwjz!, cyfe); // 当前金额 (持有份额 * 当前净值)
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

export function CalcWalletsFund(fund: Fund.ResponseItem & Fund.FixData, codeMaps: Fund.CodeMap[]) {
  const { cyfe, jrsygz, cyje, cysy, cbje } = codeMaps.reduce(
    (r, codeMap) => {
      const calcFundResult = CalcFund(fund, codeMap);
      r.cyfe += calcFundResult.cyfe;
      r.jrsygz += calcFundResult.jrsygz;
      r.cyje += calcFundResult.cyje;
      r.cysy += calcFundResult.cysy || 0;
      r.cbje += calcFundResult.cbje || 0;
      return r;
    },
    { cyfe: 0, jrsygz: 0, cyje: 0, cysy: 0, cbje: 0 }
  );
  const cysyl = cbje ? NP.times(NP.divide(cysy, cbje), 100) : 0;
  return { cyfe, jrsygz, cyje, cysy, cbje, cysyl };
}

export function MergeFixFunds(funds: (Fund.ResponseItem & Fund.FixData)[], fixFunds: Fund.FixData[]) {
  const cloneFunds = Utils.DeepCopy(funds);
  const fixFundMap = Utils.GetCodeMap(fixFunds, 'code');

  cloneFunds.forEach((fund) => {
    const fixFund = fixFundMap[fund.fundcode!];
    if (fixFund) {
      fund.fixZzl = fixFund.fixZzl;
      fund.fixDate = fixFund.fixDate;
      fund.fixDwjz = fixFund.fixDwjz;
    }
  });
  return cloneFunds;
}

export function SortFund({
  codeMap,
  list,
  orderType,
  sortType,
}: {
  list: (Fund.ResponseItem & Fund.FixData & Fund.ExtraRow)[];
  sortType: Enums.FundSortType;
  codeMap: Fund.CodeMap;
  orderType: Enums.SortOrderType;
}) {
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
        return (Number(calcA.cysyl || 0) - Number(calcB.cysyl || 0)) * t;
      case Enums.FundSortType.Name:
        return calcA.name!.localeCompare(calcB.name!, 'zh') * t;
      case Enums.FundSortType.Custom:
      default:
        return (codeMap[b.fundcode!]?.originSort - codeMap[a.fundcode!]?.originSort) * t;
    }
  });
  return sortList;
}
