import got from 'got';

/**
 * 淘宝接口拿当前时间
 */
export const GetCurrentDateTimeFromTaobao: () => Promise<
  string | null
> = async () => {
  try {
    const res = await got<{
      api: string; //'mtop.common.getTimestamp'
      v: string; // '*'
      ret: string[]; // ['SUCCESS::接口调用成功']
      data: {
        t: string; // 1592663852058
      };
    }>('http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp', {
      responseType: 'json',
    });
    return res?.body?.data?.t;
  } catch {
    return null;
  }
};

/**
 * 苏宁接口拿当前时间
 */
export const GetCurrentDateTimeFromSuning: () => Promise<
  string | null
> = async () => {
  try {
    const res = await got<{
      api: 'time';
      code: '1';
      currentTime: string; //  1592663735507
      msg: '';
    }>('https://f.m.suning.com/api/ct.do', {
      responseType: 'json',
    });
    return res?.body?.currentTime;
  } catch {
    return null;
  }
};

/**
 * 京东接口拿当前时间
 */
export const GetCurrentDateTimeFromJd: () => Promise<
  string | null
> = async () => {
  try {
    const res = await got<{
      serverTime: string; //1592663800521
    }>('https://a.jd.com//ajax/queryServerData.html', {
      responseType: 'json',
    });
    return res?.body?.serverTime;
  } catch {
    return null;
  }
};
