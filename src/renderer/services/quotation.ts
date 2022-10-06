import NP from 'number-precision';
import request from '@/utils/request';

const { base64 } = window.contextModules;

export async function GetQuotationsFromEastmoney() {
  try {
    const { body: data } = await request<{
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
          f4: number; // 涨跌点
          f12: string; // "BK0428" 板块代码
          f19: number; // 板块分类 1 地域 2 行业 3 概念
          f20: number; // 总市值
          f8: number; // 换手率
          f104: number; // 上涨家数
          f105: number; // 下跌家数
          f128: string; // 领涨股票
          f140: string; // 领涨股票code
          f141: number; // 领涨股票market
          f136: number; // 领涨股票zdf
          f207: string; // 领跌股票
          f208: string; // 领跌股票code
          f209: number; // 领跌股票market
          f222: number; // 领跌股票zdf
        }[];
      };
    }>('http://77.push2.eastmoney.com/api/qt/clist/get', {
      searchParams: {
        fs: 'm:90',
        fid: 'f3',
        invt: 2,
        fltt: 2,
        np: 1,
        po: 1,
        pn: 1,
        pz: 1000,
        fields: 'f2,f3,f4,f8,f12,f14,f19,f20,f128,f136,f104,f105,f140,f207,f208,f222',
        _: Date.now(),
      },
      responseType: 'json',
    });
    const result: Quotation.ResponseItem[] = data.data.diff.map((i) => {
      i.f3 = Number(i.f3) || 0;

      return {
        code: i.f12, // 板块代码
        name: i.f14, // 板块名称
        type: i.f19, // 板块分类
        zxj: i.f2, // 最新价
        zde: NP.times(i.f20, i.f3, 10 ** -2), // 涨跌额
        zdd: i.f4, // 涨跌点
        zdf: i.f3, // 涨跌幅 -0.44
        zsz: i.f20, // 总市值
        hs: i.f8, // 换手
        szjs: i.f104, // 上涨家数
        xdjs: i.f105, // 下跌家数
        lzgpCode: i.f140, // 领涨股票code
        lzgpMarket: i.f141, // 领涨股票code
        lzgpName: i.f128, // 领涨股票
        lzgpZdf: i.f136, // 领涨股票涨跌幅
        ldgpCode: i.f208, // 领跌股票code
        ldgpMarket: i.f209, // 领跌股票code
        ldgpName: i.f207, // 领跌股票
        ldgpZdf: i.f222, // 领跌股票涨跌幅
      };
    });

    return result;
  } catch (error) {
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
    } = await request<{
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
        _: Date.now(),
        secid: `90.${code}`,
        fields: 'f57,f58,f107,f43,f169,f170,f171,f47,f48,f60,f46,f44,f45,f168,f113,f114,f444,f445,f446,f447',
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
    return;
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
    } = await request('http://push2.eastmoney.com/api/qt/stock/fflow/kline/get', {
      searchParams: {
        lmt: 0,
        klt: 1,
        fields1: 'f1,f2,f3,f7',
        fields2: 'f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61,f62,f63,f64,f65',
        secid: `90.${code}`,
        _: Date.now(),
      },
      responseType: 'json',
    });
    const billion = 10 ** 8;
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
    return [];
  }
}

export async function GetStocksFromEasymoney(code: string) {
  try {
    const {
      body: { data },
    } = await request<{
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
            f13: '0';
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
        fields: 'f12,f13,f14,f2,f3,f62,f184,f66,f69,f72,f75,f78,f81,f84,f87,f204,f205,f124',
        fs: `b:${code}`,
      },
      responseType: 'json',
    });
    return (data?.diff || []).map((item) => ({
      code: item.f12,
      market: item.f13,
      name: item.f14,
      zxj: item.f2,
      zdf: item.f3,
    }));
  } catch (error) {
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
    } = await request<{
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
        _: Date.now(),
      },
      responseType: 'json',
    });

    const temp = data?.diff?.[0] || {};
    const billion = 10 ** 8;
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
    return;
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
    } = await request<{
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
        _: Date.now(),
      },
      responseType: 'json',
    });
    const billion = 10 ** 8;
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
    return [];
  }
}

