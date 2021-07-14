import * as Utils from '@/utils';
import NP from 'number-precision';

const { got } = window.contextModules;

// 天天基金获取股票
export async function FromEastmoney(secid: string) {
  try {
    const { trends } = await GetTrendFromEastmoney(secid);
    const { zx, code, name, market, zs, zdd, zdf, zg, zd, jk } =
      await GetDetailFromEastmoney(secid);

    return {
      secid,
      code,
      name,
      market,
      zx,
      zdd,
      zdf,
      zs,
      zg,
      zd,
      jk,
      trends,
    };
  } catch (error) {
    return null;
  }
}

export async function SearchFromEastmoney(keyword: string) {
  try {
    const {
      body: { Data },
    } = await got<{
      Data: {
        Type: number; // 7,
        Name: string; // "三板",
        Count: number; // 3;
        Datas: {
          Code: string; // '839489';
          Name: string; // '同步天成';
          ID: string; // '839489_TB';
          MktNum: string; // '0';
          SecurityType: string; // '10';
          MarketType: string; // '_TB';
          JYS: string; // '81';
          GubaCode: string; // '839489';
          UnifiedCode: string; // '839489';
        }[];
      }[];
    }>('https://searchapi.eastmoney.com/bussiness/web/QuotationLabelSearch', {
      searchParams: {
        keyword,
        type: 0,
        ps: 1000,
        pi: 1,
        token: Utils.MakeHash(),
        _: new Date().getTime(),
      },
      responseType: 'json',
    });
    return Data || [];
  } catch (error) {
    return [];
  }
}

export async function GetTrendFromEastmoney(secid: string) {
  // secid: market + code
  try {
    const {
      body: { data },
    } = await got<{
      rc: 0;
      rt: 10;
      svr: 182482649;
      lt: 1;
      full: 1;
      data: {
        code: '600519';
        market: 1;
        type: 2;
        status: 0;
        name: '贵州茅台';
        decimal: 2;
        preSettlement: 0.0;
        preClose: 2012.9;
        beticks: '33300|34200|54000|34200|41400|46800|54000';
        trendsTotal: 241;
        time: 1625620887;
        kind: 1;
        prePrice: 2012.9;
        trends: [
          '2021-07-07 09:30,2012.90,2012.90,2013.00,2012.00,0,0.00,2012.900'
        ];
      };
    }>('http://push2.eastmoney.com/api/qt/stock/trends2/get', {
      searchParams: {
        secid,
        fields1: 'f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13',
        fields2: 'f51,f52,f53,f54,f55,f56,f57,f58',
        ndays: 1,
        iscr: 0,
        iscca: 0,
        _: new Date().getTime(),
      },
      responseType: 'json',
    });
    return {
      ...data,
      trends: data.trends.map((item) => {
        const [datetime, last, current, zg, zd, _, average] = item.split(',');
        return {
          datetime,
          last: Number(last),
          current: Number(current),
          average: Number(average),
        };
      }),
    };
  } catch (error) {
    return {
      trends: [],
    };
  }
}

