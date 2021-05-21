/* eslint-disable no-eval */
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

export interface CodeMap {
  [index: string]: Fund.SettingItem & Fund.OriginRow;
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
  }, {} as CodeMap);
}

export function setFundConfig(config: Fund.SettingItem[]) {
  const { walletConfig } = getWalletConfig();
  const currentWalletCode = Utils.GetStorage(
    CONST.STORAGE.CURRENT_WALLET_CODE,
    defaultWallet.code
  );
  const _walletConfig = walletConfig.map((item) => ({
    ...item,
    funds: currentWalletCode === item.code ? config : item.funds,
  }));
  setWalletConfig(_walletConfig);
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
}) {
  const { fundConfig } = getFundConfig();
  fundConfig.forEach((item) => {
    if (fund.code === item.code) {
      if (fund.cyfe !== undefined) {
        item.cyfe = fund.cyfe;
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
  const gsz = isFix ? fund.fixDwjz! : fund.gsz!;
  const dwjz = isFix ? fund.fixDwjz! : fund.dwjz!;
  const bjz = NP.minus(gsz!, fund.dwjz!);
  const jrsygz = NP.times(cyfe, bjz);
  const gszz = NP.times(gsz!, cyfe);

  // cyfe: number; // 持有份额
  // bjz: number; // 比较值
  // jrsygz: number; // 今日收益估值
  // gszz: number; // 估算总值
  return {
    ...fund,
    cyfe,
    bjz,
    jrsygz,
    gszz,
    isFix,
    gsz,
    dwjz,
    gszzl: isFix ? fund.fixZzl : fund.gszzl,
    jzrq: isFix ? fund.fixDate : fund.jzrq,
  };
}

export function calcFunds(funds: Fund.ResponseItem[] = [], code?: string) {
  const { codeMap } = getFundConfig(code);
  const [zje, gszje, sygz] = funds.reduce(
    ([a, b, c], fund) => {
      const calcFundResult = calcFund(fund);
      const cyfe = codeMap[fund.fundcode!]?.cyfe || 0; // 持有份额
      const bjz = calcFundResult.bjz; // 比较值（估算值 - 持有净值）
      const jrsygz = NP.times(cyfe, bjz); // 今日收益估值（持有份额 * 比较值）
      const gszz = NP.times(calcFundResult.gsz!, cyfe); // 估算总值 (持有份额 * 估算值)
      const dwje = NP.times(fund.dwjz!, cyfe); // 当前金额 (持有份额 * 当前净值)
      return [a + dwje, b + gszz, c + jrsygz];
    },
    [0, 0, 0]
  );
  const gssyl = zje ? NP.times(NP.divide(sygz, zje), 100) : 0;
  // zje: number; // 当前总金额
  // gszje: number; // 估算总金额
  // sygz: number; // 估算总收益
  // gssyl: number; // 估算总收益率
  return { zje, gszje, sygz, gssyl };
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
    } finally {
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
    } finally {
    }
  };
}

export function mergeFixFunds(
  funds: (Fund.ResponseItem & Fund.FixData)[],
  fixFunds: Fund.FixData[]
) {
  const cloneFunds = Utils.DeepCopy(funds);
  const fixFundMap = fixFunds
    .filter((_) => !!_)
    .reduce((map, fund) => {
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
