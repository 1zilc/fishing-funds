import dayjs from 'dayjs';
import NP from 'number-precision';
import request from '@/utils/request';

/**
 *
 * @param secid 指数代码: 000001
 * 从天天基金获取指数行情
 */
export async function FromEastmoney(secid: string) {
  try {
    const { body: data } = await request<{
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
        f86: number; // 时间戳（秒）
        f107: number; // market
        f168: number; // 换手
        f169: number; // 涨跌点
        f170: number; // 涨跌幅
        f171: number; // 振幅
      };
    }>('https://push2.eastmoney.com/api/qt/stock/get?=', {
      searchParams: {
        fields: 'f43,f44,f45,f46,f57,f58,f60,f86,f107,f168,f169,f170,f171',
        secid, // 1.000001
        _: Date.now(),
      },
      responseType: 'json',
    });

    const trends = await GetTrendFromEastmoney(secid, 1);

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
      code: `${data.data.f107}.${data.data.f57}`,
      time: dayjs.unix(data.data.f86).format('MM-DD HH:mm'),
      trends,
    };
  } catch (error) {
    return;
  }
}

export async function GetTrendFromEastmoney(code: string, ndays: number) {
  try {
    const { body } = await request<{
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
    }>('https://push2his.eastmoney.com/api/qt/stock/trends2/get', {
      searchParams: {
        secid: code,
        ndays,
        iscr: 0,
        fields1: 'f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11',
        fields2: 'f51,f53,f56,f58',
        _: Date.now(),
      },
      responseType: 'json',
    });
    return (body?.data?.trends || []).map((_) => {
      const [time, price, cjl] = _.split(',');
      return {
        time,
        price: Number(price),
        cjl: Number(cjl),
      };
    });
  } catch (error) {
    return [];
  }
}

