import iconv from 'iconv-lite';
import NP from 'number-precision';
import cheerio from 'cheerio';
import * as Utils from '@/utils';
import dayjs from 'dayjs';

const { got } = window.contextModules;

// 天天基金
export async function FromEastmoney(code: string) {
  try {
    const { body } = await got(`http://fundgz.1234567.com.cn/js/${code}.js`, {});
    if (body.startsWith('jsonpgz')) {
      const fund: Fund.ResponseItem = eval(body);
      if (fund === undefined) {
        return await GetQDIIFundFromEastMoney(code);
      } else {
        return fund;
      }
    } else {
      return null;
    }
  } catch (error) {
    return await GetQDIIFundFromEastMoney(code);
  }
}

// 基金速查网
export async function FromDayFund(code: string) {
  try {
    const { body } = await got('https://www.dayfund.cn/ajs/ajaxdata.shtml', {
      searchParams: {
        showtype: 'getfundvalue',
        fundcode: code,
      },
    });
    if (body === '||||%|%|||||') {
      return null;
    }
    const { body: html } = await got(`https://www.dayfund.cn/fundinfo/${code}.html`);
    const $ = cheerio.load(html);
    const [name] = $('meta[name=keywords]').attr('content')?.split(',') || [''];
    const [
      jzrq,
      dwjz, // 单位净值
      ljjz,
      sjbjz,
      sjzzl,
      gsbjl,
      gsbjz,
      gsz,
      xxjz, // 未知净值
      gzrq,
      gztime,
    ] = body.split('|');

    // 2021-01-29|1.8040|2.2490|-0.0440|-2.3800%|-1.8652%|-0.0345|1.8135|1.8480|2021-01-29|15:35:00
    return {
      name,
      fundcode: code,
      gztime: `${gzrq} ${gztime}`,
      gszzl: Number(gsbjl.replace(/%/g, '')).toFixed(2),
      jzrq,
      dwjz,
      gsz,
    };
  } catch (error) {
    return null;
  }
}

// 腾讯证券
export async function FromTencent(code: string) {
  try {
    const {
      body: { data },
    } = await got('https://web.ifzq.gtimg.cn/fund/newfund/fundSsgz/getSsgz', {
      searchParams: {
        app: 'web',
        symbol: `jj${code}`,
      },
      responseType: 'json',
    });
    const { yesterdayDwjz, code: status, data: list, date: gzrq } = data;
    if (status === -1) {
      return null;
    }
    const [time, ssgsz] = list.pop();
    const { body } = await got(`https://gu.qq.com/jj${code}`);
    const $ = cheerio.load(body);
    const dwjz = yesterdayDwjz;
    const name = $('.title .col_1').text();
    const jzrq = $('#main3').text();
    const gsz = $('#main5').text() || ssgsz;
    const gzTime = `${time.slice(0, 2)}:${time.slice(2)}`;
    const gszzl = NP.times(NP.divide(NP.minus(gsz, dwjz), dwjz), 100).toFixed(2);

    return {
      name,
      dwjz,
      fundcode: code,
      gztime: `${gzrq} ${gzTime}`,
      jzrq,
      gsz,
      gszzl,
    };
  } catch (error) {
    return null;
  }
}

