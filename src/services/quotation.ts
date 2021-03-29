import got from 'got';
import NP from 'number-precision';

export async function GetQuotationsFromEastmoney() {
  try {
    const { body: data } = await got<{
      rc: 0;
      rt: 6;
      svr: 2887254391;
      lt: 1;
      full: 1;
      data: {
        total: number;
        diff: {
          f14: string; // name
          f2: number; // 最新价
          f3: number; // 涨跌幅
          f4: number; // 涨跌额
          f12: string; // "BK0428" 板块代码
          f20: number; // 总市值
          f8: number; // 换手率
          f104: number; // 上涨家数
          f105: number; // 下跌家数
          f128: string; // 领涨股票
          f140: string; // 领涨股票code
          f136: number; // 领涨股票zdf
          f207: string; // 领跌股票
          f208: string; // 领跌股票code
          f222: number; // 领跌股票zdf
        }[];
      };
    }>('http://77.push2.eastmoney.com/api/qt/clist/get?=', {
      searchParams: {
        fs: 'm:90+t:2+f:!50',
        fid: 'f3',
        invt: 2,
        fltt: 2,
        np: 1,
        po: 1,
        pn: 1,
        pz: 100,
        fields:
          'f2,f3,f4,f8,f12,f14,f20,f128,f136,f104,f105,f140,f207,f208,f222',
        _: new Date().getTime(),
      },
      responseType: 'json',
      retry: 0,
    });
    const result: Quotation.ResponseItem[] = data.data.diff.map((i) => ({
      code: i.f12, // 板块代码
      name: i.f14, // 板块名称
      zxj: i.f2, // 最新价
      zde: i.f4, // 涨跌额
      zdf: i.f3, // 涨跌幅 -0.44
      zsz: i.f20, // 总市值
      hs: i.f8, // 换手
      szjs: i.f104, // 上涨家数
      xdjs: i.f105, // 下跌家数
      lzgpCode: i.f140, // 领涨股票code
      lzgpName: i.f128, // 领涨股票
      lzgpZdf: i.f136, // 领涨股票涨跌幅
      ldgpCode: i.f208, // 领跌股票code
      ldgpName: i.f207, // 领跌股票
      ldgpZdf: i.f222, // 领跌股票涨跌幅
    }));

    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
}

/**
 *
 * @param code 板块代码: BK0428
 * 从天天基金获取板块详情
 */
export async function GetQuotationDetailFromEastmoney(code: string) {
  try {
    const {
      body: { data },
    } = await got<{
      rc: 0;
      rt: 4;
      svr: 181735162;
      lt: 1;
      full: 1;
      data: {
        f43: 11722.47; // 总市值
        f57: 'BK0428'; // code
        f58: '电力行业'; // name
        f60: 11344.57;
        f107: 90;
        f113: 68; // 上涨家数
        f114: 8; // 下跌家数
        f168: 1.7; // 换手率
        f169: 377.9; // 涨跌点
        f170: 3.33; // 涨跌幅
        f171: 4.29;
        f444: 10.06;
      };
    }>('http://push2.eastmoney.com/api/qt/stock/get', {
      searchParams: {
        invt: 2,
        fltt: 2,
        _: new Date().getTime(),
        secid: `90.${code}`,
        fields:
          'f57,f58,f107,f43,f169,f170,f171,f47,f48,f60,f46,f44,f45,f168,f113,f114,f444,f445,f446,f447',
      },
      responseType: 'json',
      retry: 0,
    });
    console.log(data);
    return {
      zsz: data.f43,
      name: data.f58,
      code: data.f57,
      szjs: data.f113,
      xdjs: data.f114,
      zdf: data.f170,
      zdd: data.f169,
      hsl: data.f168,
    };
  } catch (error) {
    console.log(error);
    return {};
  }
}

/**
 *
 * @param code 板块代码: BK0428
 * 从天天基金获取板块资金流向
 */
export async function GetFundFlowFromEasymoney(code: string) {
  try {
    const {
      body: { data },
    } = await got('http://push2.eastmoney.com/api/qt/stock/fflow/kline/get', {
      searchParams: {
        lmt: 0,
        klt: 1,
        fields1: 'f1,f2,f3,f7',
        fields2: 'f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61,f62,f63,f64,f65',
        secid: `90.${code}`,
        _: new Date().getTime(),
      },
      responseType: 'json',
      retry: 0,
    });
    const billion = Math.pow(10, 8);
    const result = (data?.klines || []).map((item: string) => {
      const [datetime, zljlr, xdjlr, zdjlr, ddjlr, cddjlr] = item.split(',');
      return {
        datetime,
        zljlr: NP.divide(zljlr, billion).toFixed(2),
        xdjlr: NP.divide(xdjlr, billion).toFixed(2),
        zdjlr: NP.divide(zdjlr, billion).toFixed(2),
        ddjlr: NP.divide(ddjlr, billion).toFixed(2),
        cddjlr: NP.divide(cddjlr, billion).toFixed(2),
      };
    });
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
}

/**
 *
 * @param code 板块代码: BK0428
 * 从天天基金获取板块个股资金流
 */
export async function GetStocksFromEasymoney(code: string) {
  try {
    const {
      body: { data },
    } = await got('http://push2.eastmoney.com/api/qt/clist/get', {
      searchParams: {
        fid: 'f62',
        po: 1,
        pz: 1000,
        pn: 1,
        np: 1,
        invt: 2,
        fltt: 2,
        fields:
          'f12,f14,f2,f3,f62,f184,f66,f69,f72,f75,f78,f81,f84,f87,f204,f205,f124',
        fs: `b:${code}`,
      },
      responseType: 'json',
      retry: 0,
    });
    return data?.diff || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}
