export const Yang = num => {
  if (num < 0) {
    return num;
  } else {
    return `+${num}`;
  }
};

export const CalcWithPrefix = (a: any, b: any) => {
  if (b >= a) {
    return `+${Minus(b, a)}`;
  } else {
    return Minus(b, a);
  }
};

export const Minus = (arg1, arg2) => {
  var r1, r2, m, n;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  //动态控制精度长度
  n = r1 >= r2 ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
};

export const Multiply = (arg1, arg2) => {
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split('.')[1].length;
  } catch (e) {}
  try {
    m += s2.split('.')[1].length;
  } catch (e) {}
  return (
    (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
    Math.pow(10, m)
  );
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