// 新浪基金
export async function FromSina(code: string) {
  try {
    const { rawBody } = await got(`https://hq.sinajs.cn/list=fu_${code}`, {
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
      },
    });

    const utf8String = iconv.decode(rawBody, 'GB18030');
    const [w, contnet] = utf8String.split('=');
    const data = contnet.replace(/(")|(;)|(\s)/g, '');
    if (!data) {
      return null;
    }
    const { body: html } = await got(`https://finance.sina.com.cn/fund/quotes/${code}/bc.shtml`);
    const $ = cheerio.load(html);
    const jzrq = $('#fund_info_blk2 > .fund_data_date').text().slice(5);
    const [name, time, gsz, dwjz, zjz, unknow1, gszzl, gzrq] = data.split(',');
    return {
      name,
      dwjz,
      fundcode: code,
      gztime: `${gzrq} ${time}`,
      jzrq,
      gsz,
      gszzl: Number(gszzl).toFixed(2),
    };
  } catch (error) {
    return null;
  }
}

// 好买基金
export async function FromHowbuy(code: string) {
  try {
    const { body } = await got(`https://www.howbuy.com/fund/ajax/gmfund/valuation/valuationnav.htm`, {
      method: 'post',
      searchParams: {
        jjdm: code,
      },
    });
    if (!body) {
      return null;
    }
    let $ = cheerio.load(body);
    const gsz = $('span').eq(0).text();
    const gszzl = $('span').eq(2).text().replace(/%/g, '');
    const year = new Date().getFullYear();
    const gztime = `${year}-${$('span')
      .eq(3)
      .text()
      .replace(/(\[)|(\])/g, '')
      .trim()}`;

    const { body: html } = await got(`https://www.howbuy.com/fund/${code}/`, {
      method: 'post',
    });
    $ = cheerio.load(html);
    const name = $('.gmfund_title .lt h1')
      .text()
      .replace(/(\()|(\))|(\d)/g, '');
    const dwjz = $('.dRate > div').text().trim();
    const date = /\d{2}-\d{2}/.exec($('.dRate').next().text())?.[0];
    const jzrq = date ? `${year}-${date}` : '无法获取';
    return {
      name,
      dwjz,
      fundcode: code,
      gztime,
      jzrq,
      gsz,
      gszzl: Number(gszzl).toFixed(2),
    };
  } catch (error) {
    return null;
  }
}

// 易天富
export async function FromEtf(code: string) {
  try {
    const {
      body: { data },
    } = await got<{
      code: 200;
      successcode: 1;
      data: {
        gzrq: '2021-05-14';
        result: {
          fundcode: string;
          gztime: string; // '09:30';
          gzprice: number; // '1.0468';
          gzzf: string; // '0.56';
          hushen300xj: number; // '5009.46';
          shenzhengxj: number; // '13967.33';
          shangzhengxj: number; // '3436.76';
          hushen300zf: number; // '0.33';
          shenzhengzf: number; // '0.36';
          shangzhengzf: number; // '0.21';
        }[];
      };
      msg: '查询成功';
    }>(`http://api.etf88.com/fundcode/getfundguzhizhangfuzoushi`, {
      searchParams: {
        fundcode: code,
      },
      responseType: 'json',
    });
    if (!data) {
      return null;
    }
    const { body: html } = await got(`http://www.etf88.com/jj/${code}/`, {});
    const $ = cheerio.load(html);
    const name = $('h1[class="name"]').text();
    const firstDate = $('.table').eq(1).find('tbody tr').eq(0).find('td').eq(0).text();

    const firstJz = $('.table').eq(1).find('tbody tr').eq(0).find('td').eq(1).text();

    const secondDate = $('.table').eq(1).find('tbody tr').eq(1).find('td').eq(0).text();

    const secondJz = $('.table').eq(1).find('tbody tr').eq(1).find('td').eq(1).text();
    const dwjz = data.gzrq === firstDate ? secondJz : firstJz;

    const jzrq = $('.fund-d-title')
      .eq(0)
      .text()
      .replace(/(?![0-9/-])./g, '');

    const result = data.result || [];
    const temp: any = result.pop() || {};

    return {
      name, // 名称 '诺安混合'
      fundcode: temp.fundcode, // 代码 '320007'
      gztime: `${data.gzrq} ${temp.gztime}`, // 估值时间 '2021-01-01 15:00'
      gszzl: temp.gzzf, // 估算增长率 '-1.234'
      jzrq, // 净值日期 '2021-01-01'
      dwjz, // 当前净值 '1.1111'
      gsz: temp.gzprice, // 估算值 '1.2222'
    };
  } catch (error) {
    return null;
  }
}

// 支付宝-蚂蚁基金
export async function FromFund123(code: string) {
  try {
    const { body: html, headers } = await got(`https://www.fund123.cn/matiaria`, {
      searchParams: {
        fundCode: code,
      },
    });
    const $ = cheerio.load(html);
    const script = $('script').eq(2).html();
    const fixscript = script?.replace(/window\.context/g, 'const o');
    const context = eval(`(() => {
      ${fixscript}
      return o;
    })()`);
    const {
      csrf,
      materialInfo: {
        productId,
        fundCode,
        fundBrief: { fundNameAbbr },
        titleInfo: { netValue, netValueDate, dayOfGrowth },
      },
    }: {
      success: true;
      message: '请求成功';
      materialInfo: {
        productId: '20170808000230030000000000013513';
        fundCode: '002258';
        fundType: '混合型';
        titleInfo: {
          fundLimit: '0--';
          netValue: string; // '3.6580';
          netValueDate: '09-13';
          profitSevenDays: '--';
          profitTenThousand: '--';
          dayOfGrowth: '2.46';
          lastWeek: '5.88';
          riskEvaluation: '中高风险';
          establishmentDate: '2017-09-21';
          assetSize: '1.04亿';
          fundManagerName: '韩创';
        };
        fundBrief: {
          fundNameAbbr: '大成国企改革灵活配置混合';
          fundName: '大成国企改革灵活配置混合型证券投资基金';
          fundCode: '002258';
          establishmentDate: '2017-\n          09-\n          21';
          shareSize: '41784787.66';
          assetSize: '104651741.15';
          fundManagerName: '韩创';
          saleStatus: '正常申购';
          fundCompanyName: '大成基金管理有限公司';
          trusteeName: '中国银行股份有限公司';
          manageRate: '1.5%';
          trusteeRate: '0.25%';
          purchaseMinMount: '10.00';
          redeemMinMount: '1';
          purchaseRatio: '--';
          redeemRatio: '--';
          generalInfo: {
            fundName: '大成国企改革灵活配置混合型证券投资基金';
            establishmentDate: '2017-\n            09-\n            21';
            fundCode: '002258';
            assetSize: '104651741.15';
            fundCompanyName: '--';
            trusteeName: '中国银行股份有限公司';
            fundManagerBackground: '    韩创，中国国籍，金融学硕士，9年证券从业年限，具有基金从业资格。2012年6月至2015年6月曾任招商证券研究部研究员。2015年6月加入大成基金管理有限公司，历任研究部研究员、基金经理助理。2019年1月10日至2020年2月3日，担任大成消费主题混合型证券投资基金的基金经理。2019年1月10日起，担任大成新锐产业混合型证券投资基金的基金经理。2020年1月2日起，担任大成睿景灵活配置混合型证券投资基金的基金经理。2021年2月9日起，担任大成产业趋势混合型证券投资基金的基金经理。自2021年1月13日起，担任大成国企改革灵活配置混合型证券投资基金的基金经理。自2021年6月30日起，担任大成核心趋势混合型证券投资基金的基金经理。';
            fundManagerInfoList: [
              {
                key: '1';
                fundName: '大成新锐产业混合型证券投资基金';
                officeDate: '2019-01-10  至今';
                earnings: '3.979472';
              },
              {
                key: '2';
                fundName: '大成睿景灵活配置混合型证券投资基金A类';
                officeDate: '2020-01-02  至今';
                earnings: '2.241387';
              },
              {
                key: '3';
                fundName: '大成睿景灵活配置混合型证券投资基金C类';
                officeDate: '2020-01-02  至今';
                earnings: '2.201024';
              },
              {
                key: '4';
                fundName: '大成国企改革灵活配置混合型证券投资基金';
                officeDate: '2021-01-13  至今';
                earnings: '0.794896';
              },
              {
                key: '5';
                fundName: '大成产业趋势混合型证券投资基金A类';
                officeDate: '2021-02-09  至今';
                earnings: '0.448205';
              },
              {
                key: '6';
                fundName: '大成产业趋势混合型证券投资基金C类';
                officeDate: '2021-02-09  至今';
                earnings: '0.441500';
              },
              {
                key: '7';
                fundName: '大成核心趋势混合型证券投资基金C类';
                officeDate: '2021-06-30  至今';
                earnings: '0.225799';
              },
              {
                key: '8';
                fundName: '大成核心趋势混合型证券投资基金A类';
                officeDate: '2021-06-30  至今';
                earnings: '0.226099';
              }
            ];
            investPhilosophy: '    本基金的投资目标是通过投资于国企改革相关的优质上市公司，在严格控制风险的前提下，力争获取超越业绩比较基准的收益。';
            investStrategy: '    本基金通过对宏观经济环境、国家经济政策、股票市场风险、债券市场整体收益率曲线变化和资金供求关系等因素的分析，研判经济周期在美林投资时钟理论所处的阶段，综合评价各类资产的市场趋势、预期风险收益水平和配置时机。\r\n    本基金认为当前受益于国企改革的上市公司股票涉及多个行业，本基金将通过自下而上研究入库的方式，对各个行业中受益于国企改革主题的上市公司进行深入研究，并将这些股票组成本基金的核心股票库。\r\n    本基金将根据融资买入股票成本以及其他投资工具收益率综合评估是否采用融资方式买入股票，本基金在任何交易日日终持有的融资买入股票与直接买入股票市值之和，不得超过基金资产净值的95%。\r\n    本基金的债券投资采取稳健的投资管理方式，获得与风险相匹配的投资收益，以实现在一定程度上规避股票市场的系统性风险和保证基金资产的流动性。\r\n    中小企业私募债票面利率较高、信用风险较大、二级市场流动性较差。';
          };
        };
      };
      isLogin: false;
      csrf: 'GZiniT4s-CXuZczggNnZdY5lDoIb7ea5Jjho';
      isCloseEstimate: false;
      pageName: 'matiaria?fundCode=002258';
      uriBroker: {
        'favicon.ico.url': 'https://gw.alipayobjects.com/zos/rmsportal/mgPTSSvpLkKrsQwhoDzv.ico';
        'app.404.url': 'https://www.alipay.com/404.html';
        'zdrmdata.rest.url': 'http://zdrmdata-pool.gz00g.alipay.com';
        'app.errorpage.url': 'https://www.alipay.com/50x.html';
        'authcenter.url': 'https://auth.alipay.com';
        'app.goto.url': 'https://my.alipay.com/portal/i.htm';
        'bumng.url': 'https://bumng.alipay.com';
        'omeo.check.url': 'http://omeo-pool.gz00g.alipay.com';
        'omeo.get.url': 'https://omeo.alipay.com';
        'assets.url': 'https://gw.alipayobjects.com/a';
      };
    } = context;
    const cookies = headers['set-cookie'];
    const now = dayjs();
    const res = await got<{
      success: true;
      list: {
        bizSeq: 0;
        time: 1631583000000;
        forecastNetValue: string; //'4.22780306';
        forecastGrowth: string; //'-0.00662522';
      }[];
    }>(`https://www.fund123.cn/api/fund/queryFundEstimateIntraday`, {
      method: 'POST',
      searchParams: {
        _csrf: csrf,
      },
      headers: {
        cookie: cookies?.join(''),
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        startTime: now.format('YYYY-MM-DD'),
        endTime: now.add(1, 'day').format('YYYY-MM-DD'),
        limit: 200,
        productId: productId,
        format: true,
        source: 'WEALTHBFFWEB',
      }),
      responseType: 'json',
    });
    const { body } = res;
    const last = body.list.pop()!;
    const gzData = dayjs(last.time).format('MM-DD');
    let dwjz = netValue;

    if (netValueDate === gzData) {
      dwjz = String(NP.divide(netValue, NP.divide(NP.plus(100, dayOfGrowth), 100)));
    }
    const result = {
      name: fundNameAbbr,
      fundcode: fundCode,
      gztime: dayjs(last.time).format('YYYY-MM-DD HH:mm'),
      gsz: last.forecastNetValue,
      gszzl: (Number(last.forecastGrowth) * 100).toFixed(2),
      jzrq: `${now.year()}-${netValueDate}`,
      dwjz: dwjz,
    };

    return result;
  } catch (error) {
    return await GetQDIIFundFromFund123(code);
  }
}

