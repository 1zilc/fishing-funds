import { GetState, Dispatch } from '../reducers/types';
import NP from 'number-precision';
import request from 'request';
import * as Utils from '../utils';
import CONST_STORAGE from '../constants/storage.json';

export const UPDATE_UPTATETIME = 'UPDATE_UPTATETIME';

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

export const getFund: (
  code: string
) => Promise<Fund.ResponseItem | null> = async code => {
  return new Promise((resolve, reject) => {
    request.get(
      `http://fundgz.1234567.com.cn/js/${code}.js`,
      (error, response, body: string) => {
        if (!error) {
          try {
            setTimeout(() => {
              if (body.startsWith('jsonpgz')) {
                resolve(eval(body));
              } else {
                resolve(null);
              }
            }, 1000);
          } catch {
            reject(null);
          }
        } else {
          reject(null);
        }
      }
    );
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
