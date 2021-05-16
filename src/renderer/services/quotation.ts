import NP from 'number-precision';

const got = window.contextModules.got;

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
    });
    return {
      zxj: data.f43,
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
export async function GetRealTimeFundFlowFromEasymoney(code: string) {
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
    } = await got<{
      rc: 0;
      rt: 6;
      svr: 182996357;
      lt: 1;
      full: 1;
      data: {
        total: 80;
        diff: [
          {
            f2: 5.23;
            f3: 8.96;
            f12: '000875';
            f14: '吉电股份';
            f62: 56509098.0;
            f66: 72405039.0;
            f69: 12.92;
            f72: -15895941.0;
            f75: -2.84;
            f78: -29907496.0;
            f81: -5.34;
            f84: -26601602.0;
            f87: -4.75;
            f124: 1616984001;
            f184: 10.09;
            f204: '-';
            f205: '-';
            f206: '-';
          }
        ];
      };
    }>('http://push2.eastmoney.com/api/qt/clist/get', {
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
    });
    return (data?.diff || []).map((item) => ({
      code: item.f12,
      name: item.f14,
      zxj: item.f2,
      zdf: item.f3,
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}

/**
 *
 * @param code 板块代码: BK0428
 * 从天天基金获取板块实时成交分布
 */
export async function GetTransactionFromEasymoney(code: string) {
  try {
    const {
      body: { data },
    } = await got<{
      rc: 0;
      rt: 11;
      svr: 182995396;
      lt: 1;
      full: 1;
      data: {
        total: 1;
        diff: [
          {
            f6: 18671222528.0;
            f62: -861546080.0;
            f64: 2082602048.0;
            f65: 2482662560.0;
            f66: -400060512.0;
            f69: -2.14;
            f70: 4556392192.0;
            f71: 5017877760.0;
            f72: -461485568.0;
            f75: -2.47;
            f76: 6086943488.0;
            f77: 5930204672.0;
            f78: 156738816.0;
            f81: 0.84;
            f82: 5428577280.0;
            f83: 4723770112.0;
            f84: 704807168.0;
            f87: 3.77;
            f124: 1616986105;
            f164: -6896593648.0;
            f166: -2523777520.0;
            f168: -4372816128.0;
            f170: 232775680.0;
            f172: 6663817728.0;
            f184: -4.61;
            f252: -6635553904.0;
            f253: 1400940720.0;
            f254: -8036494624.0;
            f255: -2676087504.0;
            f256: 9311642336.0;
            f278: -4418894512.0;
            f279: -764823984.0;
            f280: -3654070528.0;
            f281: -533206784.0;
            f282: 4952101376.0;
          }
        ];
      };
    }>('http://push2.eastmoney.com/api/qt/ulist.np/get', {
      searchParams: {
        fltt: 2,
        fields:
          'f62,f184,f66,f69,f72,f75,f78,f81,f84,f87,f64,f65,f70,f71,f76,f77,f82,f83,f164,f166,f168,f170,f172,f252,f253,f254,f255,f256,f124,f6,f278,f279,f280,f281,f282',
        secids: `90.${code}`,
        _: new Date().getTime(),
      },
      responseType: 'json',
    });

    const temp = data?.diff?.[0] || {};
    const billion = Math.pow(10, 8);
    return {
      cddlr: Number(NP.divide(temp.f64, billion).toFixed(2)),
      cddlc: Number(NP.divide(temp.f65, billion).toFixed(2)),
      ddlr: Number(NP.divide(temp.f70, billion).toFixed(2)),
      ddlc: Number(NP.divide(temp.f71, billion).toFixed(2)),
      zdlr: Number(NP.divide(temp.f76, billion).toFixed(2)),
      zdlc: Number(NP.divide(temp.f77, billion).toFixed(2)),
      xdlr: Number(NP.divide(temp.f82, billion).toFixed(2)),
      xdlc: Number(NP.divide(temp.f83, billion).toFixed(2)),
    };
  } catch (error) {
    console.log(error);
    return {};
  }
}

/**
 *
 * @param code 板块代码: BK0428
 * 从天天基金获取板盘后资金走向
 */
export async function GetAfterTimeFundFlowFromEasymoney(code: string) {
  try {
    const {
      body: { data },
    } = await got<{
      rc: 0;
      rt: 22;
      svr: 2887122959;
      lt: 1;
      full: 0;
      data: {
        code: 'BK0428';
        market: 90;
        name: '电力行业';
        klines: [
          '2021-01-21,-575181168.0,578836480.0,-3655168.0,-449500912.0,-125680256.0,-3.99,4.01,-0.03,-3.12,-0.87,10533.62,0.08,0.00,0.00'
        ];
      };
    }>('http://push2his.eastmoney.com/api/qt/stock/fflow/daykline/get', {
      searchParams: {
        lmt: 0,
        klt: 101,
        fields1: 'f1,f2,f3,f7',
        fields2: 'f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61,f62,f63,f64,f65',
        secid: `90.${code}`,
        _: new Date().getTime(),
      },
      responseType: 'json',
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