// 同花顺-爱基金
export async function FromFund10jqka(code: string) {
  try {
    const { body } = await got<{
      data: [
        {
          code: '003834';
          enddate: '2021-09-30';
          type: 'nohbx';
          net: '3.8040';
          totalnet: '3.8040';
          ranges: '0.1330';
          rate: '3.62';
          net1: '3.6710';
          totalnet1: '3.6710';
          enddate1: '2021-09-29';
          mark: 'ths';
          updatetime: '211003024536';
          hqcode: 'JSH123';
          name: '华夏能源革新股票A';
          fundtype: '股票型';
          clrq: '2017-06-07';
          manager: '郑泽鸿';
          orgname: '华夏基金管理有限公司';
          dqlcqx: '-1';
          dqrq: '';
          sgstat: '限制大额';
          shstat: '开放';
          money: '50.0000';
          sgoldfl: '1.5';
          sgfl: '0.15';
          rgStart: '2017-05-04';
          rgEnd: '2017-06-02';
          rcsgStart: '2017-07-07';
          rcshStart: '2017-07-07';
          ifnew: 0;
          rgfl: '0.15';
          rgflold: '1.5';
          buy: '1';
          dt: '1';
          zkl: '0.1';
          zdsg: '10';
          nowyear: '40.73';
          week: '-5.89';
          month: '-9.10';
          tmonth: '12.64';
          year: '130.27';
          hyear: '55.84';
          tyear: '346.48';
          mz: '1.0000';
          themeList: [
            {
              field_name: '特斯拉';
              field_type: '概念';
              id: 'd0a32faf345dc75d9c7c8f2479f9224a';
            },
            {
              field_name: '三星';
              field_type: '概念';
              id: '5131c72b5ed2ef94eaca2675bc7c6f0d';
            }
          ];
          thsqbfl: '';
          jjgm: '66.35';
          levelOfRiskCode: '706003';
          levelOfRisk: '中风险';
          ifzj: '1';
          ifgz: '1';
          iszcg: '1';
          iszcz: '0';
          isfof: '0';
          asset: '224.10';
          fundBanner: [];
          showType: '1';
          rgStartReal: '2017-05-04';
          rgStartRealTime: '2017-05-04 00:00:00';
          rgEndRealTime: '2017-06-02 15:00:00';
          fastcash: '1';
          dqlc: 0;
          lcqx: '--';
          maxStar: '5';
          nowtime: 1633309917000;
        }
      ];
      error: {
        id: 0;
        msg: 'is access';
      };
    }>(`https://fund.10jqka.com.cn/data/client/myfund/${code}`, {
      responseType: 'json',
    });
    const data = body.data.pop()!;
    const now = new Date();
    const { body: script } = await got('https://gz-fund.10jqka.com.cn/', {
      searchParams: {
        module: 'api',
        controller: 'index',
        action: 'chart',
        info: `vm_fd_${data.hqcode}`,
        _: Date.now(),
        start: dayjs(now).format('MMDD'),
      },
    });

    const string = eval(`(()=>{
      const ${script};
      return vm_fd_${data.hqcode};
    })()`);

    const [info, _dwjz, gsinfo] = string.split('~');
    const gzdata = info.split('|').pop();

    const last: string = gsinfo.split(';').pop();
    const [time, gsz, dwjz, zero] = last.split(',');
    const gszzl = NP.divide(NP.minus(gsz, dwjz), dwjz, 0.01).toFixed(2);

    return {
      name: data.name,
      fundcode: data.code,
      gztime: `${gzdata} ${time.slice(0, 2)}:${time.slice(2)}`,
      gszzl: gszzl,
      jzrq: data.enddate,
      dwjz: data.net,
      gsz,
    };
  } catch (error) {
    return await GetQDIIFundFromFund10jqka(code);
  }
}

