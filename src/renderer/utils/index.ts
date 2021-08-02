import NP from 'number-precision';
import dayjs, { Dayjs } from 'dayjs';

import { defaultWallet } from '@/helpers/wallet';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';

const { invoke } = window.contextModules.electron;

export function Yang(num: string | number | undefined) {
  try {
    if (num === undefined) {
      return '';
    }
    if (Number(num) < 0) {
      return String(num);
    } else {
      return `+${num}`;
    }
  } catch (error) {
    return String(num);
  }
}

export function CalcWithPrefix(a: any, b: any) {
  if (b >= a) {
    return `+${NP.minus(b, a)}`;
  } else {
    return NP.minus(b, a);
  }
}

export function DeepCopy<T>(object: T): T {
  const data: any = object;
  try {
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    try {
      let dataTmp: any;
      if (data === null || !(typeof data === 'object')) {
        dataTmp = data;
      } else {
        dataTmp = data instanceof Array ? [] : {};
        Object.keys(data).forEach((key) => {
          dataTmp[key] = DeepCopy(data[key]);
        });
      }
      return dataTmp;
    } catch (error) {
      console.log('深拷贝出错，返回原始对象');
      return data;
    }
  }
}

export function GetStorage<T = any>(key: string, init?: T): T {
  const json = localStorage.getItem(key);
  return json ? JSON.parse(json) : init || json;
}

export function SetStorage(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function ClearStorage(key: string) {
  localStorage.removeItem(key);
}

export function Encrypt(s: string) {
  return s.replace(/[+-]/g, '').replace(/[0-9]/g, '✱');
}

export async function Sleep<T>(time: number, F?: T): Promise<T | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(F);
    }, time);
  });
}

export function JudgeWorkDayTime(timestamp: number) {
  const now = dayjs(timestamp);
  const hour = now.get('hour');
  const day = now.get('day');
  const minute = now.get('minute');
  const minites = hour * 60 + minute;
  const isWorkDay = day >= 1 && day <= 5;
  const isMorningWorkTime = minites >= 9 * 60 + 30 && minites <= 11 * 60 + 30;
  const isAfternoonWorkTime = minites >= 13 * 60 && minites <= 15 * 60;
  return isWorkDay && (isMorningWorkTime || isAfternoonWorkTime);
}

export function JudgeFixTime(timestamp: number) {
  const now = dayjs(timestamp);
  const hour = now.get('hour');
  const day = now.get('day');
  const minute = now.get('minute');
  const minites = hour * 60 + minute;
  const isWorkDay = day >= 1 && day <= 5;
  const isFixTime = minites <= 9 * 60 + 30 || minites >= 15 * 60;
  return (isWorkDay && isFixTime) || !isWorkDay;
}

export function JudgeAdjustmentNotificationTime(timestamp: number, adjustmentNotificationTime: string) {
  const now = dayjs(timestamp);
  const hour = now.get('hour');
  const day = now.get('day');
  const minute = now.get('minute');
  const isWorkDay = day >= 1 && day <= 5;
  const settingTime = dayjs(adjustmentNotificationTime);

  return {
    isAdjustmentNotificationTime: isWorkDay && hour >= settingTime.hour() && minute >= settingTime.minute(),
    now,
  };
}

// TODO: 类型推断有问题
export function getVariblesColor(varibles: string[]) {
  return varibles.reduce<Record<string, string>>((colorMap, varible) => {
    const color = window.getComputedStyle(document.body).getPropertyValue(varible);
    colorMap[varible] = color || '';
    return colorMap;
  }, {});
}

export function parsepingzhongdata(code: string) {
  try {
    return eval(`(() => {
      ${code}
      return {
        /*基金持仓股票代码(新市场号)*/
        stockCodesNew,
        /*基金持仓债券代码（新市场号）*/
        zqCodesNew,
        /*股票仓位测算图*/
        Data_fundSharesPositions,
        /*单位净值走势 equityReturn-净值回报 unitMoney-每份派送金*/
        Data_netWorthTrend,
        /*累计收益率走势*/
        Data_grandTotal,
        /*同类排名走势*/
        Data_rateInSimilarType,
        /*同类排名百分比*/
        Data_rateInSimilarPersent,
        /*同类型基金涨幅榜*/
        swithSameType,
        /*现任基金经理*/
        Data_currentFundManager,
        /*规模变动 mom-较上期环比*/
        Data_fluctuationScale,
        /*持有人结构*/
        Data_holderStructure,
        /*资产配置*/
        Data_assetAllocation,
        /*业绩评价 */
        Data_performanceEvaluation,
        /*近一年收益率*/
        syl_1n,
        /*近6月收益率*/
        syl_6y,
        /*近三月收益率*/
        syl_3y,
        /*近一月收益率*/
        syl_1y,
      };
    })()`);
  } catch {
    return {};
  }
}

