import NP from 'number-precision';

import * as Services from '@/services';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import * as Adapter from '@/utils/adpters';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';

export interface CodeFundMap {
  [index: string]: Fund.SettingItem & Fund.OriginRow;
}
export interface CodeRemoteFundMap {
  [index: string]: Fund.RemoteFund;
}

export function GetFundConfig(code?: string) {
  const wallet = Helpers.Wallet.GetCurrentWallet(code);
  const fundConfig = wallet.funds;
  const codeMap = GetCodeMap(fundConfig);
  return { fundConfig, codeMap };
}

export function GetCodeMap(config: Fund.SettingItem[]) {
  return config.reduce((r, c, i) => {
    r[c.code] = { ...c, originSort: i };
    return r;
  }, {} as CodeFundMap);
}

export function GetRemoteFundsMap() {
  return Utils.GetStorage<Record<string, Fund.RemoteFund>>(CONST.STORAGE.REMOTE_FUND_MAP, {});
}

export async function GetFunds(config?: Fund.SettingItem[]) {
  const { fundConfig } = GetFundConfig();
  const { fundApiTypeSetting } = Helpers.Setting.GetSystemSetting();
  const collectors = (config || fundConfig).map(
    ({ code }) =>
      () =>
        GetFund(code)
  );
  switch (fundApiTypeSetting) {
    case Enums.FundApiType.Dayfund:
      return Adapter.ChokeGroupAdapter<Fund.ResponseItem>(collectors, 1, 100);
    case Enums.FundApiType.Tencent:
      return Adapter.ChokeGroupAdapter<Fund.ResponseItem>(collectors, 3, 300);
    case Enums.FundApiType.Sina:
      return Adapter.ChokeGroupAdapter<Fund.ResponseItem>(collectors, 3, 300);
    case Enums.FundApiType.Howbuy:
      return Adapter.ChokeGroupAdapter<Fund.ResponseItem>(collectors, 3, 300);
    case Enums.FundApiType.Etf:
      return Adapter.ChokeGroupAdapter<Fund.ResponseItem>(collectors, 3, 300);
    case Enums.FundApiType.Eastmoney:
    default:
      return Adapter.ChokeGroupAdapter<Fund.ResponseItem>(collectors, 5, 500);
  }
}

export async function GetFund(code: string) {
  const { fundApiTypeSetting } = Helpers.Setting.GetSystemSetting();

  switch (fundApiTypeSetting) {
    case Enums.FundApiType.Dayfund:
      return Services.Fund.FromDayFund(code);
    case Enums.FundApiType.Tencent:
      return Services.Fund.FromTencent(code);
    case Enums.FundApiType.Sina:
      return Services.Fund.FromSina(code);
    case Enums.FundApiType.Howbuy:
      return Services.Fund.FromHowbuy(code);
    case Enums.FundApiType.Etf:
      return Services.Fund.FromEtf(code);
    case Enums.FundApiType.Eastmoney:
    default:
      // 默认请求天天基金
      return Services.Fund.FromEastmoney(code);
  }
}

export function CalcFund(fund: Fund.ResponseItem & Fund.FixData, code?: string) {
  const { codeMap } = GetFundConfig(code);
  const isFix = fund.fixDate && fund.fixDate === fund.gztime?.slice(5, 10);
  const cyfe = codeMap[fund.fundcode!]?.cyfe || 0;
  const cbj = codeMap[fund.fundcode!]?.cbj;
  const gsz = isFix ? fund.fixDwjz! : fund.gsz!;
  const dwjz = isFix ? fund.fixDwjz! : fund.dwjz!;
  const bjz = NP.minus(gsz!, fund.dwjz!);
  const jrsygz = NP.times(cyfe, bjz);
  const gszz = NP.times(gsz!, cyfe);
  const cyje = NP.times(fund.dwjz!, cyfe);
  const cbje = cbj && NP.times(cbj, cyfe);
  const cysyl = cbj && NP.divide(NP.minus(dwjz, cbj), cbj, 0.01);
  const cysy = cbj && NP.times(NP.minus(dwjz, cbj), cyfe);

  // cyfe: number; // 持有份额
  // bjz: number; // 比较值
  // jrsygz: number; // 今日收益估值
  // gszz: number; // 估算总值

  return {
    ...fund,
    cyfe, // 持有份额
    cbj, // 成本价
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
    gszzl: isFix ? fund.fixZzl : fund.gszzl, // 估算收益率
    jzrq: isFix ? fund.fixDate : fund.jzrq?.slice(5), // 净值日期
  };
}

export function CalcFunds(funds: Fund.ResponseItem[] = [], code?: string) {
  const { codeMap } = GetFundConfig(code);
  const [zje, gszje, sygz, cysy, cbje] = funds.reduce(
    ([a, b, c, d, e], fund) => {
      const calcFundResult = CalcFund(fund, code);
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

export function CalcWalletsFund(fund: Fund.ResponseItem & Fund.FixData, codes: string[]) {
  const { cyfe, jrsygz, cyje, cysy, cbje } = codes.reduce(
    (r, code) => {
      const calcFundResult = CalcFund(fund, code);
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

export async function GetFixFunds(funds: (Fund.ResponseItem & Fund.FixData)[]) {
  const collectors = funds
    .filter(({ fixDate, gztime }) => !fixDate || fixDate !== gztime?.slice(5, 10))
    .map(
      ({ fundcode }) =>
        () =>
          Services.Fund.GetFixFromEastMoney(fundcode!)
    );
  return Adapter.ChokeGroupAdapter<Fund.FixData>(collectors, 3, 500);
}

export function MergeFixFunds(funds: (Fund.ResponseItem & Fund.FixData)[], fixFunds: Fund.FixData[]) {
  const cloneFunds = Utils.DeepCopy(funds);
  const fixFundMap = fixFunds.filter(Utils.NotEmpty).reduce((map, fund) => {
    map[fund.code!] = fund;
    return map;
  }, {} as { [index: string]: Fund.FixData });

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

export function SortFunds(funds: Fund.ResponseItem[]) {
  const { codeMap } = GetFundConfig();
  const {
    fundSortMode: { type: fundSortType, order: fundSortorder },
  } = Helpers.Sort.GetSortMode();
  const sortList = Utils.DeepCopy(funds);

  sortList.sort((a, b) => {
    const calcA = Helpers.Fund.CalcFund(a);
    const calcB = Helpers.Fund.CalcFund(b);
    const t = fundSortorder === Enums.SortOrderType.Asc ? 1 : -1;
    switch (fundSortType) {
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
      case Enums.FundSortType.Custom:
      default:
        return (codeMap[b.fundcode!]?.originSort - codeMap[a.fundcode!]?.originSort) * t;
    }
  });

  return sortList;
}
