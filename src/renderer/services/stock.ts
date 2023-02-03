import dayjs from 'dayjs';
import cheerio from 'cheerio';
import NP from 'number-precision';
import request from '@/utils/request';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';
import { defaultCompany } from '@/components/Home/StockView/DetailStockContent/Company';

const { base64 } = window.contextModules;

// 天天基金获取股票
export async function FromEastmoney(secid: string) {
  try {
    const responseTrends = await GetTrendFromEastmoney(secid);
    const responseDetail = await GetDetailFromEastmoney(secid);

    if (!responseTrends || !Object.keys(responseDetail || {}).length) {
      return;
    }

    const { trends } = responseTrends;
    const { zx, code, name, market, zs, zdd, zdf, zg, zd, jk, time } = responseDetail!;

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
      time,
      trends,
    };
  } catch (error) {
    return;
  }
}

export async function SearchFromEastmoney(keyword: string) {
  try {
    const { body: script } = await request('https://search-api-web.eastmoney.com/search/jsonp', {
      responseType: 'text',
      headers: {
        Host: 'search-api-web.eastmoney.com',
        Referer: 'https://so.eastmoney.com/',
      },
      searchParams: {
        _: Date.now(),
        param: JSON.stringify({
          uid: '',
          keyword,
          type: ['codetableLabelWeb'],
          client: 'web',
          clientType: 'wap',
          clientVersion: 'curr',
          param: { codetableLabelWeb: { pageIndex: 1, pageSize: 100, preTag: '', postTag: '', isHighlight: false, label: 'ALL' } },
        }),
        cb: 'cb',
      },
    });
    const data = (0, eval)(script);

    return (
      data.result.codetableLabelWeb.labelList.map((item: any) => {
        return {
          Type: Enums.NewStockMarketType[item.type], // 7,
          Name: item.name, // "三板",
          Count: item.count, // 3;
          Datas: item.quoteList.map((item: any) => {
            return {
              Code: item.code, // '839489';
              Name: item.shortName, // '同步天成';
              ID: item.id, // '839489_TB';
              MktNum: item.market, // '0';
              SecurityType: item.securityType, // '10';
              MarketType: item.marketType, // '_TB';
              UnifiedId: item.unifiedId, // "0.839489",
              JYS: item.jys, // '81';
              UnifiedCode: item.unifiedCode, // '839489';
            };
          }),
        };
      }) as Stock.SearchResult[]
    ).filter((item) => !!item.Count);
  } catch (error) {
    return [];
  }
}