export function ParseRemoteFunds(code: string) {
  try {
    return eval(`(() => {
      ${code}
      return r;
    })()`);
  } catch {
    return [];
  }
}

export async function UpdateSystemTheme(setting: Enums.SystemThemeType) {
  switch (setting) {
    case Enums.SystemThemeType.Light:
      await invoke.setNativeThemeSource('light');
      break;
    case Enums.SystemThemeType.Dark:
      await invoke.setNativeThemeSource('dark');
      break;
    case Enums.SystemThemeType.Auto:
    default:
      await invoke.setNativeThemeSource('system');
  }
}

export function UnitConvert(num: number) {
  function strNumSize(tempNum: number) {
    const stringNum = tempNum.toString();
    const index = stringNum.indexOf('.');
    let newNum = stringNum;
    if (index !== -1) {
      newNum = stringNum.substring(0, index);
    }
    return newNum.length;
  }
  const moneyUnits = ['元', '万', '亿', '万亿'];
  const dividend = 10000;
  let curentNum = num;
  // 转换数字
  let curentUnit = moneyUnits[0];
  // 转换单位
  for (let i = 0; i < 4; i++) {
    curentUnit = moneyUnits[i];
    if (strNumSize(curentNum) < 5) {
      break;
    }
    curentNum /= dividend;
  }
  return {
    num: curentNum.toFixed(2),
    unit: curentUnit,
  };
}

export function MakeHash() {
  return Math.random().toString(36).substr(2);
}

export function ClearExpiredStorage() {
  // 数据源请求类型 2.7.0已废除
  const fundApiType = GetStorage(CONST.STORAGE.FUND_API_TYPE);
  if (fundApiType !== null) {
    ClearStorage(CONST.STORAGE.FUND_API_TYPE);
  }
  // 钱包icon索引 2.8.0已废除
  // 基金配置 2.8.0已废除
  const fundSetting = GetStorage(CONST.STORAGE.FUND_SETTING);
  const walletIndex = GetStorage(CONST.STORAGE.WALLET_INDEX);
  if (fundSetting !== null) {
    const walletSetting: Wallet.SettingItem = {
      ...defaultWallet,
      funds: fundSetting || [],
      iconIndex: walletIndex || 0,
    };
    SetStorage(CONST.STORAGE.WALLET_SETTING, [walletSetting]);
    ClearStorage(CONST.STORAGE.FUND_SETTING);
    ClearStorage(CONST.STORAGE.WALLET_INDEX);
  }
}

export function Group<T>(array: T[], num: number) {
  const groupList: T[][] = [];
  array.forEach((item) => {
    const last = groupList.pop();
    if (!last) {
      groupList.push([item]);
    } else if (last.length < num) {
      groupList.push([...last, item]);
    } else if (last.length === num) {
      groupList.push(last, [item]);
    }
  });
  return groupList;
}

export function MakeMap(list: number[]): Record<number, boolean>;
export function MakeMap(list: string[]): Record<string, boolean>;
export function MakeMap(list: (string | number)[]) {
  return list.reduce((r, c) => ({ ...r, [c]: true }), {});
}

export function GetValueColor(number?: number | string) {
  const value = Number(number);
  const varibleColors = getVariblesColor(CONST.VARIBLES);
  return {
    color:
      value > 0 ? varibleColors['--increase-color'] : value < 0 ? varibleColors['--reduce-color'] : varibleColors['--reverse-text-color'],
    textClass: value > 0 ? 'text-up' : value < 0 ? 'text-down' : 'text-none',
    blockClass: value > 0 ? 'block-up' : value < 0 ? 'block-down' : 'block-none',
  };
}

export function NotEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}
