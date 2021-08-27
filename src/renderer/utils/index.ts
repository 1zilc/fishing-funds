import NP from 'number-precision';
import dayjs, { Dayjs } from 'dayjs';

import { defaultWallet } from '@/helpers/wallet';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';

const { invoke, encodeFF, decodeFF } = window.contextModules.electron;
const { version } = window.contextModules.process;

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
    isAdjustmentNotificationTime: isWorkDay && hour === settingTime.hour() && minute === settingTime.minute(),
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

export function UnitTransform(value: number) {
  const newValue = ['', '', ''];
  let fr = 1000;
  const ad = 1;
  let num = 3;
  const fm = 1;
  while (value / fr >= 1) {
    fr *= 10;
    num += 1;
  }
  if (num <= 4) {
    // 千
    newValue[1] = '千';
    newValue[0] = NP.divide(value, 1000).toFixed(2);
  } else if (num <= 8) {
    // 万
    const text1 = parseInt(String(num - 4), 10) / 3 > 1 ? '千万' : '万';
    const fm = text1 === '万' ? 10000 : 10000000;
    newValue[1] = text1;
    newValue[0] = NP.divide(value, fm).toFixed(2);
  } else if (num <= 16) {
    // 亿
    let text1 = (num - 8) / 3 > 1 ? '千亿' : '亿';
    text1 = (num - 8) / 4 > 1 ? '万亿' : text1;
    text1 = (num - 8) / 7 > 1 ? '千万亿' : text1;
    let fm = 1;
    if (text1 === '亿') {
      fm = 100000000;
    } else if (text1 === '千亿') {
      fm = 100000000000;
    } else if (text1 === '万亿') {
      fm = 1000000000000;
    } else if (text1 === '千万亿') {
      fm = 1000000000000000;
    }
    newValue[1] = text1;
    newValue[0] = NP.divide(value, fm).toFixed(2);
  }
  if (value < 1000) {
    newValue[1] = '';
    newValue[0] = value.toFixed(2);
  }
  return newValue.join('');
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
  // 未自选指数 4.7.0已废除
  const zindexSetting = GetStorage(CONST.STORAGE.ZINDEX_SETTING);
  if (zindexSetting !== null) {
    SetStorage(
      CONST.STORAGE.ZINDEX_SETTING,
      zindexSetting.filter((zindex: any) => zindex.show !== false)
    );
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

export function CalcZDHC(list: number[]) {
  try {
    const mins: number[] = [];
    const HCs: number[] = [];
    if (list.length) {
      let min = list[list.length - 1];
      for (let i = 0; i < list.length; i++) {
        min = Math.min(list[list.length - 1 - i], min);
        mins.unshift(min);
      }
      for (let i = 0; i < list.length; i++) {
        const HC = (list[i] - mins[i]) / list[i];
        HCs.unshift(HC);
      }
      return NP.times(Math.max(...HCs), 100).toFixed(2);
    } else {
      return '--';
    }
  } catch (error) {
    console.log('最大回撤计算出错');
    return '--';
  }
}

export function GenerateBackupConfig() {
  const config = Object.keys(CONST.STORAGE).reduce<Record<string, any>>((data, key) => {
    const content = GetStorage(key);
    if (content !== undefined) {
      data[key] = content;
    }
    return data;
  }, {});
  const fileConfig: Backup.Config = {
    name: 'Fishing-Funds-Backup',
    author: '1zilc',
    website: 'https://ff.1zilc.top',
    github: 'https://github.com/1zilc/fishing-funds',
    version: version,
    content: encodeFF(config),
    timestamp: Date.now(),
    suffix: 'ff',
  };
  return fileConfig;
}

export function coverBackupConfig(fileConfig: Backup.Config) {
  const content = decodeFF(fileConfig.content);
  Object.entries(content).forEach(([key, value]) => {
    if (key in CONST.STORAGE && value !== undefined) {
      SetStorage(key, value);
    }
  });
}
