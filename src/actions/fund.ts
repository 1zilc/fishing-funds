/* eslint-disable no-eval */
import NP from 'number-precision';
import { batch } from 'react-redux';
import dayjs from 'dayjs';

import { Dispatch, GetState } from '@/reducers/types';
import { getFundApiTypeSetting } from '@/actions/setting';
import { updateUpdateTime } from '@/actions/wallet';
import * as Services from '@/services';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import * as Adapter from '@/utils/adpters';
import * as CONST from '@/constants';

export const SET_REMOTE_FUNDS = 'SET_REMOTE_FUNDS';
export const SET_REMOTE_FUNDS_LOADING = 'SET_REMOTE_FUNDS_LOADING';
export const SET_FUNDS = 'SET_FUNDS';
export const SET_FUNDS_LOADING = 'SET_FUNDS_LOADING';
export const TOGGLE_FUND_COLLAPSE = 'TOGGLE_FUND_COLLAPSE';
export const TOGGLE_FUNDS_COLLAPSE = 'TOGGLE_FUNDS_COLLAPSE';
export const SORT_FUNDS = 'SORT_FUNDS';
export const SORT_FUNDS_WITH_COLLAPSE_CHACHED =
  'SORT_FUNDS_WITH_COLLAPSE_CHACHED';
export interface CodeMap {
  [index: string]: Fund.SettingItem & { originSort: number };
}

export function getFundConfig() {
  const fundConfig: Fund.SettingItem[] = Utils.GetStorage(
    CONST.STORAGE.FUND_SETTING,
    []
  );

  const codeMap = fundConfig.reduce((r, c, i) => {
    r[c.code] = { ...c, originSort: i };
    return r;
  }, {} as CodeMap);

  return { fundConfig, codeMap };
}

export async function getFunds() {
  const { fundConfig } = getFundConfig();
  const fundApiType = getFundApiTypeSetting();
  const collectors = fundConfig.map(({ code }) => () => getFund(code));
  switch (fundApiType) {
    case Enums.FundApiType.Dayfund:
      return Adapter.ChokeAllAdapter<Fund.ResponseItem>(collectors);
    case Enums.FundApiType.Tencent:
      await Utils.Sleep(1000);
      return Adapter.ConCurrencyAllAdapter<Fund.ResponseItem>(collectors);
    case Enums.FundApiType.Sina:
      await Utils.Sleep(1000);
      return Adapter.ConCurrencyAllAdapter<Fund.ResponseItem>(collectors);
    case Enums.FundApiType.Howbuy:
      await Utils.Sleep(1000);
      return Adapter.ConCurrencyAllAdapter<Fund.ResponseItem>(collectors);
    case Enums.FundApiType.Eastmoney:
    default:
      await Utils.Sleep(1000);
      return Adapter.ConCurrencyAllAdapter<Fund.ResponseItem>(collectors);
  }
}

export async function getFund(code: string) {
  const fundApiType = getFundApiTypeSetting();
  switch (fundApiType) {
    case Enums.FundApiType.Dayfund:
      return Services.Fund.FromDayFund(code);
    case Enums.FundApiType.Tencent:
      return Services.Fund.FromTencent(code);
    case Enums.FundApiType.Sina:
      return Services.Fund.FromSina(code);
    case Enums.FundApiType.Howbuy:
      return Services.Fund.FromHowbuy(code);
    case Enums.FundApiType.Eastmoney:
    default:
      // 默认请求天天基金
      return Services.Fund.FromEastmoney(code);
  }
}

export async function addFund(fund: Fund.SettingItem) {
  const fundConfig: Fund.SettingItem[] = Utils.GetStorage(
    CONST.STORAGE.FUND_SETTING,
    []
  );
  const notExist =
    fundConfig.filter((item) => fund.code === item.code).length === 0;
  if (notExist) {
    Utils.SetStorage(CONST.STORAGE.FUND_SETTING, [...fundConfig, fund]);
  }
}

export async function updateFund(fund: Fund.SettingItem) {
  const fundConfig: Fund.SettingItem[] = Utils.GetStorage(
    CONST.STORAGE.FUND_SETTING,
    []
  );
  fundConfig.forEach((item) => {
    if (fund.code === item.code) {
      item.cyfe = fund.cyfe;
    }
  });
  Utils.SetStorage(CONST.STORAGE.FUND_SETTING, fundConfig);
}

export async function deleteFund(fund: Fund.ResponseItem) {
  const fundConfig: Fund.SettingItem[] = Utils.GetStorage(
    CONST.STORAGE.FUND_SETTING,
    []
  );

  fundConfig.forEach((item, index) => {
    if (fund.fundcode === item.code) {
      const cloneFundSetting = JSON.parse(JSON.stringify(fundConfig));
      cloneFundSetting.splice(index, 1);
      Utils.SetStorage(CONST.STORAGE.FUND_SETTING, cloneFundSetting);
    }
  });
}

export function calcFund(fund: Fund.ResponseItem) {
  const { codeMap } = getFundConfig();
  const cyfe = codeMap[fund.fundcode!]?.cyfe || 0;
  const bjz = NP.minus(fund.gsz!, fund.dwjz!);
  const jrsygz = NP.times(cyfe, bjz);
  const gszz = NP.times(fund.gsz!, cyfe);
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
  };
}

export function calcFunds(funds: Fund.ResponseItem[]) {
  const { codeMap } = getFundConfig();
  const [zje, gszje, sygz] = funds.reduce(
    ([a, b, c], fund) => {
      const cyfe = codeMap[fund.fundcode!]?.cyfe || 0; // 持有份额
      const bjz = NP.minus(fund.gsz!, fund.dwjz!); // 比较值（估算值 - 持有净值）
      const jrsygz = NP.times(cyfe, bjz); // 今日收益估值（持有份额 * 比较值）
      const gszz = NP.times(fund.gsz!, cyfe); // 估算总值 (持有份额 * 估算值)
      const dwje = NP.times(fund.dwjz!, cyfe); // 当前金额 (持有份额 * 当前净值)
      return [a + dwje, b + gszz, c + jrsygz];
    },
    [0, 0, 0]
  );
  // zje: number; // 当前总金额
  // gszje: number; // 估算总金额
  // sygz: number; // 估算总收益
  return { zje, gszje, sygz };
}

export function loadFunds() {
  return async (dispatch: Dispatch, getState: GetState) => {
    try {
      dispatch({ type: SET_FUNDS_LOADING, payload: true });
      const funds = await getFunds();
      const now = dayjs().format('YYYY/MM/DD HH:mm:ss');
      batch(() => {
        dispatch({ type: SORT_FUNDS_WITH_COLLAPSE_CHACHED, payload: funds });
        dispatch({ type: SET_FUNDS_LOADING, payload: false });
        dispatch(updateUpdateTime(now));
      });
    } finally {
      dispatch({ type: SET_FUNDS_LOADING, payload: false });
    }
  };
}
