import NP from 'number-precision';
import { batch } from 'react-redux';
import dayjs from 'dayjs';

import { Dispatch, GetState } from '@/reducers/types';
import { getSystemSetting } from '@/actions/setting';
import {
  SYNC_WALLETS_MAP,
  SYNC_FIX_WALLETS_MAP,
  getWalletConfig,
  defaultWallet,
  setWalletConfig,
  getCurrentWallet,
} from '@/actions/wallet';
import * as Services from '@/services';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import * as Adapter from '@/utils/adpters';
import * as CONST from '@/constants';

export const SET_REMOTE_FUNDS = 'SET_REMOTE_FUNDS';
export const SET_REMOTE_FUNDS_LOADING = 'SET_REMOTE_FUNDS_LOADING';
export const SET_FUNDS = 'SET_FUNDS';
export const SET_FUNDS_LOADING = 'SET_FUNDS_LOADING';
export const SET_FIX_FUND = 'SET_FIX_FUND';
export const TOGGLE_FUND_COLLAPSE = 'TOGGLE_FUND_COLLAPSE';
export const TOGGLE_FUNDS_COLLAPSE = 'TOGGLE_FUNDS_COLLAPSE';
export const SORT_FUNDS = 'SORT_FUNDS';
export const SORT_FUNDS_WITH_CHACHED = 'SORT_FUNDS_WITH_CHACHED';

export interface CodeFundMap {
  [index: string]: Fund.SettingItem & Fund.OriginRow;
}
export interface CodeRemoteFundMap {
  [index: string]: Fund.RemoteFund;
}

export function getFundConfig(code?: string) {
  const wallet = getCurrentWallet(code);
  const fundConfig = wallet.funds;
  const codeMap = getCodeMap(fundConfig);
  return { fundConfig, codeMap };
}

export function getCodeMap(config: Fund.SettingItem[]) {
  return config.reduce((r, c, i) => {
    r[c.code] = { ...c, originSort: i };
    return r;
  }, {} as CodeFundMap);
}

export function setFundConfig(config: Fund.SettingItem[]) {
  const { walletConfig } = getWalletConfig();
  const currentWalletCode = Utils.GetStorage(
    CONST.STORAGE.CURRENT_WALLET_CODE,
    defaultWallet.code
  );
  const newWalletConfig = walletConfig.map((item) => ({
    ...item,
    funds: currentWalletCode === item.code ? config : item.funds,
  }));
  setWalletConfig(newWalletConfig);
}

export function setRemoteFunds(remoteFunds: Fund.RemoteFund[]) {
  const remoteMap = Utils.GetStorage(CONST.STORAGE.REMOTE_FUND_MAP, {});
  const newRemoteMap = remoteFunds.reduce((r, c) => {
    r[c[0]] = c;
    return r;
  }, {} as CodeRemoteFundMap);
  Utils.SetStorage(CONST.STORAGE.REMOTE_FUND_MAP, {
    ...remoteMap,
    ...newRemoteMap,
  });
  return { type: SET_REMOTE_FUNDS, payload: remoteFunds };
}

export function getRemoteFundsMap() {
  return Utils.GetStorage(
    CONST.STORAGE.REMOTE_FUND_MAP,
    {} as { [index: string]: Fund.RemoteFund }
  );
}

