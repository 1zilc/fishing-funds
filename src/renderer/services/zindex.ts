import dayjs from 'dayjs';
import NP from 'number-precision';

const got = window.contextModules.got;
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
        f107: number; // market
        f168: number; // 换手
        f169: number; // 涨跌点
        f170: number; // 涨跌幅
        f171: number; // 振幅
      };
    }>('http://push2.eastmoney.com/api/qt/stock/get?=', {
      searchParams: {
        fields: 'f43,f44,f45,f46,f57,f58,f60,f107,f168,f169,f170,f171',
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
      type: data.data.f107,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function GetTrendFromEastmoney(code: string, ndays: number) {
  try {
    const { body } = await got<{
      rc: 0;
      rt: 10;
      svr: 2887136043;
      lt: 1;
      full: 1;
      data: {
        code: '399293';
        market: 0;
        type: 5;
        status: 0;
        name: '创业大盘';
        decimal: 2;
        preSettlement: 0.0;
        preClose: 5547.32;
        beticks: '33300|34200|54000|34200|41400|46800|54000';
        trendsTotal: 482;
        time: 1617348843;
        trends: ['2021-04-01 09:30,5441.55,34310,5441.553'];
      };
    }>('http://push2his.eastmoney.com/api/qt/stock/trends2/get', {
      searchParams: {
        secid: code,
        ndays,
        iscr: 0,
        fields1: 'f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11',
        fields2: 'f51,f53,f56,f58',
        _: new Date().getTime(),
      },
      responseType: 'json',
    });
    return (body?.data?.trends || []).map((_) => {
      const [time, price, cjl] = _.split(',');
      return {
        time,
        price,
        cjl,
      };
    });
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function GetKFromEastmoney(code: string, year: number) {
  try {
    const { body } = await got<{
      rc: 0;
      rt: 17;
      svr: 181734976;
      lt: 1;
      full: 0;
      data: {
        code: '399293';
        market: 0;
        name: '创业大盘';
        decimal: 2;
        dktotal: 477;
        klines: [
          '2019-04-18,3105.00,3078.87,3113.69,3077.85,13321590,21989221888.00,0.00'
        ];
      };
    }>('http://push2his.eastmoney.com/api/qt/stock/kline/get', {
      searchParams: {
        secid: code,
        fields1: 'f1,f2,f3,f4,f5',
        fields2: 'f51,f52,f53,f54,f55,f56,f57,f58',
        klt: 101,
        fqt: 0,
        beg: `${dayjs().get('year') - year}0101`,
        end: `${dayjs().get('year') + 1}0101`,
        _: new Date().getTime(),
      },
      responseType: 'json',
    });
    return (body?.data?.klines || []).map((_) => {
      const [date, kp, sp, zg, zd, cjl, cje, zf] = _.split(',');
      return {
        date,
        kp: Number(kp),
        sp: Number(sp),
        zg: Number(zg),
        zd: Number(zd),
        cjl,
        cje,
        zf,
      };
    });
  } catch (error) {
    console.log(error);
    return [];
  }
}