export async function GetPicTrendFromEastmoney(secid: string) {
  try {
    const { rawBody }: any = await got(
      'http://webquotepic.eastmoney.com/GetPic.aspx',
      {
        searchParams: {
          nid: secid,
          imageType: 'GNR',
          token: Utils.MakeHash(),
        },
      }
    );
    // const base64Str = rawBody.toString('base64');
    const b64encoded = btoa(String.fromCharCode.apply(null, rawBody));
    return `data:image/png;base64,${b64encoded}`;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function GetDetailFromEastmoney(secid: string) {
  // secid: market + code
  try {
    const {
      body: { data },
    } = await got<{
      rc: 0;
      rt: 4;
      svr: 182481210;
      lt: 1;
      full: 1;
      data: {
        f43: 14.34;
        f44: 14.66;
        f45: 14.25;
        f46: 14.45;
        f47: 82787;
        f48: 119677563.0;
        f49: 44706;
        f50: 1.1;
        f51: 15.58;
        f52: 12.74;
        f55: 0.037979672;
        f57: '601808';
        f58: '中海油服';
        f60: 14.16;
        f62: 1;
        f71: 14.46;
        f78: 0;
        f80: '[{"b":202107020930,"e":202107021130},{"b":202107021300,"e":202107021500}]';
        f84: 4771592000.0;
        f85: 2960468000.0;
        f86: 1625212803;
        f92: 8.1105323;
        f104: 26693335931.0;
        f105: 181223498.0;
        f107: 1;
        f110: 1;
        f111: 2;
        f116: 68424629280.0;
        f117: 42453111120.0;
        f127: '石油行业';
        f128: '天津板块';
        f135: 26795631.0;
        f136: 18589140.0;
        f137: 8206491.0;
        f138: 2051832.0;
        f139: 1684343.0;
        f140: 367489.0;
        f141: 24743799.0;
        f142: 16904797.0;
        f143: 7839002.0;
        f144: 42304379.0;
        f145: 52331656.0;
        f146: -10027277.0;
        f147: 47659827.0;
        f148: 45839042.0;
        f149: 1820785.0;
        f161: 38081;
        f162: 94.39;
        f163: 25.31;
        f164: 39.21;
        f167: 1.77;
        f168: 0.28;
        f169: 0.18;
        f170: 1.27;
        f173: 0.5;
        f177: 577;
        f183: 5902547125.0;
        f184: -27.7393;
        f185: -84.0958;
        f186: 10.1517;
        f187: 3.1199999999999998;
        f188: 48.03751339173166;
        f189: 20070928;
        f190: 3.87500256748691;
        f191: 68.95;
        f192: 875;
        f193: 6.86;
        f194: 0.31;
        f195: 6.55;
        f196: -8.38;
        f197: 1.52;
        f199: 90;
        f250: 6.96;
        f251: 6.92;
        f252: -0.57;
        f253: 148.35;
        f254: 2.48;
        f255: 3;
        f256: '02883';
        f257: 116;
        f258: '中海油田服务';
        f262: '-';
        f263: 0;
        f264: '-';
        f266: '-';
        f267: '-';
        f268: '-';
        f269: '-';
        f270: 0;
        f271: '-';
        f273: '-';
        f274: '-';
        f275: '-';
        f280: '-';
        f281: '-';
        f282: '-';
        f284: 0;
        f285: '-';
        f286: 0;
        f287: '-';
        f292: 5;
        f31: 14.38;
        f32: 97;
        f33: 14.37;
        f34: 43;
        f35: 14.36;
        f36: 22;
        f37: 14.35;
        f38: 3;
        f39: 14.34;
        f40: 32;
        f19: 14.33;
        f20: 162;
        f17: 14.32;
        f18: 195;
        f15: 14.31;
        f16: 148;
        f13: 14.3;
        f14: 496;
        f11: 14.29;
        f12: 71;
      };
    }>('http://push2.eastmoney.com/api/qt/stock/get', {
      searchParams: {
        secid,
        invt: 2,
        fltt: 2,
        fields:
          'f43,f57,f58,f169,f170,f46,f44,f51,f168,f47,f164,f163,f116,f60,f45,f52,f50,f48,f167,f117,f71,f161,f49,f530,f135,f136,f137,f138,f139,f141,f142,f144,f145,f147,f148,f140,f143,f146,f149,f55,f62,f162,f92,f173,f104,f105,f84,f85,f183,f184,f185,f186,f187,f188,f189,f190,f191,f192,f107,f111,f86,f177,f78,f110,f262,f263,f264,f267,f268,f250,f251,f252,f253,f254,f255,f256,f257,f258,f266,f269,f270,f271,f273,f274,f275,f127,f199,f128,f193,f196,f194,f195,f197,f80,f280,f281,f282,f284,f285,f286,f287,f292',
        _: new Date().getTime(),
      },
      responseType: 'json',
    });
    const w = 10 ** 4;

    return {
      zg: data.f44, // 最高
      zd: data.f45, // 最低
      jk: data.f46, // 今开
      zss: Number(NP.divide(data.f47, w).toFixed(2)), // 总手数
      zt: data.f51, // 涨停
      dt: data.f52, // 跌停
      zx: data.f43, // 最新
      cjl: data.f47, // 成交量
      lb: data.f50, // 量比
      cje: data.f48, // 成交额
      wp: Number(NP.divide(data.f49, w).toFixed(2)), // 外盘
      code: data.f57,
      name: data.f58,
      market: data.f62,
      zs: data.f60, // 昨收
      jj: data.f71, // 均价
      np: Number(NP.divide(data.f161, w).toFixed(2)), // 内盘
      hs: data.f168, // 换手
      zdd: data.f169, // 涨跌点
      zdf: data.f170, /// 涨跌幅
    };
  } catch (error) {
    return {};
  }
}

export async function GetKFromEastmoney(secid: string, code: number) {
  try {
    const { body } = await got<{
      rc: 0;
      rt: 17;
      svr: 182481222;
      lt: 1;
      full: 0;
      data: {
        code: '600519';
        market: 1;
        name: '贵州茅台';
        decimal: 2;
        dktotal: 4747;
        preKPrice: 206.69;
        klines: [
          '2021-07-09,2059.97,1972.11,2110.00,1945.00,244227,49006317568.00,8.02,-4.11,-84.59,1.94'
        ];
      };
    }>('http://68.push2his.eastmoney.com/api/qt/stock/kline/get', {
      searchParams: {
        secid,
        fields1: 'f1,f2,f3,f4,f5,f6',
        fields2: 'f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61',
        klt: code,
        fqt: 0,
        end: 20500101,
        lmt: 120,
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

export async function GetSelfRankFromEastmoney(code: string) {
  try {
    const { body } = await got<{
      rc: 0;
      rt: 6;
      svr: 182482210;
      lt: 1;
      full: 1;
      data: {
        total: 4512;
        diff: {
          f1: 2;
          f2: 29.7;
          f12: '600111';
          f13: 1;
          f14: '北方稀土';
          f109: 44.03;
          f124: 1625817579;
          f164: 3063965600.0;
          f165: 7.33;
          f166: 3728985920.0;
          f167: 8.92;
          f168: -665020320.0;
          f169: -1.59;
          f170: -1794846528.0;
          f171: -4.29;
          f172: -1269119136.0;
          f173: -3.04;
          f257: '-';
          f258: '-';
          f259: '-';
          [index: string]: any;
        }[];
      };
    }>('http://push2.eastmoney.com/api/qt/clist/get', {
      searchParams: {
        fields:
          'f2,f3,f12,f13,f14,f62,f184,f225,f165,f263,f109,f175,f264,f160,f100,f124,f265,f1,f267,f164,f174',
        fid: code,
        po: 1,
        pz: 200,
        pn: 1,
        np: 1,
        fltt: 2,
        invt: 2,
        fs: 'm:0+t:6+f:!2,m:0+t:13+f:!2,m:0+t:80+f:!2,m:1+t:2+f:!2,m:1+t:23+f:!2,m:0+t:7+f:!2,m:1+t:3+f:!2',
        _: new Date().getTime(),
      },
      responseType: 'json',
    });
    const billion = 10 ** 8;
    return (body?.data?.diff || []).map((_) => ({
      market: _.f13,
      code: _.f12,
      name: _.f14,
      secid: `${_.f13}.${_.f12}`,
      zllr: NP.divide(_[code], billion).toFixed(2),
      zdf: _.f3,
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function GetMainRankFromEastmoney(code: string) {
  try {
    const { body } = await got<{
      rc: 0;
      rt: 6;
      svr: 182482210;
      lt: 1;
      full: 1;
      data: {
        total: 4512;
        diff: {
          f1: 2;
          f2: 29.7;
          f12: '600111';
          f13: 1;
          f14: '北方稀土';
          f109: 44.03;
          f124: 1625817579;
          f164: 3063965600.0;
          f165: 7.33;
          f166: 3728985920.0;
          f167: 8.92;
          f168: -665020320.0;
          f169: -1.59;
          f170: -1794846528.0;
          f171: -4.29;
          f172: -1269119136.0;
          f173: -3.04;
          f257: '-';
          f258: '-';
          f259: '-';
          [index: string]: any;
        }[];
      };
    }>('http://push2.eastmoney.com/api/qt/clist/get', {
      searchParams: {
        fields:
          'f2,f3,f12,f13,f14,f62,f184,f225,f165,f263,f109,f175,f176,f264,f160,f100,f124,f265,f1',
        fid: code,
        po: 1,
        pz: 200,
        pn: 1,
        np: 1,
        fltt: 2,
        invt: 2,
        fs: 'm:0+t:6+f:!2,m:0+t:13+f:!2,m:0+t:80+f:!2,m:1+t:2+f:!2,m:1+t:23+f:!2,m:0+t:7+f:!2,m:1+t:3+f:!2',
        _: new Date().getTime(),
      },
      responseType: 'json',
    });
    return (body?.data?.diff || []).map((_) => ({
      market: _.f13,
      code: _.f12,
      name: _.f14,
      secid: `${_.f13}.${_.f12}`,
      zljzb: _[code],
      zdf: _.f3,
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}