/**
 *
 * @param code 行业m:90+t:3 概念m:90+t:2 地域m:90+t:1
 * @param type f62 f164 f174
 * @returns
 */
export async function GetFundFlowFromEastmoney(code: string, type: string) {
  try {
    const { body: data } = await request<{
      rc: 0;
      rt: 6;
      svr: 2887254391;
      lt: 1;
      full: 1;
      data: {
        total: number;
        diff: {
          f12: string; // "BK0428" 板块代码
          f14: string; // name
          f62: number; // 今天
          f164: number; // 5天
          f174: number; // 10天
          [index: string]: any;
        }[];
      };
    }>('http://push2.eastmoney.com/api/qt/clist/get', {
      searchParams: {
        fs: code,
        fid: type,
        np: 1,
        po: 1,
        pn: 1,
        pz: 500,
        fields: `f12,f14,${type}`,
        _: Date.now(),
      },
      responseType: 'json',
    });
    const result = data.data.diff.map((i) => ({
      code: i.f12, // 板块代码
      name: i.f14, // 板块名称
      value: NP.divide(i[type], 10 ** 8),
    }));

    return result;
  } catch (error) {
    return [];
  }
}

export async function GetFlowFromEastmoney(fields1: string, code: 'n2s' | 's2n') {
  try {
    const { body } = await request<{
      rc: 0;
      rt: 14;
      svr: 2887257311;
      lt: 1;
      full: 1;
      data: {
        n2s: ['9:00,1985.62,2362.16,4347.78', '9:57,-,-,-'];
        n2sDate: '07-12';
        s2n: ['9:00,1985.62,2362.16,4347.78', '9:57,-,-,-'];
        s2nDate: '07-12';
      };
    }>('http://push2.eastmoney.com/api/qt/kamt.rtmin/get', {
      searchParams: {
        fields1,
        fields2: 'f51,f52,f54,f56',
        _: Date.now(),
      },
      responseType: 'json',
    });

    const list = body.data[code];

    return list
      .filter((_) => {
        const [time, h, s, value] = _.split(',');
        return h !== '-' && s !== '-' && value !== '-';
      })
      .map((_) => {
        const [time, h, s, value] = _.split(',');
        return {
          time,
          h: NP.divide(Number(h), 10 ** 4).toFixed(2),
          s: NP.divide(Number(s), 10 ** 4).toFixed(2),
          value: NP.divide(Number(value), 10 ** 4).toFixed(2),
        };
      });
  } catch (error) {
    return [];
  }
}

export async function GetNorthDayFromEastmoney(fields1: string, fields2: string) {
  try {
    const { body } = await request<{
      rc: 0;
      rt: 14;
      svr: 2887257311;
      lt: 1;
      full: 1;
      data: {
        hk2sh: string[];
        hk2sz: string[];
        s2n: string[];
      };
    }>('http://push2his.eastmoney.com/api/qt/kamt.kline/get', {
      searchParams: {
        fields1,
        fields2,
        klt: 101,
        lmt: 365,
        _: Date.now(),
      },
      responseType: 'json',
    });

    return {
      hk2sh: body.data.hk2sh.map((_) => _.split(',')).map(([date, value]) => [date, NP.divide(value, 10 ** 4).toFixed(2)]),
      hk2sz: body.data.hk2sz.map((_) => _.split(',')).map(([date, value]) => [date, NP.divide(value, 10 ** 4).toFixed(2)]),
      s2n: body.data.s2n.map((_) => _.split(',')).map(([date, value]) => [date, NP.divide(value, 10 ** 4).toFixed(2)]),
    };
  } catch (error) {
    return {
      hk2sh: [],
      hk2sz: [],
      s2n: [],
    };
  }
}

