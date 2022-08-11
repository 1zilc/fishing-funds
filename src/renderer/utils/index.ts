import NP from 'number-precision';
import dayjs from 'dayjs';
import * as CONST from '@/constants';

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

export function GetVariblesColor(): Record<keyof typeof CONST.VARIBLES, string> {
  return Object.keys(CONST.VARIBLES).reduce<Record<string, string>>((colorMap, varible) => {
    const color = window.getComputedStyle(document.body).getPropertyValue(varible);
    colorMap[varible] = (color || '').trim();
    return colorMap;
  }, {});
}

export function Parsepingzhongdata(code: string) {
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
  const varibleColors = GetVariblesColor();
  return {
    color:
      value > 0 ? varibleColors['--increase-color'] : value < 0 ? varibleColors['--reduce-color'] : varibleColors['--reverse-text-color'],
    textClass: value > 0 ? 'text-up' : value < 0 ? 'text-down' : 'text-none',
    blockClass: value > 0 ? 'block-up' : value < 0 ? 'block-down' : 'block-none',
    bgClass: value > 0 ? 'bg-up' : value < 0 ? 'bg-down' : 'bg-none',
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

export function CheckUrlValid(value: string) {
  const domainReg = new RegExp('((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)');
  const valid = domainReg.test(`http://${value}`) || domainReg.test(`https://${value}`) || domainReg.test(value);
  return {
    valid,
    url: value.startsWith('http://') || value.startsWith('https://') ? value : `http://${value}`,
  };
}

export function CalculateMA(dayCount: any, values: any[]) {
  const result = [];
  for (let i = 0, len = values.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    let sum = 0;
    for (let j = 0; j < dayCount; j++) {
      sum += values[i - j][1];
    }
    result.push(NP.divide(sum, dayCount).toFixed(2));
  }
  return result;
}

export function GetCodeMap<T extends Record<string, any>>(list: T[], key: keyof T) {
  type extraData = {
    originSort: number;
  };
  return list.reduce<Record<string, T & extraData>>((r, c, i) => {
    if (c instanceof Object) {
      const indexKey = c[key];
      if (indexKey !== undefined && indexKey !== null) {
        if (Array.isArray(c)) {
          r[indexKey] = c as any;
        } else {
          r[indexKey] = { ...c, originSort: i };
        }
      }
    }
    return r;
  }, {});
}

export function GenerateRequestKey(api: string, key?: any) {
  return JSON.stringify({
    api,
    key,
  });
}

export function ConvertKData(data: any[]) {
  // https://github.com/mudenglong/hxc3-indicatorFormula#demo
  return data.map((_) => ({
    t: _.date,
    o: _.kp,
    a: _.zg,
    i: _.zd,
    c: _.sp,
    n: _.cjl,
    np: _.cje,
    // t --> time
    // o --> openPrice 开盘价
    // a --> maxPrice 最高价
    // i --> minPrice 最低价
    // c --> closePrice 收盘价
    // n --> volume 成交量
    // np --> turnover 成交金额
    // n, np字段根据技术指标需要传入，有些技术指标不需要这两个字段
  }));
}

export function MakeSearchParams(config: { _nav: string; data?: Record<string, unknown> }) {
  const data = config.data || {};
  const search = '?' + new URLSearchParams({ ...data, _nav: config._nav }).toString();
  return search;
}

export function ParseSearchParams() {
  const data = new URLSearchParams(window.location.search);
  return data;
}

export function CheckListOrderHasChanged<I1, I2 extends I1, K extends keyof I1>(list1: I1[], list2: I2[], key: K) {
  return list1.map((i) => i[key]).toString() !== list2.map((i) => i[key]).toString();
}

export function MergeStateWithResponse<C, CK extends keyof C, SK extends keyof S, S, R extends S>(params: {
  config: C[];
  configKey: CK;
  stateKey: SK;
  state: S[];
  response: R[];
}) {
  const stateCodeToMap = GetCodeMap(params.state, params.stateKey);
  const responseCodeToMap = GetCodeMap(params.response, params.stateKey);

  const stateWithChachedCodeToMap = params.config.reduce<Record<string, S>>((map, current) => {
    const index = current[params.configKey] as unknown as string;
    const stateItem = stateCodeToMap[index];
    const responseItem = responseCodeToMap[index];
    if (stateItem || responseItem) {
      map[index] = { ...(stateItem || {}), ...(responseItem || {}) };
    }
    return map;
  }, {});

  const sortMap = params.state.reduce<Record<string, number>>((map, current, index) => {
    map[current[params.stateKey] as unknown as string] = index;
    return map;
  }, {});

  const stateWithChached = Object.values(stateWithChachedCodeToMap);

  stateWithChached.sort((a, b) => {
    return sortMap[a[params.stateKey] as unknown as string] < sortMap[b[params.stateKey] as unknown as string] ? -1 : 1;
  });

  return stateWithChached;
}
