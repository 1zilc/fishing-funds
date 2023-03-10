import request from '@/utils/request';

/**
 * 淘宝接口拿当前时间
 */
export async function GetCurrentDateTimeFromTaobao() {
  try {
    const res = await request<{
      api: string; // 'mtop.common.getTimestamp'
      v: string; // '*'
      ret: string[]; // ['SUCCESS::接口调用成功']
      data: {
        t: string; // 1592663852058
      };
    }>('https://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp', {
      responseType: 'json',
    });
    return res?.body?.data?.t;
  } catch (error) {
    return;
  }
}

/**
 * 苏宁接口拿当前时间
 */
export async function GetCurrentDateTimeFromSuning() {
  try {
    const res = await request<{
      api: 'time';
      code: '1';
      currentTime: string; //  1592663735507
      msg: '';
    }>('https://f.m.suning.com/api/ct.do', {
      responseType: 'json',
    });
    return res?.body?.currentTime;
  } catch (error) {
    return;
  }
}