// 从天天基金获取估值图片
export async function GetEstimatedFromEastmoney(code: string) {
  try {
    const { rawBody }: any = await got(`http://j4.dfcfw.com/charts/pic6/${code}.png`, {});
    const b64encoded = btoa(String.fromCharCode.apply(null, rawBody));
    return `data:image/png;base64,${b64encoded}`;
  } catch (error) {
    return null;
  }
}

// 从天天基金获取投资风格图片
export async function GetInverstStyleFromEastmoney(code: string) {
  try {
    const { rawBody }: any = await got(`http://j3.dfcfw.com/images/InvestStyle/${code}.png`, {});
    const b64encoded = btoa(String.fromCharCode.apply(null, rawBody));
    return `data:image/png;base64,${b64encoded}`;
  } catch (error) {
    return null;
  }
}

// 从天天基金获取股票持仓
export async function GetStockWareHouseFromEastmoney(code: string, stockCodes: string[]) {
  try {
    const { body: html } = await got(`http://fund.eastmoney.com/${code}.html`, {});
    const $ = cheerio.load(html);
    const secids = (stockCodes || []).join(',') || '';
    const tors = $('#quotationItem_DataTable').find('#position_shares').find('tr > td:nth-child(2)').text().split('%');

    const {
      body: { data },
    } = await got('https://push2.eastmoney.com/api/qt/ulist.np/get', {
      searchParams: {
        fields: 'f2,f3,f12,f13,f14',
        fltt: 2,
        secids,
      },
      responseType: 'json',
    });
    const {
      diff,
    }: {
      diff: {
        f2: string; // 最新价
        f3: number; // 涨跌幅
        f14: string; // 名称
        f13: string; // market
        f12: string; // 股票代码
      }[];
    } = data;

    const result: Fund.WareHouse[] = diff.map((item, index) => {
      return {
        zxz: item.f2,
        name: item.f14,
        market: item.f13,
        code: item.f12,
        zdf: item.f3,
        ccb: tors[index], // 持仓比
      };
    });
    return result;
  } catch (error) {
    return [];
  }
}

