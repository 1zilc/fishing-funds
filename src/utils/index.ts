import NP from 'number-precision';
import dayjs from 'dayjs';

export function Yang(num: string | number) {
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

export function DeepCopy<T>(data: T) {
  let dataTmp = undefined;

  if (data === null || !(typeof data === 'object')) {
    dataTmp = data;
  } else {
    dataTmp = data.constructor.name === 'Array' ? [] : {};

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