export async function GetTrendFromEastmoney(secid: string) {
  // secid: market + code
  try {
    const {
      body: { data },
    } = await request<{
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
        trends: ['2021-07-07 09:30,2012.90,2012.90,2013.00,2012.00,0,0.00,2012.900'];
      };
    }>('http://push2.eastmoney.com/api/qt/stock/trends2/get', {
      searchParams: {
        secid,
        fields1: 'f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13',
        fields2: 'f51,f52,f53,f54,f55,f56,f57,f58',
        ndays: 1,
        iscr: 0,
        iscca: 0,
        _: Date.now(),
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
    const { rawBody } = await request('http://webquotepic.eastmoney.com/GetPic.aspx', {
      searchParams: {
        nid: secid,
        imageType: 'GNR',
        token: Utils.MakeHash(),
      },
    });
    const b64encoded = base64.fromUint8Array(new Uint8Array(rawBody));
    return `data:image/png;base64,${b64encoded}`;
  } catch (error) {
    return;
  }
}

export async function GetDetailFromEastmoney(secid: string) {
  // secid: market + code
  try {
    const {
      body: { data },
    } = await request<{
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
        f187: 3.1;
        f188: 48.03;
        f189: 20070928;
        f190: 3.8;
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
        _: Date.now(),
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
      time: dayjs.unix(data.f86).format('MM-DD HH:mm'),
    };
  } catch (error) {
    return;
  }
}

export async function GetKFromEastmoney(secid: string, code: number, lmt = 10000) {
  try {
    const { body } = await request<{
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
        klines: ['2021-07-09,2059.97,1972.11,2110.00,1945.00,244227,49006317568.00,8.02,-4.11,-84.59,1.94'];
      };
    }>('http://68.push2his.eastmoney.com/api/qt/stock/kline/get', {
      searchParams: {
        secid,
        fields1: 'f1,f2,f3,f4,f5,f6',
        fields2: 'f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61',
        klt: code,
        fqt: 0,
        end: 20500101,
        lmt: lmt,
        _: Date.now(),
      },
      responseType: 'json',
    });
    return (body?.data?.klines || []).map((_) => {
      const [date, kp, sp, zg, zd, cjl, cje, zf, zdf, zde, hsl] = _.split(',');
      return {
        date,
        kp: Number(kp), // 开盘
        sp: Number(sp), // 收盘
        zg: Number(zg), // 最高
        zd: Number(zd), // 最低
        cjl, // 成交量
        cje, // 成交额
        zf, // 振幅
        zdf, // 涨跌幅
        zde, // 涨跌额
        hsl, // 换手率
      };
    });
  } catch (error) {
    return [];
  }
}

export async function GetSelfRankFromEastmoney(code: string) {
  try {
    const { body } = await request<{
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
        fields: 'f2,f3,f12,f13,f14,f62,f184,f225,f165,f263,f109,f175,f264,f160,f100,f124,f265,f1,f267,f164,f174',
        fid: code,
        po: 1,
        pz: 200,
        pn: 1,
        np: 1,
        fltt: 2,
        invt: 2,
        fs: 'm:0+t:6+f:!2,m:0+t:13+f:!2,m:0+t:80+f:!2,m:1+t:2+f:!2,m:1+t:23+f:!2,m:0+t:7+f:!2,m:1+t:3+f:!2',
        _: Date.now(),
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
    return [];
  }
}

export async function GetMainRankFromEastmoney(code: string) {
  try {
    const { body } = await request<{
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
        fields: 'f2,f3,f12,f13,f14,f62,f184,f225,f165,f263,f109,f175,f176,f264,f160,f100,f124,f265,f1',
        fid: code,
        po: 1,
        pz: 200,
        pn: 1,
        np: 1,
        fltt: 2,
        invt: 2,
        fs: 'm:0+t:6+f:!2,m:0+t:13+f:!2,m:0+t:80+f:!2,m:1+t:2+f:!2,m:1+t:23+f:!2,m:0+t:7+f:!2,m:1+t:3+f:!2',
        _: Date.now(),
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
    return [];
  }
}

export async function GetNorthRankFromEastmoney(code: string) {
  try {
    const { body: html } = await request<string>(`https://data.eastmoney.com/hsgtcg/list.html`);
    const $ = cheerio.load(html);
    const date = $('.title .t').text().slice(1, -1);

    const { body } = await request<{
      version: '8547510d8cabd51dd1536ff148ca0c13';
      result: {
        pages: 31;
        data: {
          SECUCODE: '600887.SH';
          MUTUAL_TYPE: '001';
          TRADE_DATE: '2022-06-17 00:00:00';
          INTERVAL_TYPE: '3';
          SECURITY_NAME: '伊利股份';
          SECURITY_INNER_CODE: '1000004059';
          ORG_CODE: '10004331';
          SECURITY_CODE: '600887';
          PARTICIPANT_NUM: null;
          EFFECTIVE_DATE: '2014-11-17 00:00:00';
          A_SHARES_RATIO: 17.53;
          HOLD_SHARES_RATIO: 17.87;
          HOLD_SHARES: 112209.83;
          HOLD_MARKET_CAP: 4296514.34;
          FREE_SHARES_RATIO: 17.87;
          TOTAL_SHARES_RATIO: 17.53;
          CLOSE_PRICE: 38.29;
          CHANGE_RATE: 0.6;
          INDUSTRY_CODE: '016012';
          INDUSTRY_NAME: '食品饮料';
          ORIG_INDUSTRY_CODE: '438';
          CONCEPT_CODE: '007009,007035,007089,007090,007091,007133,007187,007221,007230,007271,007282,007292,007389';
          CONCEPT_NAME: 'HS300_,MSCI中国,上证180_,上证50_,乳业,基金重仓,央视50_,婴童概念,富时罗素,标准普尔,茅指数,证金持股,超级品牌';
          AREA_CODE: '020018';
          AREA_NAME: '内蒙古';
          ORIG_AREA_CODE: '175';
          FREECAP: 24039379.32;
          TOTAL_MARKET_CAP: 24506101.29;
          FREECAP_HOLD_RATIO: 17.98;
          TOTAL_MARKETCAP_HOLD_RATIO: 17.64;
          ADD_MARKET_CAP: 145576.1;
          ADD_SHARES_REPAIR: 3809.87;
          ADD_SHARES_AMP: 3.56;
          FREECAP_RATIO_CHG: 6.14;
          TOTAL_RATIO_CHG: 6.02;
          HOLD_MARKETCAP_BEFORECHG: 4093182.26;
          HOLD_SHARES_BEFORECHG: 108399.95;
          HOLD_MARKETCAP_CHG1: 493909597.18;
          HOLD_MARKETCAP_CHG5: 3548366320.29;
          HOLD_MARKETCAP_CHG10: 7392968539.26;
          INDUSTRY_CODE_NEW: 'BK0438';
          AREA_CODE_NEW: 'BK0175';
        }[];
        count: 1524;
      };
      success: true;
      message: 'ok';
      code: 0;
    }>('https://datacenter-web.eastmoney.com/api/data/v1/get', {
      searchParams: {
        sortColumns: 'ADD_MARKET_CAP',
        sortTypes: -1,
        pageSize: 50,
        pageNumber: 1,
        reportName: 'RPT_MUTUAL_STOCK_NORTHSTA',
        columns: 'ALL',
        source: 'WEB',
        client: 'WEB',
        filter: `(TRADE_DATE='${date}')(INTERVAL_TYPE="${code}")`,
      },
      responseType: 'json',
    });
    return (body?.result?.data || []).map((_) => ({
      ..._,
      ADD_MARKET_CAP: NP.divide(Number(_.ADD_MARKET_CAP), 10 ** 4).toFixed(2),
    }));
  } catch (error) {
    return [];
  }
}

export async function GetABCompany(secid: string) {
  try {
    const [mk, code] = secid.split('.');
    const { body } = await request<{
      jbzl: {
        gsmc: '贵州茅台酒股份有限公司';
        ywmc: 'Kweichow Moutai Co.,Ltd.';
        cym: '贵州茅台->G茅台';
        agdm: '600519';
        agjc: '贵州茅台';
        bgdm: '--';
        bgjc: '--';
        hgdm: '--';
        hgjc: '--';
        zqlb: '上交所主板A股';
        sshy: '酿酒行业';
        ssjys: '上海证券交易所';
        sszjhhy: '制造业-酒、饮料和精制茶制造业';
        zjl: '李静仁(代)';
        frdb: '高卫东';
        dm: '刘刚';
        dsz: '高卫东';
        zqswdb: '蔡聪应';
        dlds: '章靖忠,许定波,陆金海';
        lxdh: '0851-22386002';
        dzxx: 'mtdm@moutaichina.com';
        cz: '0851-22386193';
        gswz: 'www.moutaichina.com';
        bgdz: '贵州省仁怀市茅台镇';
        zcdz: '贵州省仁怀市茅台镇';
        qy: '贵州';
        yzbm: '564501';
        zczb: '12.56亿';
        gsdj: '9152000071430580XT';
        gyrs: '29031';
        glryrs: '14';
        lssws: '北京市金杜律师事务所';
        kjssws: '天职国际会计师事务所(特殊普通合伙)';
        gsjj: '    贵州茅台酒股份有限公司是由中国贵州茅台酒厂有限责任公司、贵州茅台酒厂技术开发公司、贵州省轻纺集体工业联社、深圳清华大学研究院、中国食品发酵工业研究所、北京糖业烟酒公司、江苏省糖烟酒总公司、上海捷强烟草糖酒(集团)有限公司等八家公司共同发起,并经过贵州省人民政府黔府函字(1999)291号文件批准设立的股份有限公司。目前,贵州茅台酒股份有限公司茅台酒年生产量四万吨;43°、38°、33°茅台酒拓展了茅台酒家族低度酒的发展空间;茅台王子酒、茅台迎宾酒满足了中低档消费者的需求;15年、30年、50年、80年陈年茅台酒填补了我国极品酒、年份酒、陈年老窖的空白;在国内独创年代梯级式的产品开发模式。形成了低度、高中低档、极品三大系列200多个规格品种,全方位跻身市场,从而占据了白酒市场制高点,称雄于中国极品酒市场。';
        jyfw: '茅台酒系列产品的生产与销售;饮料、食品、包装材料的生产、销售;防伪技术开发、信息产业相关产品的研制、开发;酒店经营管理、住宿、餐饮、娱乐、洗浴及停车场管理服务(具体内容以工商核定登记为准)';
      };
      fxxg: {
        clrq: '1999-11-20';
        ssrq: '2001-08-27';
        fxsyl: '23.93';
        wsfxrq: '2001-07-31';
        fxfs: '网下定价发行';
        mgmz: '1.00';
        fxl: '7150万';
        mgfxj: '31.39';
        fxfy: '4842万';
        fxzsz: '22.44亿';
        mjzjje: '22.02亿';
        srkpj: '34.51';
        srspj: '35.55';
        srhsl: '56.83%';
        srzgj: '37.78';
        wxpszql: '--';
        djzql: '1.13%';
      };
      Code: 'SH600519';
      CodeType: 'ABStock';
      SecuCode: '600519.SH';
      SecurityCode: '600519';
      SecurityShortName: '贵州茅台';
      MarketCode: '01';
      Market: 'SH';
      SecurityType: null;
      ExpireTime: '/Date(-62135596800000)/';
    }>(`http://f10.eastmoney.com/CompanySurvey/CompanySurveyAjax?code=${mk === '0' ? 'sz' : 'sh'}${code}`, {
      responseType: 'json',
    });
    return {
      gsjs: body.jbzl.gsjj, // 公司介绍
      sshy: body.jbzl.sshy, // 所属行业
      dsz: body.jbzl.dsz, // 董事长
      zcdz: body.jbzl.zcdz, // 注册地址
      clrq: body.fxxg.clrq, // 成立日期
      ssrq: body.fxxg.ssrq, // 上市日期
    };
  } catch (error) {
    return defaultCompany;
  }
}

export async function GetHKCompany(secid: string) {
  try {
    const [mk, code] = secid.split('.');
    const { body } = await request<{
      zqzl: {
        zqdm: '01810.HK';
        zqjc: '小米集团-W';
        ssrq: '2018/7/9 0:00:00';
        zqlx: '非H股';
        jys: '香港交易所';
        bk: '主板';
        mgmz: '0.0000025 USD';
        zxjydw: '200';
        zxspj: '26.35';
        isin: 'KYG9830T1067';
        sfhgtbd: '是';
        sfsgtbd: '是';
      };
      gszl: {
        gsmc: '小米集团';
        ywmc: 'XIAOMI CORPORATION';
        zcd: 'Cayman Islands 开曼群岛（英属）';
        zcdz: 'PO Box 309, Ugland House, Grand Cayman, Cayman Islands';
        gsclrq: '2010-01-05';
        bgdz: '中国北京市海淀区清河中街68号华润五彩城写字楼,香港皇后大道东183号合和中心54楼';
        dsz: '雷军';
        gswz: 'www.mi.com';
        zczb: '675,000 USD';
        gsms: '苏嘉敏';
        njr: '12-31';
        email: 'xiaomi@hkstrategies.com';
        ygrs: '22,074';
        lxdh: '--';
        hss: '罗兵咸永道会计师事务所';
        cz: '+86 (10) 6060-6666';
        gsjs: '    小米集团是一家以手机、智能硬件和IoT平台为核心的互联网公司。公司的产品按照产品功能、形态及模式,大体上可以划分为智能手机、IoT和生活消费产品、互联网服务产品。作为一家由工程师和设计师创建的公司,小米集团崇尚大胆创新的互联网文化,并不断探索前沿科技。创新精神在小米蓬勃发展并渗透到每个角落,并引导小米集团所做的一切。同时,小米集团不懈追求效率的持续提升。小米集团致力於降低运营成本,并同时把效率提升产生的价值回馈给小米集团的用户。小米集团独特且强大的铁人三项商业模式由三个相互协作的支柱组成(1)创新、高质量、精心设计且专注於卓越用户体验的硬件,(2)使小米集团能以厚道的价格销售产品的高效新零售和(3)丰富的互联网服务。';
        sshy: '资讯科技器材';
      };
    }>(`http://emweb.securities.eastmoney.com/PC_HKF10/CompanyProfile/PageAjax?code=${code}`, {
      responseType: 'json',
    });
    return {
      gsjs: body.gszl.gsjs,
      sshy: body.gszl.sshy, // 所属行业
      dsz: body.gszl.dsz, // 董事长
      zcdz: body.gszl.zcdz, // 注册地址
      clrq: body.gszl.gsclrq, // 成立日期
      ssrq: body.zqzl.ssrq, // 上市日期
    };
  } catch (error) {
    return defaultCompany;
  }
}

export async function GetUSCompany(secid: string) {
  try {
    const [mk, code] = secid.split('.');
    const { body } = await request<{
      data: {
        zqzl: [
          {
            SECURITYCODE: 'TSLA.O';
            SECURITYSHORTNAME: '特斯拉';
            ISINCODE: 'US88160R1014';
            SECURITYTYPE: '美股';
            TRADEMARKET: 'NASDAQ';
            LISTEDDATE: '2010-06-29';
            FISCALDATE: '12-31';
            PARVALUE: '0.001 USD';
            ADSZS: '--';
          }
        ];
        gszl: [
          {
            SECURITYCODE: 'TSLA.O';
            SECURITYSHORTNAME: '特斯拉';
            COMPNAME: 'Tesla, Inc.';
            COMPNAMECN: '特斯拉公司';
            INDUSTRY: '汽车制造商';
            SHAREH: '--';
            CAPITAL: '--';
            CHAIRMAN: 'Robyn M. Denholm';
            SECY: '--';
            FOUNDDATE: '2003-07-01';
            EMPLOYNUM: '70757';
            MAINBUSIN: '--';
            ADDRESS: '美国特拉华州';
            OFFICEADDRESS: '3500 Deer Creek Road, Palo Alto, California, USA';
            WEBSITE: 'www.tesla.com';
            EMAIL: 'NASales@tesla.com';
            PHONE: '+1 (650) 681-5000';
            FAX: '+1 (650) 681-5101';
            COMPPROFILE: '    特斯拉公司是一家美国电动汽车及能源公司,2003年7月1日,由马丁·艾伯哈德和马克·塔彭宁共同创立。特斯拉设计、开发、制造、销售和租赁高性能全电动汽车和能源发电和存储系统,并提供与其产品相关的服务。特斯拉是全球首家垂直整合的可持续能源公司,提供端到端的清洁能源产品,包括发电、存储和消费。\n    特斯拉目前或正计划推出电动汽车,以满足广泛的消费和商用车市场,包括Model 3、Model Y、Model S、Model X、Cybertruck、Tesla Semi和一款新的Tesla Roadster。结合其动力系统、自动驾驶和全自动驾驶(“FSD”)硬件和神经网络的技术进步,其电动汽车拥有领先里程和充电灵活性等优势;优越的加速、操控和安全特性;一套独特的方便用户和信息娱乐功能;通过无线更新启用额外功能的能力;以及节省充电、维护和其他拥有成本。';
          }
        ];
        zygc_bgq: [
          {
            SECURITYCODE: 'TSLA.O';
            REPORTDATE: '2021-06-30';
          }
        ];
        zygc_cp: [
          {
            SECURITYCODE: 'TSLA.O';
            SECURITYSHORTNAME: '特斯拉';
            REPORTDATE: '2021-06-30';
            STARTDATE: '2021-01-01';
            CURRENCY: 'USD';
            CLASS: '1';
            RANK: '1';
            PRODUCTNAME: 'Automotive sales without resale value guarantee';
            MBREVENUE: '17345000000';
            RATIO: '77.6166823287242';
          }
        ];
        zygc_dq: [
          {
            SECURITYCODE: 'TSLA.O';
            SECURITYSHORTNAME: '特斯拉';
            REPORTDATE: '2021-06-30';
            STARTDATE: '2021-01-01';
            CURRENCY: 'USD';
            CLASS: '1';
            RANK: '1';
            REGIONNAME: 'United States';
            MBREVENUE: '9629000000';
            RATIO: '43.0885577482436';
          }
        ];
        ggyj: [
          {
            SECURITYCODE: 'TSLA.O';
            SECURITYSHORTNAME: '特斯拉';
            NAMEEN: 'Robyn M. Denholm';
            SEX: '女';
            EDUCATION: '博士';
            BIRTHDATE: '1964';
            OCCUPATION: 'Independent Director，Chairman of the Board';
            RESUME: '--';
            RESUMEEN: 'Robyn Denholm has been a member of the Board since August 2014 and its Chair since November 2018. Since January 2021, Ms. Denholm has been an operating partner of Blackbird Ventures, a venture capital firm. From January 2017 through June 2019, Ms. Denholm was with Telstra Corporation Limited, a telecommunications company (“Telstra”), where she served as Chief Financial Officer and Head of Strategy from October 2018 through June 2019, and Chief Operations Officer from January 2017 to October 2018. Prior to Telstra, from August 2007 to July 2016, Ms. Denholm was with Juniper Networks, Inc., a manufacturer of networking equipment, serving in executive roles including Executive Vice President, Chief Financial Officer and Chief Operations Officer. Prior to joining Juniper Networks, Ms. Denholm served in various executive roles at Sun Microsystems, Inc. from January 1996 to August 2007. Ms. Denholm also served at Toyota Motor Corporation Australia for seven years and at Arthur Andersen & Company for five years in various finance assignments. Ms. Denholm previously served as a director of ABB Ltd. from 2016 to 2017. Ms. Denholm is a Fellow of the Institute of Chartered Accountants of Australia/New Zealand, a member of the Australian Institute of Company Directors, and holds a Bachelor’s degree in Economics from the University of Sydney, and a Master’s degree in Commerce and a Doctor of Business Administration (honoris causa) from the University of New South Wales.';
            TOTALCOUNT: '12';
          }
        ];
      };
    }>(`http://emweb.eastmoney.com/pc_usf10/CompanyInfo/PageAjax?fullCode=${code}.O`, {
      responseType: 'json',
    });
    return {
      gsjs: body.data.gszl[0].COMPPROFILE,
      sshy: body.data.gszl[0].INDUSTRY, // 所属行业
      dsz: body.data.gszl[0].CHAIRMAN, // 董事长
      zcdz: body.data.gszl[0].ADDRESS, // 注册地址
      clrq: body.data.gszl[0].FOUNDDATE, // 成立日期
      ssrq: body.data.zqzl[0].LISTEDDATE, // 上市日期
    };
  } catch (error) {
    return defaultCompany;
  }
}

export async function GetXSBCompany(secid: string) {
  try {
    const [mk, code] = secid.split('.');
    const { body: html } = await request<string>(`http:xinsanban.eastmoney.com/F10/CompanyInfo/Introduction/${code}.html`);
    const $ = cheerio.load(html);
    const gsjs = $("span:contains('公司简介')").next().text();
    const sshy = $("span:contains('行业分类')").next().text();
    const dsz = $("span:contains('法人代表')").next().text();
    const zcdz = $("span:contains('注册地址')").next().text();
    const clrq = $("span:contains('成立日期')").next().text();
    const ssrq = $("span:contains('挂牌日期')").next().text();

    return {
      gsjs,
      sshy,
      dsz,
      zcdz,
      clrq,
      ssrq,
    };
  } catch (error) {
    return defaultCompany;
  }
}

// 1 主要 2 同类 3 所属板块
export async function GetIndustryFromEastmoney(secid: string, type: 1 | 2 | 3) {
  try {
    const { body } = await request<{
      rc: 0;
      rt: 18;
      svr: 182994846;
      lt: 1;
      full: 1;
      data: {
        total: 38;
        diff: {
          '0': {
            f12: string; //'600059';
            f13: string; //'1'
            f14: string; //'古越龙山';
          };
        };
      };
    }>(`http://push2.eastmoney.com/api/qt/slist/get`, {
      searchParams: {
        pi: 0,
        pz: 100,
        fields: 'f12,f13,f14',
        spt: type,
        secid,
      },
      responseType: 'json',
    });
    const result = Object.values(body.data.diff).map((i) => ({
      name: i.f14,
      code: i.f12,
      secid: `${i.f13}.${i.f12}`,
    }));
    if (type === 1 && result.length > 1) {
      result.shift();
    }
    return result;
  } catch (error) {
    return [];
  }
}

export async function GetCloseDayDates() {
  try {
    const { body } = await request<{
      version: string;
      result: {
        pages: 1;
        data: {
          MKT: string;
          HOLIDAY: string;
          SDATE: string;
          EDATE: string;
          XS: '';
        }[];
        count: 131;
      };
      success: true;
      message: 'ok';
      code: 0;
    }>(`https://datacenter-web.eastmoney.com/api/data/get`, {
      searchParams: {
        type: 'RPTA_WEB_ZGXSRL',
        sty: 'ALL',
        ps: 200,
        st: 'sdate',
        sr: -1,
        _: Date.now(),
      },
      responseType: 'json',
    });
    return body.result.data;
  } catch (error) {
    return [];
  }
}

export async function GetMeetingData({ startTime, endTime, code }: { startTime: string; endTime: string; code: string }) {
  try {
    const { body } = await request<{
      version: 'b0ba2c16623998ee2e8c464dd1f32ccd';
      result: {
        pages: 1;
        data: {
          START_DATE: string;
          END_DATE: string;
          FE_CODE: '10849794';
          FE_NAME: '2022第二十一届南京(全国)春节食品商品交易会';
          FE_TYPE: '其他会议';
          CONTENT: '南京为江苏省的政治、经济、文化中心,有着八百万人口的巨大市场消费潜力,她地处华东地区的交通枢纽,对周边省市的市场具有强劲的辐射和带动作用,历来被广大厂家和商家所重视。春节前夕,是众多单位和广大市民在忙碌了一年后消费量巨大、消费集中的时节。从2002年春节前夕举办的“首届南京(全国)春节食品商品交易会”到2021年春节前夕举办的“第二十届南京(全国)春节食品商品交易会”,都给众多单位和广大市民提供了一个集中采购春节食品的场所,同时也为广大厂商提供了一个展示企业风采、寻求产品代理、销售企业产品的好时机。“第二十一届南京(全国)春节食品商品交易会”定在春节前夕的2022年1月1一27日举办。有来自全国各地的名特优新食品、绿色食品、粮油食品、速冻食品、调味品、酒类、饮料、土特产品等一千多家企业参展。由于我们在会前做了大量的宣传、组织工作,因此,二十届交易会期间,展馆内外都是气氛热烈,人潮涌动,单位团购、市民零购踊跃。火爆的销售,令众多前来购物者满载而归,令广大参展企业收到了很好的社会效益和经济效益。为了办好这一年一届的展会,组委会将进一步做好宣传、组织、策划工作,以满足广大企业、市民采购春节食品需求。为参展企业取得更好的社会和经济效益是我们的追求,我们将一如既往,为将“第二十一届南京(全国)春节食品商品交易会”办得更大、更好而不懈努力。展览范围:各种名特优新食品、绿色食品、粮油食品、休闲食品、速冻食品、烘焙食品、肉禽产品、调味品、乳制品、干果炒货、土特产品、农产品等;各种酒类、饮料、茶叶、咖啡等;厨房用品、工艺礼品、床上用品、服饰鞋帽、休闲用品及现代家居用品等。';
          STD_TYPE_CODE: '1';
          SPONSOR_NAME: '食品交易会组委会';
          CITY: '南京';
        }[];
        count: 6;
      };
      success: true;
      message: 'ok';
      code: 0;
    }>(`https://datacenter-web.eastmoney.com/api/data/get`, {
      searchParams: {
        type: 'RPT_CPH_FECALENDAR',
        p: 1,
        ps: 50,
        st: 'START_DATE',
        sr: 1,
        filter: `(END_DATE>='${startTime}')(START_DATE<='${endTime}')((STD_TYPE_CODE="${code}"))`,
        f1: `(END_DATE>='${startTime}')(START_DATE<='${endTime}')`,
        f2: `(STD_TYPE_CODE="${code}")`,
        source: 'WEB',
        client: 'WEB',
        sty: 'START_DATE,END_DATE,FE_CODE,FE_NAME,FE_TYPE,CONTENT,STD_TYPE_CODE,SPONSOR_NAME,CITY',
        _: Date.now(),
      },
      responseType: 'json',
    });
    return body.result.data;
  } catch (error) {
    return [];
  }
}

// 获取持有股票的基金
export async function GetStockHoldFunds(secid: string, date: string) {
  try {
    const [type, code] = secid.split('.');
    const { body } = await request<{
      data: {
        SECUCODE: '300750.SZ';
        SECURITY_CODE: '300750';
        SECURITY_INNER_CODE: '1001194744';
        SECURITY_NAME_ABBR: '宁德时代';
        REPORT_DATE: '2022-03-31 00:00:00';
        HOLDER_CODE: '159915';
        HOLDER_NAME: '易方达创业板ETF';
        PARENT_ORG_CODE: '10004951';
        PARENT_ORGCODE_OLD: '80000229';
        PARENT_ORG_NAME: '易方达基金管理有限公司';
        ORG_TYPE_CODE: '1';
        ORG_TYPE: '基金';
        TOTAL_SHARES: 6280642;
        HOLD_MARKET_CAP: 3217572896.6;
        TOTAL_SHARES_RATIO: 0.26945701;
        FREE_SHARES_RATIO: 0.3080775;
        NETASSET_RATIO: 18.85;
        ORG_NAME_ABBR: '易方达基金';
        BuyState: false;
      }[];
      pages: 22;
      success: true;
      url: 'http://datacenter-web.eastmoney.com/api/data/v1/get';
    }>(`https://data.eastmoney.com/dataapi/zlsj/detail`, {
      searchParams: {
        SHType: 1,
        SHCode: '',
        SCode: code,
        ReportDate: date,
        sortField: 'TOTAL_SHARES',
        sortDirec: 1,
        pageNum: 1,
        pageSize: 90,
      },
      responseType: 'json',
    });
    return body.data;
  } catch (error) {
    return [];
  }
}

// 获取报告日期
export async function GetReportDate() {
  try {
    const { body } = await request<{
      version: '300d3b05facfd205e77e0cb4ad7f97cb';
      result: {
        pages: 4;
        data: {
          REPORT_DATE: '2022-03-31 00:00:00';
        }[];
        count: 96;
      };
      success: true;
      message: 'ok';
      code: 0;
    }>(` https://datacenter-web.eastmoney.com/api/data/v1/get`, {
      searchParams: {
        reportName: 'RPT_MAIN_REPORTDATE',
        columns: 'REPORT_DATE',
        quoteColumns: '',
        pageNumber: 1,
        pageSize: 25,
        sortTypes: -1,
        sortColumns: 'REPORT_DATE',
        source: 'WEB',
        client: 'WEB',
        _: Date.now(),
      },
      responseType: 'json',
    });
    return body.result.data.map((_) => dayjs(_.REPORT_DATE).format('YYYY-MM-DD'));
  } catch (error) {
    return [];
  }
}
