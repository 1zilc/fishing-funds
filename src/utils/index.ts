import NP from 'number-precision';
import dayjs from 'dayjs';
import { remote } from 'electron';

import * as Enums from '@/utils/enums';
const { nativeTheme } = remote;

export function Yang(num: string | number | undefined) {
  if (num === undefined) {
    return '';
  }
  if (Number(num) < 0) {
    return String(num);
  } else {
    return `+${num}`;
  }
}

export function CalcWithPrefix(a: any, b: any) {
  if (b >= a) {
    return `+${NP.minus(b, a)}`;
  } else {
    return NP.minus(b, a);
  }
}

export function DeepCopy<T>(data: T): T {
  let dataTmp: any = undefined;
  if (data === null || !(typeof data === 'object')) {
    dataTmp = data;
  } else {
    dataTmp = data instanceof Array ? [] : {};
    for (let key in data) {
      dataTmp[key] = DeepCopy(data[key]);
    }
  }

  return dataTmp;
}

export function GetStorage(key: string, init: any) {
  const json = localStorage.getItem(key);
  return json ? JSON.parse(json) : init;
}

export function SetStorage(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function Encrypt(s: string) {
  return s.replace(/[0-9]/g, '✱');
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

export function JudgeAdjustmentNotificationTime(timestamp: number) {
  const now = dayjs(timestamp);
  const hour = now.get('hour');
  const day = now.get('day');
  const minute = now.get('minute');
  const isWorkDay = day >= 1 && day <= 5;
  return {
    isAdjustmentNotificationTime: isWorkDay && hour === 14 && minute >= 30,
    now,
  };
}

//TODO: 类型推断有问题
export function getVariblesColor(varibles: string[]) {
  return varibles.reduce<{ [index: string]: string }>((colorMap, varible) => {
    const color = window
      .getComputedStyle(document.body)
      .getPropertyValue(varible);
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

export function UpdateSystemTheme(setting: Enums.SystemThemeType) {
  switch (setting) {
    case Enums.SystemThemeType.Light:
      nativeTheme.themeSource = 'light';
      break;
    case Enums.SystemThemeType.Dark:
      nativeTheme.themeSource = 'dark';
      break;
    case Enums.SystemThemeType.Auto:
    default:
      nativeTheme.themeSource = 'system';
  }
}
