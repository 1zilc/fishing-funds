import got from 'got';
import NP from 'number-precision';
/**
 *
 * @param code 指数代码: 000001
 * 从天天基金获取指数行情
 */
export async function FromEastmoney(code: string) {
  try {
    const { body: data } = await got<{
      rc: 0;
      rt: 4;
      svr: 182481189;
      lt: 1;
      full: 1;
      data: {
        f43: number; // 当前
        f44: number; // 最高
        f45: number; // 最低
        f46: number; // 今开
        f57: string; // code
        f58: string; // name
        f60: number; // 昨收
        f168: number; // 换手
        f169: number; // 涨跌点
        f170: number; // 涨跌幅
        f171: number; // 振幅
      };
    }>('http://push2.eastmoney.com/api/qt/stock/get?=', {
      searchParams: {
        fields: 'f43,f44,f45,f46,f57,f58,f60,f168,f169,f170,f171',
        secid: code, // 1.000001
        _: new Date().getTime(),
      },
      responseType: 'json',
    });

    return {
      zsz: NP.divide(data.data.f43, 100),
      zg: NP.divide(data.data.f44, 100),
      zd: NP.divide(data.data.f45, 100),
      jk: NP.divide(data.data.f46, 100),
      zindexCode: data.data.f57,
      name: data.data.f58,
      zs: NP.divide(data.data.f60, 100),
      hs: NP.divide(data.data.f168, 100),
      zdd: NP.divide(data.data.f169, 100),
      zdf: NP.divide(data.data.f170, 100),
      zf: NP.divide(data.data.f171, 100),
    };
  } catch (err) {
    return null;
  }
}
