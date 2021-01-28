import NP from 'number-precision';
export const Yang = num => {
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

export const DeepCopy = data => {
  let dataTmp = undefined;

  if (data === null || !(typeof data === 'object')) {
    dataTmp = data;
  } else {
    dataTmp = data.constructor.name === 'Array' ? [] : {};

    for (let key in data) {
      dataTmp[key] = deepCopy(data[key]);
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