// 从天天基金获取债券持仓
export async function GetSecuritiesWareHouseFromEastmoney(code: string, securitiesCodes: string) {
  try {
    const { body: html } = await got(`http://fund.eastmoney.com/${code}.html`, {});
    const $ = cheerio.load(html);
    const secids = securitiesCodes || '';
    const tors = $('#quotationItem_DataTable').find('#position_bonds').find('tr > td:nth-child(2)').text().split('%');

    const {
      body: { data },
    } = await got('https://push2.eastmoney.com/api/qt/ulist.np/get', {
      searchParams: {
        fields: 'f2,f3,f12,f13,f14',
        fltt: 2,
        secids,
      },
      responseType: 'json',
    });
    const {
      diff,
    }: {
      diff: {
        f2: string; // 最新价
        f3: number; // 涨跌幅
        f14: string; // 名称
        f13: string; // market
        f12: string; // 债券代码
      }[];
    } = data;
    const result: Fund.WareHouse[] = diff.map((item, index) => {
      return {
        zxz: item.f2,
        name: item.f14,
        market: item.f13,
        code: item.f12,
        zdf: item.f3,
        ccb: tors[index], // 持仓比
      };
    });
    return result;
  } catch (error) {
    return [];
  }
}

// 从天天基金获取基金详情
export async function GetFundDetailFromEastmoney(code: string) {
  try {
    const { body } = await got(`http://fund.eastmoney.com/pingzhongdata/${code}.js`, {});
    const response: Fund.PingzhongData = Utils.parsepingzhongdata(body);
    return response;
  } catch (error) {
    return {};
  }
}

// 从天天基金获取近期表现
export async function GetFundPerformanceFromEastmoney(
  code: string,
  type: string // 'm' | 'q' | 'hy' | 'y' | 'try' | 'se'
) {
  try {
    const {
      body: { Data },
    } = await got(`http://api.fund.eastmoney.com/pinzhong/LJSYLZS`, {
      searchParams: {
        fundCode: code,
        indexcode: '000300',
        type,
      },
      headers: {
        Referer: 'http://fund.eastmoney.com/',
      },

      responseType: 'json',
    });

    const result: any[] = Data;
    return result;
  } catch (error) {
    return [];
  }
}

// 从天天基金获取所有基金信息
export async function GetRemoteFundsFromEastmoney() {
  try {
    const { body } = await got('http://fund.eastmoney.com/js/fundcode_search.js', {});
    return Utils.ParseRemoteFunds(body);
  } catch (error) {
    return [];
  }
}

// 从天天基金查询最新净值信息
export async function GetFixFromEastMoney(code: string) {
  try {
    const { body: html } = await got(`http://fund.eastmoney.com/${code}.html`);
    const $ = cheerio.load(html);
    const isCurrency = $('.sp01').find('a').text().includes('每万份收益');
    const fixZzl =
      $('.fix_zzl')
        .text()
        ?.replace(/[^0-9/./-]/g, '') || '0';
    const fixDate = $('.fix_date')
      .text()
      ?.replace(/[^0-9/-]/g, '');
    const fixDwjz =
      $('.fix_dwjz')
        .text()
        ?.replace(/[^0-9/.]/g, '') || '0';
    const fixName = $('.fix_fname').text();

    const result: Fund.FixData = {
      code,
      fixName,
      fixDwjz: isCurrency ? '1.0000' : fixDwjz,
      fixZzl: isCurrency ? (Number(fixDwjz) / 10000).toFixed(2) : fixZzl,
      fixDate,
      isCurrency,
    };
    return result;
  } catch (error) {
    return null;
  }
}

// 从天天基金查询基金经理详情信息
export async function GetFundManagerDetailFromEastMoney(code: string) {
  try {
    const { body: html } = await got(`http://fund.eastmoney.com/manager/${code}.html`);
    const $ = cheerio.load(html);
    const description = $('meta[name="description"]').attr('content') || '';
    const table = $('.content_in').find('.ftrs')[0];

    const manageHistoryFunds: Fund.Manager.ManageHistoryFund[] = $(table)
      .find('tbody tr')
      .toArray()
      .map((tr) => {
        // 0: "002560"
        // 1: "诺安和鑫灵活配置混合"
        // 2: "估值图基金吧档案"
        // 3: "混合型"
        // 4: "82.17"
        // 5: "2019-03-14 ~ 至今"
        // 6: "2年又6天"
        // 7: "80.80%"
        const [code, name, unknow1, type, unknow2, date, days, rzhb] = $(tr)
          .find('td')
          .toArray()
          .map((td) => $(td).text());
        return {
          code,
          name,
          type,
          date,
          days,
          rzhb,
        };
      });

    return {
      manageHistoryFunds,
      description,
    };
  } catch (error) {
    return {
      manageHistoryFunds: [],
      description: '',
    };
  }
}

// 查询天天基金QDII基金信息
export async function GetQDIIFundFromEastMoney(code: string) {
  try {
    // const { gztime } = (await FromEastmoney('161725'))! as Fund.ResponseItem; // TODO:估值时间暂时使用白酒最后一次开门时间
    const { fixDwjz, fixName, fixDate, fixZzl } = (await GetFixFromEastMoney(code))!;
    return {
      name: fixName,
      dwjz: fixDwjz,
      fundcode: code,
      gztime: `${new Date().getFullYear()}-暂无估值`,
      jzrq: `${new Date().getFullYear()}-${fixDate}`,
      gsz: fixDwjz,
      gszzl: '',
    };
  } catch (error) {
    return null;
  }
}

