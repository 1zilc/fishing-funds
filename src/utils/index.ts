import NP from 'number-precision';
import dayjs from 'dayjs';

export const Yang = (num) => {
  if (num < 0) {
    return num;
  } else {
    return `+${num}`;
  }
};

export const CalcWithPrefix = (a: any, b: any) => {
  if (b >= a) {
    return `+${NP.minus(b, a)}`;
  } else {
    return NP.minus(b, a);
  }
};

export const DeepCopy: <T>(d: T) => T = (data) => {
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
};

export const GetStorage = (key: string, init: any) => {
  const json = localStorage.getItem(key);
  return json ? JSON.parse(json) : init;
};

export const SetStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const Encrypt = (s: string) => {
  return s.replace(/[0-9]/g, '✱');
};

export const Sleep: <T>(time: number, F?: T) => Promise<T | undefined> = async (
  time,
  F
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(F);
    }, time);
  });
};

export const JudgeWorkDayTime: (timestamp: number) => boolean = (timestamp) => {
  const now = dayjs(timestamp);
  const hour = now.get('hour');
  const day = now.get('day');
  const minute = now.get('minute');
  const minites = hour * 60 + minute;
  const isWorkDay = day >= 1 && day <= 5;
  const isMorningWorkTime = minites >= 9 * 60 + 30 && minites <= 11 * 60 + 30;
  const isAfternoonWorkTime = minites >= 13 * 60 && minites <= 15 * 60;
  return isWorkDay && (isMorningWorkTime || isAfternoonWorkTime);
};
