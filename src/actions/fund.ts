/* eslint-disable no-eval */
import NP from 'number-precision';
import * as Services from '../services';
import * as Enums from '../utils/enums';
import * as Utils from '../utils';
import * as Adapter from '../utils/adpters';
import { getFundApiTypeSetting } from './setting';
import CONST_STORAGE from '../constants/storage.json';

export const getFundConfig = () => {
  const fundConfig: Fund.SettingItem[] = Utils.GetStorage(
    CONST_STORAGE.FUND_SETTING,
    []
  );

  const codeMap = fundConfig.reduce((r, c) => {
    r[c.code] = c;
    return r;
  }, {} as { [index: string]: Fund.SettingItem });

  return { fundConfig, codeMap };
};

export const getFunds: () => Promise<
  (Fund.ResponseItem | null)[]
> = async () => {
  const { fundConfig } = getFundConfig();
  const fundApiType = getFundApiTypeSetting();
  const collectors = fundConfig.map(({ code }) => () => getFund(code));

  switch (fundApiType) {
    case Enums.FundApiType.Dayfund:
      return Adapter.ChokeAdapter(collectors);
    case Enums.FundApiType.Tencent:
      await Utils.Sleep(1000);
      return Adapter.ConCurrencyAdapter(collectors);
    case Enums.FundApiType.Eastmoney:
    default:
      await Utils.Sleep(1000);
      return Adapter.ConCurrencyAdapter(collectors);
  }
};

export const getFund: (
  code: string
) => Promise<Fund.ResponseItem | null> = async code => {
  const fundApiType = getFundApiTypeSetting();
  switch (fundApiType) {
    case Enums.FundApiType.Dayfund:
      return Services.Fund.FromDayFund(code);
    case Enums.FundApiType.Tencent:
      return Services.Fund.FromTencent(code);
    case Enums.FundApiType.Eastmoney:
    default:
      return Services.Fund.FromEastmoney(code);
  }
};

export const addFund = async (fund: Fund.SettingItem) => {
  const fundConfig: Fund.SettingItem[] = Utils.GetStorage(
    CONST_STORAGE.FUND_SETTING,
    []
  );
  const notExist =
    fundConfig.filter(item => fund.code === item.code).length === 0;
  if (notExist) {
    Utils.SetStorage(CONST_STORAGE.FUND_SETTING, [...fundConfig, fund]);
  }
};

export const updateFund = async (fund: Fund.SettingItem) => {
  const fundConfig: Fund.SettingItem[] = Utils.GetStorage(
    CONST_STORAGE.FUND_SETTING,
    []
  );
  fundConfig.forEach(item => {
    if (fund.code === item.code) {
      item.cyfe = fund.cyfe;
    }
  });
  Utils.SetStorage(CONST_STORAGE.FUND_SETTING, fundConfig);
};

export const deleteFund = async (fund: Fund.ResponseItem) => {
  const fundConfig: Fund.SettingItem[] = Utils.GetStorage(
    CONST_STORAGE.FUND_SETTING,
    []
  );

  fundConfig.forEach((item, index) => {
    if (fund.fundcode === item.code) {
      const cloneFundSetting = JSON.parse(JSON.stringify(fundConfig));
      cloneFundSetting.splice(index, 1);
      Utils.SetStorage(CONST_STORAGE.FUND_SETTING, cloneFundSetting);
    }
  });
};

export const calcFund: (
  fund: Fund.ResponseItem
) => {
  cyfe: number; // 持有份额
  bjz: number; // 比较值
  jrsygz: number; // 今日收益估值
  gszz: number; // 估算总值
} = (fund: Fund.ResponseItem) => {
  const { codeMap } = getFundConfig();
  const cyfe = codeMap[fund.fundcode]?.cyfe || 0;
  const bjz = NP.minus(fund.gsz, fund.dwjz);
  const jrsygz = NP.times(cyfe, bjz);
  const gszz = NP.times(fund.gsz, cyfe);
  return {
    cyfe,
    bjz,
    jrsygz,
    gszz
  };
};

export const calcFunds: (
  funds: Fund.ResponseItem[]
) => {
  zje: number; // 当前总金额
  gszje: number; // 估算总金额
  sygz: number; // 估算总收益
} = funds => {
  const { codeMap } = getFundConfig();
  const [zje, gszje, sygz] = funds.reduce(
    ([a, b, c], fund) => {
      const cyfe = codeMap[fund.fundcode]?.cyfe || 0; // 持有份额
      const bjz = NP.minus(fund.gsz, fund.dwjz); // 比较值（估算值 - 持有净值）
      const jrsygz = NP.times(cyfe, bjz); // 今日收益估值（持有份额 * 比较值）
      const gszz = NP.times(fund.gsz, cyfe); // 估算总值 (持有份额 * 估算值)
      const dwje = NP.times(fund.dwjz, cyfe); // 当前金额 (持有份额 * 当前净值)
      return [a + dwje, b + gszz, c + jrsygz];
    },
    [0, 0, 0]
  );
  return { zje, gszje, sygz };
};