// 查询蚂蚁基金QDII基金信息
export async function GetQDIIFundFromFund123(code: string) {
  try {
    const { body: html, headers } = await got(`https://www.fund123.cn/matiaria`, {
      searchParams: {
        fundCode: code,
      },
    });
    const $ = cheerio.load(html);
    const script = $('script').eq(2).html();
    const fixscript = script?.replace(/window\.context/g, 'const o');
    const context = eval(`(() => {
      ${fixscript}
      return o;
    })()`);
    const {
      csrf,
      materialInfo: {
        productId,
        fundCode,
        fundBrief: { fundNameAbbr },
        titleInfo: { netValue, netValueDate, dayOfGrowth },
      },
    }: {
      success: true;
      message: '请求成功';
      materialInfo: {
        productId: '20170808000230030000000000013513';
        fundCode: '002258';
        fundType: '混合型';
        titleInfo: {
          fundLimit: '0--';
          netValue: string; // '3.6580';
          netValueDate: '09-13';
          profitSevenDays: '--';
          profitTenThousand: '--';
          dayOfGrowth: '2.46';
          lastWeek: '5.88';
          riskEvaluation: '中高风险';
          establishmentDate: '2017-09-21';
          assetSize: '1.04亿';
          fundManagerName: '韩创';
        };
        fundBrief: {
          fundNameAbbr: '大成国企改革灵活配置混合';
          fundName: '大成国企改革灵活配置混合型证券投资基金';
          fundCode: '002258';
          establishmentDate: '2017-\n          09-\n          21';
          shareSize: '41784787.66';
          assetSize: '104651741.15';
          fundManagerName: '韩创';
          saleStatus: '正常申购';
          fundCompanyName: '大成基金管理有限公司';
          trusteeName: '中国银行股份有限公司';
          manageRate: '1.5%';
          trusteeRate: '0.25%';
          purchaseMinMount: '10.00';
          redeemMinMount: '1';
          purchaseRatio: '--';
          redeemRatio: '--';
          generalInfo: {
            fundName: '大成国企改革灵活配置混合型证券投资基金';
            establishmentDate: '2017-\n            09-\n            21';
            fundCode: '002258';
            assetSize: '104651741.15';
            fundCompanyName: '--';
            trusteeName: '中国银行股份有限公司';
            fundManagerBackground: '    韩创，中国国籍，金融学硕士，9年证券从业年限，具有基金从业资格。2012年6月至2015年6月曾任招商证券研究部研究员。2015年6月加入大成基金管理有限公司，历任研究部研究员、基金经理助理。2019年1月10日至2020年2月3日，担任大成消费主题混合型证券投资基金的基金经理。2019年1月10日起，担任大成新锐产业混合型证券投资基金的基金经理。2020年1月2日起，担任大成睿景灵活配置混合型证券投资基金的基金经理。2021年2月9日起，担任大成产业趋势混合型证券投资基金的基金经理。自2021年1月13日起，担任大成国企改革灵活配置混合型证券投资基金的基金经理。自2021年6月30日起，担任大成核心趋势混合型证券投资基金的基金经理。';
            fundManagerInfoList: [
              {
                key: '1';
                fundName: '大成新锐产业混合型证券投资基金';
                officeDate: '2019-01-10  至今';
                earnings: '3.979472';
              },
              {
                key: '2';
                fundName: '大成睿景灵活配置混合型证券投资基金A类';
                officeDate: '2020-01-02  至今';
                earnings: '2.241387';
              },
              {
                key: '3';
                fundName: '大成睿景灵活配置混合型证券投资基金C类';
                officeDate: '2020-01-02  至今';
                earnings: '2.201024';
              },
              {
                key: '4';
                fundName: '大成国企改革灵活配置混合型证券投资基金';
                officeDate: '2021-01-13  至今';
                earnings: '0.794896';
              },
              {
                key: '5';
                fundName: '大成产业趋势混合型证券投资基金A类';
                officeDate: '2021-02-09  至今';
                earnings: '0.448205';
              },
              {
                key: '6';
                fundName: '大成产业趋势混合型证券投资基金C类';
                officeDate: '2021-02-09  至今';
                earnings: '0.441500';
              },
              {
                key: '7';
                fundName: '大成核心趋势混合型证券投资基金C类';
                officeDate: '2021-06-30  至今';
                earnings: '0.225799';
              },
              {
                key: '8';
                fundName: '大成核心趋势混合型证券投资基金A类';
                officeDate: '2021-06-30  至今';
                earnings: '0.226099';
              }
            ];
            investPhilosophy: '    本基金的投资目标是通过投资于国企改革相关的优质上市公司，在严格控制风险的前提下，力争获取超越业绩比较基准的收益。';
            investStrategy: '    本基金通过对宏观经济环境、国家经济政策、股票市场风险、债券市场整体收益率曲线变化和资金供求关系等因素的分析，研判经济周期在美林投资时钟理论所处的阶段，综合评价各类资产的市场趋势、预期风险收益水平和配置时机。\r\n    本基金认为当前受益于国企改革的上市公司股票涉及多个行业，本基金将通过自下而上研究入库的方式，对各个行业中受益于国企改革主题的上市公司进行深入研究，并将这些股票组成本基金的核心股票库。\r\n    本基金将根据融资买入股票成本以及其他投资工具收益率综合评估是否采用融资方式买入股票，本基金在任何交易日日终持有的融资买入股票与直接买入股票市值之和，不得超过基金资产净值的95%。\r\n    本基金的债券投资采取稳健的投资管理方式，获得与风险相匹配的投资收益，以实现在一定程度上规避股票市场的系统性风险和保证基金资产的流动性。\r\n    中小企业私募债票面利率较高、信用风险较大、二级市场流动性较差。';
          };
        };
      };
      isLogin: false;
      csrf: 'GZiniT4s-CXuZczggNnZdY5lDoIb7ea5Jjho';
      isCloseEstimate: false;
      pageName: 'matiaria?fundCode=002258';
      uriBroker: {
        'favicon.ico.url': 'https://gw.alipayobjects.com/zos/rmsportal/mgPTSSvpLkKrsQwhoDzv.ico';
        'app.404.url': 'https://www.alipay.com/404.html';
        'zdrmdata.rest.url': 'http://zdrmdata-pool.gz00g.alipay.com';
        'app.errorpage.url': 'https://www.alipay.com/50x.html';
        'authcenter.url': 'https://auth.alipay.com';
        'app.goto.url': 'https://my.alipay.com/portal/i.htm';
        'bumng.url': 'https://bumng.alipay.com';
        'omeo.check.url': 'http://omeo-pool.gz00g.alipay.com';
        'omeo.get.url': 'https://omeo.alipay.com';
        'assets.url': 'https://gw.alipayobjects.com/a';
      };
    } = context;
    const now = dayjs();

    const result = {
      name: fundNameAbbr,
      fundcode: fundCode,
      gztime: `${new Date().getFullYear()}-暂无估值`,
      gsz: netValue,
      gszzl: '',
      jzrq: `${now.year()}-${netValueDate}`,
      dwjz: netValue,
    };

    return result;
  } catch (error) {
    return null;
  }
}