export async function GetSouthDayFromEastmoney(fields1: string, fields2: string) {
  try {
    const { body } = await request<{
      rc: 0;
      rt: 14;
      svr: 2887257311;
      lt: 1;
      full: 1;
      data: {
        sh2hk: string[];
        sz2hk: string[];
        n2s: string[];
      };
    }>('http://push2his.eastmoney.com/api/qt/kamt.kline/get', {
      searchParams: {
        fields1,
        fields2,
        klt: 101,
        lmt: 365,
        _: Date.now(),
      },
      responseType: 'json',
    });

    return {
      sh2hk: body.data.sh2hk.map((_) => _.split(',')).map(([date, value]) => [date, NP.divide(value, 10 ** 4).toFixed(2)]),
      sz2hk: body.data.sz2hk.map((_) => _.split(',')).map(([date, value]) => [date, NP.divide(value, 10 ** 4).toFixed(2)]),
      n2s: body.data.n2s.map((_) => _.split(',')).map(([date, value]) => [date, NP.divide(value, 10 ** 4).toFixed(2)]),
    };
  } catch (error) {
    return {
      sh2hk: [],
      sz2hk: [],
      n2s: [],
    };
  }
}

export async function GetFundsFromEastmoney(code: string) {
  try {
    const {
      body: { Data },
    } = await request<{
      Data: [
        {
          FCODE: '168501';
          SHORTNAME: '北信瑞丰产业升级';
          ISSALES: '1';
          ISBUY: '1';
          FTYPE: '混合型-偏股';
          MINSG: '10';
          RATE: '0.15%';
          SOURCERATE: '1.50%';
          SYRQ: '2021-09-30';
          SYL_Z: '-6.27';
          SYL_Y: '-9.09';
          SYL_3Y: '12.62';
          SYL_6Y: '33.11';
          SYL_1N: '40.65';
          SYL_2N: '179.73';
          SYL_3N: '207.1';
          SYL_JN: '13.44';
          DWJZ: '2.7777';
          RZDF: '3.04';
          SON_1N: '91.25';
        }
      ];
      ErrCode: 0;
      ErrMsg: null;
      TotalCount: 30;
      Expansion: null;
      PageSize: 100;
      PageIndex: 1;
    }>('http://api.fund.eastmoney.com/ztjj/GetBKRelTopicFund', {
      headers: {
        Referer: 'http://fund.eastmoney.com/',
      },
      searchParams: {
        sort: 'SYL_Z',
        sorttype: 'asc',
        pagesize: 100,
        pageindex: 1,
        tp: code,
        _: Date.now(),
      },
      responseType: 'json',
    });
    return Data;
  } catch (error) {
    return [];
  }
}

export async function GetQuoteCenterFromEastmoney() {
  try {
    const { body } = await request<{
      re: true;
      message: '';
      result: {
        TopText: {
          PositionInd: 64;
          Title: '市场中期趋势向上';
          Content: '市场短期震荡向上概率较大，利多因素逐渐显现';
        };
        MarketStyle: [
          {
            Category: '权重';
            ThemeList: [
              {
                Code: '010005';
                Name: '煤炭';
                IsImportant: '0';
                TopCode: '010';
                TopName: '供给侧改革';
                DayType: 1;
                Chg: '3.95';
                HotRate: 30.0442;
              }
            ];
          }
        ];
        Recommend: [
          {
            Title: '短线机会';
            DefaultText: '短线机会';
            ThemeList: [
              {
                Code: 'e03002';
                Name: '固废处理';
                Chg: '0.53';
                TopCode: '';
                TopName: '';
                IsImportant: '0';
                Reason: '中央会议重点提及污染防治，环保“十四五”规划编制进入关键阶段';
                StockList: [
                  {
                    Code: '600008';
                    Name: '首创环保';
                    Market: '01';
                    Chg: '0.27';
                  }
                ];
              }
            ];
          }
        ];
      }[];
    }>('http://quote.eastmoney.com/zhuti/api/fenggeindex', {
      responseType: 'json',
    });
    const result = body.result.pop();
    if (!result) {
      throw new Error();
    }
    return {
      ...result,
      MarketStyle: result.MarketStyle || [],
      Recommend: result.Recommend || [],
    };
  } catch (error) {
    return {
      TopText: {
        PositionInd: 0,
        Title: '',
        Content: '',
      },
      MarketStyle: [],
      Recommend: [],
    };
  }
}

