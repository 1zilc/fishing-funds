import NP from 'number-precision';
import dayjs from 'dayjs';

import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';

const { invoke } = window.contextModules.electron;
const { version, production } = window.contextModules.process;
const { encodeFF, decodeFF } = window.contextModules.io;
const electronStore = window.contextModules.electronStore;
const log = window.contextModules.log;

export function Yang(num: string | number | undefined) {
  try {
    if (num === undefined) {
      return '';
    }
    if (Number(num) > 0) {
      return `+${num}`;
    } else {
      return String(num);
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
      return data;
    }
  }
}

export async function GetStorage<T = any>(key: string, init: T): Promise<T> {
  return electronStore.get(key, init);
}

export async function SetStorage(key: string, data: any) {
  return electronStore.set(key, data);
}

export async function CoverStorage(data: any) {
  return electronStore.cover(data);
}

export async function ClearStorage(key: string) {
  return electronStore.delete(key);
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
    string: value > 0 ? '↗' : value < 0 ? '↘' : '-',
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
    return '--';
  }
}

export async function GenerateBackupConfig() {
  const config = await electronStore.all();
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

export async function CoverBackupConfig(fileConfig: Backup.Config) {
  const content = decodeFF(fileConfig.content);
  return CoverStorage(content);
}

export function ColorRgba(sHex: string, alpha = 1) {
  // 十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase().trim();
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#';
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //  处理六位的颜色值
    const sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
    }
    // return sColorChange.join(',')
    // 或
    return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')';
  } else {
    return sColor;
  }
}

export function CheckEnvTool() {
  if (production) {
    Object.assign(console, log.functions);
  }
}

export function GetWeekDay(day: number) {
  return ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][day];
}

export function GetValueMapColor(value: any = 0) {
  const alphas = [0.6, 0.7, 0.8, 0.9, 1];
  const alphaindex = Math.ceil(Math.min(Math.abs(value) * 1.5, 5));
  const colorAlpha = value === 0 ? 1 : alphas[alphaindex];
  const color = GetValueColor(value).color;
  const rgba = ColorRgba(color, colorAlpha);
  return rgba;
}

export function GbLength(str: string) {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
      len += 2;
    } else {
      len++;
    }
  }
  return len;
}