// 查询同花顺QDII基金信息
export async function GetQDIIFundFromFund10jqka(code: string) {
  try {
    const { body } = await got<{
      data: [
        {
          code: '003834';
          enddate: '2021-09-30';
          type: 'nohbx';
          net: '3.8040';
          totalnet: '3.8040';
          ranges: '0.1330';
          rate: '3.62';
          net1: '3.6710';
          totalnet1: '3.6710';
          enddate1: '2021-09-29';
          mark: 'ths';
          updatetime: '211003024536';
          hqcode: 'JSH123';
          name: '华夏能源革新股票A';
          fundtype: '股票型';
          clrq: '2017-06-07';
          manager: '郑泽鸿';
          orgname: '华夏基金管理有限公司';
          dqlcqx: '-1';
          dqrq: '';
          sgstat: '限制大额';
          shstat: '开放';
          money: '50.0000';
          sgoldfl: '1.5';
          sgfl: '0.15';
          rgStart: '2017-05-04';
          rgEnd: '2017-06-02';
          rcsgStart: '2017-07-07';
          rcshStart: '2017-07-07';
          ifnew: 0;
          rgfl: '0.15';
          rgflold: '1.5';
          buy: '1';
          dt: '1';
          zkl: '0.1';
          zdsg: '10';
          nowyear: '40.73';
          week: '-5.89';
          month: '-9.10';
          tmonth: '12.64';
          year: '130.27';
          hyear: '55.84';
          tyear: '346.48';
          mz: '1.0000';
          themeList: [
            {
              field_name: '特斯拉';
              field_type: '概念';
              id: 'd0a32faf345dc75d9c7c8f2479f9224a';
            },
            {
              field_name: '三星';
              field_type: '概念';
              id: '5131c72b5ed2ef94eaca2675bc7c6f0d';
            }
          ];
          thsqbfl: '';
          jjgm: '66.35';
          levelOfRiskCode: '706003';
          levelOfRisk: '中风险';
          ifzj: '1';
          ifgz: '1';
          iszcg: '1';
          iszcz: '0';
          isfof: '0';
          asset: '224.10';
          fundBanner: [];
          showType: '1';
          rgStartReal: '2017-05-04';
          rgStartRealTime: '2017-05-04 00:00:00';
          rgEndRealTime: '2017-06-02 15:00:00';
          fastcash: '1';
          dqlc: 0;
          lcqx: '--';
          maxStar: '5';
          nowtime: 1633309917000;
        }
      ];
      error: {
        id: 0;
        msg: 'is access';
      };
    }>(`https://fund.10jqka.com.cn/data/client/myfund/${code}`, {
      responseType: 'json',
    });
    const data = body.data.pop()!;
    return {
      name: data.name,
      fundcode: data.code,
      gztime: `${new Date().getFullYear()}-暂无估值`,
      gszzl: '',
      jzrq: data.enddate,
      dwjz: data.net,
      gsz: data.net,
    };
  } catch (error) {
    return null;
  }
}

// 查询定投排行
export async function GetAutomaticPlanFromEastmoney(type: number) {
  try {
    const { body: html } = await got('http://fund.eastmoney.com/api/Dtshph.ashx', {
      searchParams: {
        c: 'dwjz',
        t: type,
        s: 'desc',
        issale: 1,
        page: 1,
        psize: 200,
        _: new Date().getTime(),
      },
    });
    const $ = cheerio.load(html);
    const data = $('tbody tr')
      .toArray()
      .map((tr) => {
        const [checkbox, no, code, name, more, dwjz, jzrq, y1, y2, y3, y5, star] = $(tr)
          .find('td')
          .toArray()
          .map((td) => $(td).text());
        return {
          code,
          name,
          dwjz,
          jzrq,
          y1,
          y2,
          y3,
          y5,
          star,
        };
      });
    return data;
  } catch (error) {
    return [];
  }
}