export async function GetHodingFromEastmoney(marketCode: string, reportName: string) {
  try {
    const { body } = await request<{
      version: 'a81c1cb169f170d8033693dfe021910a';
      result: {
        pages: 5;
        data: {
          MARKET_CODE: '005';
          HOLD_DATE: '2021-11-04 00:00:00';
          CHANGE_RATE: 0.987946369799;
          ADD_MARKET_CAP: number;
          ADD_MARKET_RATE: number;
          HOLD_MARKET_CAP: 2617466290663.51;
          HOLD_MARKET_RATE: 0.035640881672;
          ADD_MARKET_BCODE: '016031';
          ADD_MARKET_BNAME: '酿酒行业';
          BOARD_RATE_BCODE: '016021';
          BOARD_RATE_BNAME: '仪器仪表';
          MARKET_RATE_BCODE: '016031';
          MARKET_RATE_BNAME: '酿酒行业';
          ADD_MARKET_MCODE: '600460';
          ADD_MARKET_MNAME: '士兰微';
          ADD_SHARES_MCODE: '002027';
          ADD_SHARES_MNAME: '分众传媒';
          MARKET_RATE_MCODE: '300073';
          MARKET_RATE_MNAME: '当升科技';
          ADD_MARKET_OLDBCODE: '477';
          BOARD_RATE_OLDBCODE: '458';
          MARKET_RATE_OLDBCODE: '477';
          ADD_MARKET_NEWBCODE: 'BK0477';
          BOARD_RATE_NEWBCODE: 'BK0458';
          MARKET_RATE_NEWBCODE: 'BK0477';
        }[];
        count: 229;
      };
      success: true;
      message: 'ok';
      code: 0;
    }>('http://datacenter-web.eastmoney.com/api/data/v1/get', {
      searchParams: {
        sortColumns: 'HOLD_DATE',
        sortTypes: -1,
        pageSize: 1000,
        pageNumber: 1,
        columns: 'ALL',
        source: 'WEB',
        client: 'WEB',
        reportName,
        filter: `(MARKET_CODE="${marketCode}")`,
      },
      responseType: 'json',
    });

    const result = body.result?.data || [];
    result.forEach((item) => {
      item.ADD_MARKET_CAP = Number(NP.divide(item.ADD_MARKET_CAP, 10 ** 8).toFixed(2));
      item.ADD_MARKET_RATE = Number(NP.times(item.ADD_MARKET_RATE, 10 ** 3).toFixed(2));
    });
    return result;
  } catch (error) {
    return [];
  }
}

export async function GetMutualQuotaFromEastmoney() {
  try {
    const { body } = await request<{
      version: 'f5a499e30bac57207cc9f491db6bdfdd';
      result: {
        pages: 1;
        data: {
          TRADE_DATE: '2021-11-08 00:00:00';
          MUTUAL_TYPE: '002';
          BOARD_TYPE: '沪港通';
          MUTUAL_TYPE_NAME: '港股通(沪)';
          FUNDS_DIRECTION: '南向';
          INDEX_CODE: 'HSI';
          INDEX_NAME: '恒生指数';
          BOARD_CODE: 'HK32';
          status: number;
          dayNetAmtIn: number;
          dayAmtRemain: number;
          dayAmtThreshold: number;
          f104: 217;
          f105: 133;
          f106: 22;
          INDEX_f3: -0.43;
          netBuyAmt: -37721.68;
        }[];
        count: 4;
      };
      success: true;
      message: 'ok';
      code: 0;
    }>('http://datacenter-web.eastmoney.com/api/data/get', {
      searchParams: {
        type: 'RPT_MUTUAL_QUOTA',
        sty: 'TRADE_DATE,MUTUAL_TYPE,BOARD_TYPE,MUTUAL_TYPE_NAME,FUNDS_DIRECTION,INDEX_CODE,INDEX_NAME,BOARD_CODE',
        extraCols:
          'status~07~BOARD_CODE,dayNetAmtIn~07~BOARD_CODE,dayAmtRemain~07~BOARD_CODE,dayAmtThreshold~07~BOARD_CODE,f104~07~BOARD_CODE,f105~07~BOARD_CODE,f106~07~BOARD_CODE,f3~03~INDEX_CODE~INDEX_f3,netBuyAmt~07~BOARD_CODE',
        p: 1,
        ps: 200,
        sr: 1,
        st: 'MUTUAL_TYPE',
        source: 'WEB',
        client: 'WEB',
        _: Date.now(),
      },
      responseType: 'json',
    });

    const result = body.result?.data || [];
    const statusMap: Record<number, string> = {
      1: '额度可用',
      3: '收盘',
    };
    return result.map((item) => ({
      type: item.BOARD_TYPE,
      quota: item.MUTUAL_TYPE_NAME,
      direction: item.FUNDS_DIRECTION,
      indexName: item.INDEX_NAME,
      indexCode: item.INDEX_CODE,
      indexZdf: item.INDEX_f3,
      dayNetAmtIn: Number(NP.divide(item.dayNetAmtIn, 10 ** 4).toFixed(2)),
      dayAmtRemain: Number(NP.divide(item.dayAmtRemain, 10 ** 4).toFixed(2)),
      dayAmtThreshold: Number(NP.divide(item.dayAmtThreshold, 10 ** 4).toFixed(2)),
      sz: item.f104,
      xd: item.f105,
      cp: item.f106,
      status: statusMap[item.status],
    }));
  } catch (error) {
    return [];
  }
}