export async function GetKFromEastmoney(code: string, year: number, klt: number) {
  try {
    const { body } = await request<{
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
        klines: ['2019-04-18,3105.00,3078.87,3113.69,3077.85,13321590,21989221888.00,0.00'];
      };
    }>('https://push2his.eastmoney.com/api/qt/stock/kline/get', {
      searchParams: {
        secid: code,
        fields1: 'f1,f2,f3,f4,f5',
        fields2: 'f51,f52,f53,f54,f55,f56,f57,f58',
        klt,
        fqt: 0,
        beg: `${dayjs().get('year') - year}0101`,
        end: `${dayjs().get('year') + 1}0101`,
        _: Date.now(),
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
    return [];
  }
}

// 中国 居民消费价格指数(CPI)等指数
export async function GetEconomyIndexFromEastmoney(reportName: string, columns: string) {
  try {
    const { body: data } = await request<{
      version: 'ab87442f6bc9b2b1d3c5e6947e2fcd6e';
      result: {
        pages: 1;
        data: any[];
        count: 182;
      };
      success: true;
      message: 'ok';
      code: 0;
    }>('https://datacenter-web.eastmoney.com/api/data/v1/get', {
      responseType: 'json',
      searchParams: {
        columns,
        sortColumns: 'REPORT_DATE',
        sortTypes: -1,
        source: 'WEB',
        client: 'WEB',
        reportName,
        _: Date.now(),
      },
    });
    return data.result.data;
  } catch (error) {
    return [];
  }
}

// 油价
export async function GetOilPriceFromEastmoney() {
  try {
    const { body } = await request<{
      version: '63fa26740fe0adbc234c8c41e0d5894d';
      result: {
        pages: 18;
        data: {
          CLOSE: 108.61;
          DATE: '2022-05-05 00:00:00';
          QY: 9775;
          CY: 8710;
        }[];
        count: 8940;
      };
      success: true;
      message: 'ok';
      code: 0;
    }>('https://datacenter-web.eastmoney.com/api/data/v1/get', {
      searchParams: {
        reportName: 'RPTA_WEB_JY_HQ',
        columns: 'ALL',
        sortColumns: 'date',
        sortTypes: -1,
        pageNumber: 1,
        pageSize: 5000,
        source: 'WEB',
        _: Date.now(),
      },
      responseType: 'json',
    });
    return body.result.data;
  } catch (error) {
    return [];
  }
}

// 中美国债收益率
export async function GetTreasuryYieldData() {
  try {
    const { body } = await request<{
      version: '63fa26740fe0adbc234c8c41e0d5894d';
      result: {
        pages: 18;
        data: {
          SOLAR_DATE: '2022/1/21';
          EMM00588704: 2.1542;
          EMM00166462: 2.4295;
          EMM00166466: 2.71;
          EMM00166469: 3.282;
          EMM01276014: 0.5558;
          EMG00001306: 1.01;
          EMG00001308: 1.54;
          EMG00001310: 1.75;
          EMG00001312: 2.07;
          EMG01339436: 0.74;
        }[];
        count: 8940;
      };
      success: true;
      message: 'ok';
      code: 0;
    }>('https://datacenter-web.eastmoney.com/api/data/get', {
      searchParams: {
        type: 'RPTA_WEB_TREASURYYIELD',
        sty: 'ALL',
        st: 'SOLAR_DATE',
        sr: -1,
        p: 1,
        ps: 99999,
        _: Date.now(),
      },
      responseType: 'json',
    });
    return body.result.data.reverse();
  } catch (error) {
    return [];
  }
}

// 国家队持股分布
export async function GetNationalTeamDistributed() {
  try {
    const { body } = await request<{
      version: '63fa26740fe0adbc234c8c41e0d5894d';
      result: {
        pages: 18;
        data: {
          MARKETCAPRATIO_SUM_0: 0.1704594452;
          MARKETCAPRATIO_SUM_1: 0.785751110634;
          MARKETCAPRATIO_SUM_2: 0.043789444166;
          REPORT_DATE: '2021-09-30 00:00:00';
        }[];
        count: 8940;
      };
      success: true;
      message: 'ok';
      code: 0;
    }>('https://datacenter-web.eastmoney.com/api/data/v1/get', {
      searchParams: {
        reportName: 'RPT_NATIONAL_LATESTSTATS',
        columns: 'ALL',
        source: 'WEB',
        client: 'WEB',
        quoteColumns: '',
        _: Date.now(),
      },
      responseType: 'json',
    });
    return body.result.data[0];
  } catch (error) {
    return {
      MARKETCAPRATIO_SUM_0: 0,
      MARKETCAPRATIO_SUM_1: 0,
      MARKETCAPRATIO_SUM_2: 0,
      REPORT_DATE: '',
    };
  }
}

// 国家队持股分布
export async function GetNationalTeamTrend() {
  try {
    const { body } = await request<{
      version: '63fa26740fe0adbc234c8c41e0d5894d';
      result: {
        pages: 18;
        data: {
          CHANGE_RATE: -6.8464;
          HOLD_MARKET_CAP: 3500907309564.22;
          INDEX_NAME: 4866.3826;
          REPORT_DATE: '2021-09-30 00:00:00';
          SHARES_RATIO: 0.0403829976;
          STOCK_NUM: 360;
          TOTAL_SHARES: 691604221230;
          TRADE_MARKET: 'all';
        }[];
        count: 8940;
      };
      success: true;
      message: 'ok';
      code: 0;
    }>('https://datacenter-web.eastmoney.com/api/data/v1/get', {
      searchParams: {
        reportName: 'RPT_NATIONAL_MARKET_STATISTICS',
        columns: 'ALL',
        quoteColumns: '',
        source: 'WEB',
        client: 'WEB',
        sortColumns: 'REPORT_DATE',
        sortTypes: -1,
        filter: `(TRADE_MARKET="all")(REPORT_DATE>'${dayjs().subtract(10, 'year').format('YYYY-MM-DD')}')`,
        _: Date.now(),
      },
      responseType: 'json',
    });
    return body.result.data.reverse();
  } catch (error) {
    return [];
  }
}

// 国家队持股明细
export async function GetNationalTeamDetail(columns: string) {
  try {
    const { REPORT_DATE: time } = await GetNationalTeamDistributed();
    const { body } = await request<{
      version: '63fa26740fe0adbc234c8c41e0d5894d';
      result: {
        pages: 18;
        data: {
          MARKETCAP_SUM_0: 13069880241.84;
          MARKETCAP_SUM_1: 855399966269.19;
          MARKETCAP_SUM_2: null;
          MARKETCAP_SUM_3: null;
          MARKETCAP_SUM_4: null;
          MARKET_CAP_CHANGE: -98921188547.32;
          MARKET_CAP_SUM: 868469846511.03;
          NATIONAL_HOLD_TYPE: '1';
          ORG_NUM: 3;
          REPORT_DATE: '2021-09-30 00:00:00';
          SECUCODE: '601939.SH';
          SECURITY_CODE: '601939';
          SECURITY_INNER_CODE: '1000001073';
          SECURITY_NAME_ABBR: '建设银行';
          SHARESRATIO_SUM_0: 0.87566542;
          SHARESRATIO_SUM_1: 0.27702055;
          SHARESRATIO_SUM_2: null;
          SHARESRATIO_SUM_3: null;
          SHARESRATIO_SUM_4: null;
          SHARES_RATIO_CHANGE: 0;
          SHARES_RATIO_SUM: 1.15268597;
          TOTALSHARES_SUM_0: 2189259672;
          TOTALSHARES_SUM_1: 143283076427;
          TOTALSHARES_SUM_2: null;
          TOTALSHARES_SUM_3: null;
          TOTALSHARES_SUM_4: null;
          TOTAL_SHARES_CHANGE: 0;
          TOTAL_SHARES_SUM: 145472336099;
          TRADE_MARKET_CODE: '069001001001';
        }[];
        count: 8940;
      };
      success: true;
      message: 'ok';
      code: 0;
    }>('https://datacenter-web.eastmoney.com/api/data/v1/get', {
      searchParams: {
        reportName: 'RPT_NATIONAL_STATISTICS',
        columns: 'ALL',
        quoteColumns: '',
        source: 'WEB',
        client: 'WEB',
        pageSize: 10,
        sortColumns: columns,
        sortTypes: -1,
        filter: `(REPORT_DATE='${time.slice(0, 10)}')`,
        _: Date.now(),
      },
      responseType: 'json',
    });
    return body.result.data.reverse();
  } catch (error) {
    return [];
  }
}

export async function GetRemoteZindexConfig() {
  const cb = 'parsezindex';
  const now = Date.now();
  const fields = '12,13,14';
  const { body: b1 } = await request(
    `https://32.push2.eastmoney.com/api/qt/clist/get?pn=1&pz=50&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=&fs=b:MK0010`,
    {
      responseType: 'text',
      searchParams: {
        cb,
        fields,
        _: now,
      },
    }
  );
  const a1 = eval(b1);
  const { body: b2 } = await request(
    `https://32.push2.eastmoney.com/api/qt/clist/get?pn=1&pz=5&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f3&fs=m:1+t:1`,
    {
      responseType: 'text',
      searchParams: {
        cb,
        fields,
        _: now,
      },
    }
  );
  const a2 = eval(b2);
  const { body: b3 } = await request(
    `https://32.push2.eastmoney.com/api/qt/clist/get?&pn=1&pz=5&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f3&fs=m:0+t:5`,
    {
      responseType: 'text',
      searchParams: {
        cb,
        fields,
        _: now,
      },
    }
  );
  const a3 = eval(b3);
  const result = [...a1, ...a2, ...a3];
  return result;
}