// 查询基金排行
export async function GetRankDataFromEasemoney(type: string) {
  try {
    const now = new Date();
    const { body } = await got('http://fund.eastmoney.com/data/rankhandler.aspx', {
      headers: {
        Referer: 'http://fund.eastmoney.com/data/fundranking.html',
      },
      searchParams: {
        op: 'ph',
        dt: 'kf',
        ft: type,
        rs: '',
        gs: 0,
        sc: '1yzf',
        st: 'desc',
        qdii: '',
        tabSubtype: ',,,,,',
        pi: 1,
        pn: 200,
        dx: 1,
        sd: `${now.getFullYear() - 1}-${now.getMonth() + 1}-${now.getDate()}`,
        ed: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
      },
    });
    return eval(`(() => {
      ${body}
      return rankData.datas;
    })()`);
  } catch (error) {
    return [];
  }
}

// 查询基金评级排行
export async function GetFundRatingFromEasemoney() {
  try {
    const { body: html } = await got('http://fund.eastmoney.com/data/fundrating.html', {});
    const $ = cheerio.load(html);
    const script = $('#fundinfo').find('script').html();
    const fundinfos = eval(`(() => {
      ${script}
      return fundinfos;
    })()`);
    const result: Fund.RantingItem[] = fundinfos.split('_').map((item: string) => {
      // 270007|广发大盘成长混合|混合型-偏股|苗宇|30331916|广发|80000248|2|4|0|3|0|5|0|1|0|5|1|0.15%|1|1|002|211|GFDPCZHH|GFJJ|30331916
      const [code, name, type, manager, v1, jj, v2, totalFullStar, v3, v4, zsStar, v5, szStar, v6, v7, v8, jaStar] = item.split('|');
      const total = 0 + Number(szStar || 0) + Number(zsStar || 0) + Number(jaStar || 0);
      return { code, name, type, szStar, zsStar, jaStar, total };
    });
    result.sort((a, b) => b.total - a.total);
    return result;
  } catch (error) {
    return [];
  }
}

// 查询基金持仓行业占比
export async function GetIndustryRateFromEaseMoney(code: string) {
  try {
    const { body } = await got<{
      Datas: {
        fundStocks: {
          GPDM: 'MSFT';
          GPJC: '微软';
          JZBL: string;
          TEXCH: '7';
          ISINVISBL: '--';
          PCTNVCHGTYPE: '--';
          PCTNVCHG: '--';
          NEWTEXCH: '105';
          INDEXCODE: '--';
          INDEXNAME: string;
        }[];
        fundboods: [];
        fundfofs: [];
        ETFCODE: null;
        ETFSHORTNAME: null;
      };
      ErrCode: 0;
      Success: true;
      ErrMsg: null;
      Message: null;
      ErrorCode: '0';
      ErrorMessage: null;
      ErrorMsgLst: null;
      TotalCount: 1;
      Expansion: '2021-06-30';
    }>(`http://fundmobapi.eastmoney.com/FundMNewApi/FundMNInverstPosition`, {
      searchParams: {
        product: 'EFund',
        FCODE: code,
        deviceid: 1,
        version: '6.2.7',
        plat: 'Android',
      },
      responseType: 'json',
    });
    return {
      stocks: body.Datas?.fundStocks || [],
      expansion: body.Expansion || '',
    };
  } catch (error) {
    return {
      stocks: [],
      expansion: '',
    };
  }
}

// 查询今日排行
export async function GetTodayListFromEastmoney(type: number) {
  try {
    const { body } = await got<{
      Data: {
        typeStr: '1';
        sort: '3';
        sortType: 'desc';
        canbuy: '0';
        gzrq: '2021-11-18';
        gxrq: '2021-11-19';
        list: {
          bzdm: '502010';
          ListTexch: '1';
          FScaleType: '01';
          PLevel: 103.0;
          JJGSID: '80000229';
          IsExchg: '0';
          FType: '指数型-股票';
          Discount: 1.0;
          Rate: '0.10%';
          feature: '020,050,051,054';
          fundtype: '001';
          gxrq: '2021-11-19';
          jjlx3: null;
          IsListTrade: '1';
          jjlx2: null;
          shzt: null;
          sgzt: '开放申购';
          isbuy: '1';
          gzrq: '2021-11-18';
          gspc: '0.02%';
          gsz: '1.2869';
          gszzl: '1.95%';
          jzzzl: '1.93%';
          dwjz: '1.2623';
          gbdwjz: '1.2867';
          jjjcpy: 'YFDZZQZZQGSZSLOFA';
          jjjc: '易方达中证全指证券公司指数(LOF)A';
          jjlx: null;
          gszzlcolor: 'ui-table-up';
          jzzzlcolor: 'ui-table-up';
        }[];
      };
      ErrCode: 0;
      ErrMsg: null;
      TotalCount: 12631;
      Expansion: null;
      PageSize: 200;
      PageIndex: 1;
    }>('http://api.fund.eastmoney.com/FundGuZhi/GetFundGZList', {
      searchParams: {
        type,
        sort: 3,
        orderType: 'desc',
        canbuy: 0,
        pageIndex: 1,
        pageSize: 200,
        _: new Date().getTime(),
      },
      headers: {
        Referer: 'ttp://fund.eastmoney.com/',
      },
      responseType: 'json',
    });

    const data = body.Data.list;
    return data;
  } catch (error) {
    return [];
  }
}