export async function GetTodayHotFromEastmoney() {
  try {
    const { body } = await request<{
      re: true;
      message: '';
      result: {
        TableName: 'TodayOpportunityWeb';
        TotalPage: 1;
        ConsumeMSecond: 0;
        SplitSymbol: '|';
        FieldName: 'CategoryPchg,CategoryCode,CategoryName,IsImportant,ParentCode,ParentName,Reason,SecuCode,SecuName,Market,SecuCode2,SecuName2,Market2,IsFocused,Importance';
        Data: [
          '2.06|111|太阳能|0|||2019至2023年，国内光伏焊带市场需求空间可达到121亿元！|002309|中利集团|02||||0|',
          '-0.03|a158|养老概念|0|||再出“实招”提档升级养老服务|300212|易华录|02||||0|',
          '0.71|084|区块链|0|||利用数字财政支持重点项目建设情况开展专项调研|002405|四维图新|02||||0|',
          '1.75|a11|风电|0|||中美达成强化气候行动联合宣言|002309|中利集团|02||||0|',
          '0.69|006003008|VR&AR|0|006|人工智能|炒股的尽头是“元宇宙”？400多家企业注册相关商标 多家上市公司被监管“盯上”|600358|国旅联合|01||||0|'
        ];
      }[];
    }>('http://quote.eastmoney.com/zhuti/api/todayopportunity', {
      responseType: 'json',
    });
    const result = body.result[0].Data.map((item) => {
      const [
        CategoryPchg,
        CategoryCode,
        CategoryName,
        IsImportant,
        ParentCode,
        ParentName,
        Reason,
        SecuCode,
        SecuName,
        Market,
        SecuCode2,
        SecuName2,
        Market2,
        IsFocused,
        Importance,
      ] = item.split('|');

      return {
        zdf: CategoryPchg,
        name: CategoryName,
        reason: Reason,
        stockName: SecuName,
        stockCode: SecuCode,
      };
    });

    return result;
  } catch (error) {
    return [];
  }
}

export async function GetHotThemeFromEastmoney() {
  try {
    const { body } = await request<{
      re: true;
      message: '';
      result: {
        TableName: 'TodayOpportunityWeb';
        TotalPage: 1;
        ConsumeMSecond: 0;
        SplitSymbol: '|';
        FieldName: 'CategoryCode,CategoryName,ParentCode,ParentName,CategoryPchg,SecuCode,SecuName,IsImportant,Market';
        Data: ['a141|虚拟电厂|||6.30|300376|易事特|0|02'];
      }[];
    }>('http://quote.eastmoney.com/zhuti/api/hottheme', {
      searchParams: {
        startIndex: 1,
        pageSize: 100,
      },
      responseType: 'json',
    });
    const result = body.result[0].Data.map((item) => {
      const [CategoryCode, CategoryName, ParentCode, ParentName, CategoryPchg, SecuCode, SecuName, IsImportant, Market] = item.split('|');

      return {
        zdf: CategoryPchg,
        name: CategoryName,
        stockName: SecuName,
        stockCode: SecuCode,
      };
    });

    return result;
  } catch (error) {
    return [];
  }
}