export async function getFunds(config?: Fund.SettingItem[]) {
  const { fundConfig } = getFundConfig();
  const { fundApiTypeSetting } = getSystemSetting();
  const collectors = (config || fundConfig).map(
    ({ code }) =>
      () =>
        getFund(code)
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

export async function getFund(code: string) {
  const { fundApiTypeSetting } = getSystemSetting();

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

export function addFund(fund: Fund.SettingItem) {
  const { fundConfig } = getFundConfig();
  const notExist =
    fundConfig.filter((item) => fund.code === item.code).length === 0;
  if (notExist) {
    setFundConfig([...fundConfig, fund]);
  }
}

export function updateFund(fund: {
  code: string;
  cyfe?: number;
  name?: string;
  cbj?: number;
}) {
  const { fundConfig } = getFundConfig();
  fundConfig.forEach((item) => {
    if (fund.code === item.code) {
      if (!(fund.cyfe ?? true)) {
        item.cyfe = fund.cyfe;
      }
      if (fund.cbj !== undefined) {
        item.cbj = fund.cbj;
      }
      if (fund.name !== undefined) {
        item.name = fund.name;
      }
    }
  });
  setFundConfig(fundConfig);
}

export function deleteFund(code: string) {
  const { fundConfig } = getFundConfig();
  fundConfig.forEach((item, index) => {
    if (code === item.code) {
      const cloneFundSetting = JSON.parse(JSON.stringify(fundConfig));
      cloneFundSetting.splice(index, 1);
      setFundConfig(cloneFundSetting);
    }
  });
}

export function calcFund(
  fund: Fund.ResponseItem & Fund.FixData,
  code?: string
) {
  const { codeMap } = getFundConfig(code);
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
    jzrq: isFix ? fund.fixDate : fund.jzrq, // 净值日期
  };
}

export function calcFunds(funds: Fund.ResponseItem[] = [], code?: string) {
  const { codeMap } = getFundConfig(code);
  const [zje, gszje, sygz, cysy, cbje] = funds.reduce(
    ([a, b, c, d, e], fund) => {
      const calcFundResult = calcFund(fund, code);
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

export function calcWalletsFund(
  fund: Fund.ResponseItem & Fund.FixData,
  codes: string[]
) {
  const { cyfe, jrsygz, cyje, cysy, cbje } = codes.reduce(
    (r, code) => {
      const calcFundResult = calcFund(fund, code);
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

export function loadRemoteFunds() {
  return async (dispatch: Dispatch, getState: GetState) => {
    try {
      dispatch({ type: SET_REMOTE_FUNDS_LOADING, payload: true });
      const remoteFunds = await Services.Fund.GetRemoteFundsFromEastmoney();
      batch(() => {
        dispatch(setRemoteFunds(remoteFunds));
        dispatch({ type: SET_REMOTE_FUNDS_LOADING, payload: false });
      });
    } catch {
      dispatch({ type: SET_REMOTE_FUNDS_LOADING, payload: false });
    }
  };
}

export function loadFunds() {
  return async (dispatch: Dispatch, getState: GetState) => {
    try {
      dispatch({ type: SET_FUNDS_LOADING, payload: true });
      const funds = await getFunds();
      const { code } = getCurrentWallet();
      const now = dayjs().format('MM-DD HH:mm:ss');
      batch(() => {
        dispatch({ type: SORT_FUNDS_WITH_CHACHED, payload: funds });
        dispatch({ type: SET_FUNDS_LOADING, payload: false });
        dispatch({
          type: SYNC_WALLETS_MAP,
          payload: {
            code,
            item: {
              funds,
              updateTime: now,
            },
          },
        });
      });
    } catch {
      dispatch({ type: SET_FUNDS_LOADING, payload: false });
    }
  };
}

export function loadFundsWithoutLoading() {
  return async (dispatch: Dispatch, getState: GetState) => {
    try {
      const funds = await getFunds();
      const { code } = getCurrentWallet();
      const now = dayjs().format('MM-DD HH:mm:ss');
      batch(() => {
        dispatch({ type: SORT_FUNDS_WITH_CHACHED, payload: funds });
        dispatch({
          type: SYNC_WALLETS_MAP,
          payload: {
            code,
            item: {
              funds,
              updateTime: now,
            },
          },
        });
      });
    } catch (error) {
      console.log('静默加载基金失败', error);
    }
  };
}

export async function getFixFunds(funds: (Fund.ResponseItem & Fund.FixData)[]) {
  const collectors = funds
    .filter(
      ({ fixDate, gztime }) => !fixDate || fixDate !== gztime?.slice(5, 10)
    )
    .map(
      ({ fundcode }) =>
        () =>
          Services.Fund.GetFixFromEastMoney(fundcode!)
    );
  return Adapter.ChokeGroupAdapter<Fund.FixData>(collectors, 3, 500);
}

export function loadFixFunds() {
  return async (dispatch: Dispatch, getState: GetState) => {
    try {
      const { fund } = getState();
      const { code } = getCurrentWallet();
      const { funds } = fund;
      const fixFunds = await getFixFunds(funds);
      const now = dayjs().format('MM-DD HH:mm:ss');

      batch(() => {
        dispatch({ type: SET_FIX_FUND, payload: fixFunds });
        dispatch({
          type: SYNC_FIX_WALLETS_MAP,
          payload: {
            code,
            item: {
              funds: fixFunds,
              updateTime: now,
            },
          },
        });
      });
    } catch (error) {
      console.log('加载最新净值失败', error);
    }
  };
}

export function mergeFixFunds(
  funds: (Fund.ResponseItem & Fund.FixData)[],
  fixFunds: Fund.FixData[]
) {
  const cloneFunds = Utils.DeepCopy(funds);
  const fixFundMap = fixFunds.filter(Boolean).reduce((map, fund) => {
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
