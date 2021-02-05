import got from 'got';
import NP from 'number-precision';
/**
 *
 * @param code 指数代码: 000001
 * 从天天基金获取指数行情
 */
export const FromEastmoney: (
  code: string
) => Promise<Zindex.ResponseItem | null> = async (code) => {
  try {
    const { body: data } = await got<{
      rc: 0;
      rt: 4;
      svr: 182481189;
      lt: 1;
      full: 1;
      data: {
        f57: string;
        f58: string;
        f169: number;
        f170: number;
      };
    }>('http://push2.eastmoney.com/api/qt/stock/get?=', {
      searchParams: {
        fields: 'f57,f58,f169,f170,f43',
        secid: code, // 1.000001
      },
    });
    return {
      name: data.data.f58,
      zindexCode: data.data.f57,
      zde: NP.divide(data.data.f169, 100),
      zdf: NP.divide(data.data.f170, 100),
    };
  } catch {
    return null;
  }
};