export async function GetRecentHotFromEastmoney() {
  try {
    const { body } = await request<{
      re: true;
      message: '';
      result: {
        TableName: 'TodayOpportunityWeb';
        TotalPage: 1;
        ConsumeMSecond: 0;
        SplitSymbol: '|';
        FieldName: 'CategoryCode,CategoryName,IsImportant,ParentCode,ParentName,SecuCode,SecuName,Market,IsFocused';
        Data: ['a198|元宇宙概念|0|||300081|恒信东方|02|0'];
      }[];
    }>('http://quote.eastmoney.com/zhuti/api/recenthot', {
      searchParams: {
        startIndex: 1,
        pageSize: 100,
      },
      responseType: 'json',
    });
    const result = body.result[0].Data.map((item) => {
      const [CategoryCode, CategoryName, IsImportant, ParentCode, ParentName, SecuCode, SecuName, Market, IsFocused] = item.split('|');

      return {
        name: CategoryName,
        stockName: SecuName,
        stockCode: SecuCode,
      };
    });

    return result;
  } catch (error) {
    return [];
  }
}
// 金价
export async function GetGoldTrendsFromEastmoney(secid: string) {
  try {
    const { body: data } = await request<{
      rc: 0;
      rt: 10;
      svr: 2887263685;
      lt: 1;
      full: 1;
      data: {
        code: 'aum';
        market: 113;
        type: 5;
        status: 0;
        name: '沪金主力';
        decimal: 2;
        preSettlement: 404.8;
        preClose: 405.82;
        beticks: '75600|75600|313200|75600|95400|291600|296100|297000|300600|307800|313200';
        trendsTotal: 556;
        time: 1650047400;
        kind: 16;
        prePrice: 404.8;
        trends: '2022-04-15 21:00,405.82,405.82,405.82,405.82,0,0.00,405.820'[];
      };
    }>('http://push2.eastmoney.com/api/qt/stock/trends2/get', {
      searchParams: {
        secid,
        fields1: 'f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13',
        fields2: 'f51,f52,f53,f54,f55,f56,f57,f58',
        iscr: 0,
      },
      responseType: 'json',
    });

    const result = data.data?.trends?.map((item) => {
      const [time, x, price] = item.split(',');
      return [time, Number(price)];
    });

    return result || [];
  } catch (error) {
    return [];
  }
}
export async function GetGoldKFromEastmoney() {
  try {
    const { body: data } = await request<{
      rc: 0;
      rt: 10;
      svr: 2887263685;
      lt: 1;
      full: 1;
      data: {
        code: 'GC00Y';
        decimal: 1;
        dktotal: 2744;
        market: 101;
        name: 'COMEX黄金';
        klines: '2022-01-26,1848.0,1818.8,1850.2,1814.1,262456,0.0,1.95,-1.82,-33.7,0.00'[];
      };
    }>('http://push2his.eastmoney.com/api/qt/stock/kline/get', {
      searchParams: {
        secid: '101.GC00Y',
        fields1: 'f1,f2,f3,f4,f5',
        fields2: 'f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61',
        lmt: 58,
        klt: 101,
        fqt: 1,
        end: 30000101,
      },
      responseType: 'json',
    });

    const result = data.data?.klines?.map((item) => {
      const [time, k, s, g, d] = item.split(',');
      return [time, Number(k), Number(s), Number(d), Number(g)];
    });

    return result || [];
  } catch (error) {
    return [];
  }
}
export async function GetInternationalMetalFuturesFromEastmoney() {
  try {
    const { body: data } = await request<{
      rc: 0;
      rt: 6;
      svr: 182996800;
      lt: 1;
      full: 1;
      data: {
        total: 8;
        diff: {
          f1: 4;
          f2: 26.0625;
          f3: 1.41;
          f4: 0.3625;
          f5: 102;
          f6: '-';
          f7: 1.75;
          f8: '-';
          f9: '-';
          f10: '-';
          f11: -0.05;
          f12: 'QI00Y';
          f13: 101;
          f14: '迷你白银';
          f15: 26.2125;
          f16: 25.7625;
          f17: 25.7625;
          f18: 25.7;
          f20: '-';
          f21: '-';
          f22: -0.05;
          f23: '-';
          f24: 1.16;
          f25: 1.16;
          f28: 25.7;
          f62: '-';
          f115: '-';
          f124: 1650266643;
          f128: '-';
          f140: '-';
          f141: '-';
          f133: '-';
          f136: '-';
          f152: 2;
        }[];
      };
    }>('http://62.push2.eastmoney.com/api/qt/clist/get', {
      searchParams: {
        pn: 1,
        pz: 20,
        po: 1,
        np: 1,
        fltt: 2,
        invt: 2,
        fid: 'f3',
        fs: 'i:111.JAGC,i:101.QI00Y,i:111.JPAC,i:101.HG00Y,i:111.JAUC,i:111.JPLC,i:102.PL00Y,i:101.QO00Y,i:101.MGC00Y,i:101.GC00Y,i:101.SI00Y,i:102.PA00Y',
        fields:
          'f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14,f15,f16,f17,f18,f20,f21,f23,f24,f25,f22,f28,f11,f62,f128,f136,f115,f152,f133,f124',
        _: Date.now(),
      },
      responseType: 'json',
    });

    const result = data.data?.diff?.map((item) => {
      return {
        name: item.f14,
        zxj: item.f2,
        zdf: item.f3,
      };
    });

    return result || [];
  } catch (error) {
    return [];
  }
}
export async function GetInternationalMetalGoodsFromEastmoney() {
  try {
    const { body: data } = await request<{
      rc: 0;
      rt: 6;
      svr: 182996800;
      lt: 1;
      full: 1;
      data: {
        total: 8;
        diff: {
          f1: 4;
          f2: 26.0625;
          f3: 1.41;
          f4: 0.3625;
          f5: 102;
          f6: '-';
          f7: 1.75;
          f8: '-';
          f9: '-';
          f10: '-';
          f11: -0.05;
          f12: 'QI00Y';
          f13: 101;
          f14: '迷你白银';
          f15: 26.2125;
          f16: 25.7625;
          f17: 25.7625;
          f18: 25.7;
          f20: '-';
          f21: '-';
          f22: -0.05;
          f23: '-';
          f24: 1.16;
          f25: 1.16;
          f28: 25.7;
          f62: '-';
          f115: '-';
          f124: 1650266643;
          f128: '-';
          f140: '-';
          f141: '-';
          f133: '-';
          f136: '-';
          f152: 2;
        }[];
      };
    }>('http://62.push2.eastmoney.com/api/qt/clist/get', {
      searchParams: {
        pn: 1,
        pz: 20,
        po: 1,
        np: 1,
        fltt: 2,
        invt: 2,
        fid: 'f3',
        fs: 'm:122,m:123',
        fields:
          'f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14,f15,f16,f17,f18,f20,f21,f23,f24,f25,f22,f28,f11,f62,f128,f136,f115,f152,f133,f124',
        _: Date.now(),
      },
      responseType: 'json',
    });

    const result = data.data?.diff?.map((item) => {
      return {
        name: item.f14,
        zxj: item.f2,
        zdf: item.f3,
      };
    });

    return result || [];
  } catch (error) {
    return [];
  }
}
export async function GetShanghaiGoldFuturesFromEastmoney() {
  try {
    const { body: data } = await request<{
      rc: 0;
      rt: 6;
      svr: 182996800;
      lt: 1;
      full: 1;
      data: {
        total: 8;
        diff: {
          f1: 4;
          f2: 26.0625;
          f3: 1.41;
          f4: 0.3625;
          f5: 102;
          f6: '-';
          f7: 1.75;
          f8: '-';
          f9: '-';
          f10: '-';
          f11: -0.05;
          f12: 'QI00Y';
          f13: 101;
          f14: '迷你白银';
          f15: 26.2125;
          f16: 25.7625;
          f17: 25.7625;
          f18: 25.7;
          f20: '-';
          f21: '-';
          f22: -0.05;
          f23: '-';
          f24: 1.16;
          f25: 1.16;
          f28: 25.7;
          f62: '-';
          f115: '-';
          f124: 1650266643;
          f128: '-';
          f140: '-';
          f141: '-';
          f133: '-';
          f136: '-';
          f152: 2;
        }[];
      };
    }>('http://62.push2.eastmoney.com/api/qt/clist/get', {
      searchParams: {
        pn: 1,
        pz: 20,
        po: 1,
        np: 1,
        fltt: 2,
        invt: 2,
        fid: 'f3',
        fs: 'm:113 t:5',
        fields:
          'f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14,f15,f16,f17,f18,f20,f21,f23,f24,f25,f22,f28,f11,f62,f128,f136,f115,f152,f133,f124',
        _: Date.now(),
      },
      responseType: 'json',
    });

    const result = data.data?.diff?.map((item) => {
      return {
        name: item.f14,
        zxj: item.f2,
        zdf: item.f3,
      };
    });

    return result || [];
  } catch (error) {
    return [];
  }
}
export async function GetShanghaiGoldGoodsFromEastmoney() {
  try {
    const { body: data } = await request<{
      rc: 0;
      rt: 6;
      svr: 182996800;
      lt: 1;
      full: 1;
      data: {
        total: 8;
        diff: {
          f1: 4;
          f2: 26.0625;
          f3: 1.41;
          f4: 0.3625;
          f5: 102;
          f6: '-';
          f7: 1.75;
          f8: '-';
          f9: '-';
          f10: '-';
          f11: -0.05;
          f12: 'QI00Y';
          f13: 101;
          f14: '迷你白银';
          f15: 26.2125;
          f16: 25.7625;
          f17: 25.7625;
          f18: 25.7;
          f20: '-';
          f21: '-';
          f22: -0.05;
          f23: '-';
          f24: 1.16;
          f25: 1.16;
          f28: 25.7;
          f62: '-';
          f115: '-';
          f124: 1650266643;
          f128: '-';
          f140: '-';
          f141: '-';
          f133: '-';
          f136: '-';
          f152: 2;
        }[];
      };
    }>('http://62.push2.eastmoney.com/api/qt/clist/get', {
      searchParams: {
        pn: 1,
        pz: 20,
        po: 1,
        np: 1,
        fltt: 2,
        invt: 2,
        fid: 'f3',
        fs: 'm:118',
        fields:
          'f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14,f15,f16,f17,f18,f20,f21,f23,f24,f25,f22,f28,f11,f62,f128,f136,f115,f152,f133,f124',
        _: Date.now(),
      },
      responseType: 'json',
    });

    const result = data.data?.diff?.map((item) => {
      return {
        name: item.f14,
        zxj: item.f2,
        zdf: item.f3,
      };
    });

    return result || [];
  } catch (error) {
    return [];
  }
}
export async function GetMainFundFromEastmoney(code: string) {
  try {
    const { rawBody } = await request(`https://webquotepic.eastmoney.com/GetPic.aspx?nid=${code}&imageType=FFRS1&type=FFR`);
    const b64encoded = base64.fromUint8Array(new Uint8Array(rawBody));
    return `data:image/png;base64,${b64encoded}`;
  } catch (error) {
    return;
  }
}
export async function GetDistributionFromEastmoney() {
  try {
    const { body: data } = await request<{
      rc: 0;
      rt: 115;
      svr: 181734952;
      lt: 2;
      full: 0;
      data: {
        fenbu: [
          {
            '-1': 900;
          },
          {
            '-10': 21;
          },
          {
            '-11': 22;
          },
          {
            '-2': 868;
          },
          {
            '-3': 614;
          },
          {
            '-4': 376;
          },
          {
            '-5': 256;
          },
          {
            '-6': 147;
          },
          {
            '-7': 78;
          },
          {
            '-8': 45;
          },
          {
            '-9': 19;
          },
          {
            '0': 174;
          },
          {
            '1': 643;
          },
          {
            '10': 3;
          },
          {
            '11': 36;
          },
          {
            '2': 265;
          },
          {
            '3': 115;
          },
          {
            '4': 43;
          },
          {
            '5': 29;
          },
          {
            '6': 19;
          },
          {
            '7': 9;
          },
          {
            '8': 3;
          },
          {
            '9': 1;
          }
        ];
      };
    }>('http://push2ex.eastmoney.com/getTopicZDFenBu', {
      searchParams: {
        ut: '7eea3edcaed734bea9cbfc24409ed989', // 意义暂时不明
        dpt: 'wz.ztzt',
        _: Date.now(),
      },
      responseType: 'json',
    });

    return data.data.fenbu || [];
  } catch (error) {
    return [];
  }
}
