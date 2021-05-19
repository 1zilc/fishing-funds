/* eslint-disable no-eval */

import iconv from 'iconv-lite';
import NP from 'number-precision';
import cheerio from 'cheerio';
import * as Utils from '../utils';

const got = window.contextModules.got;
// 天天基金
export async function FromEastmoney(code: string) {
  try {
    const { body } = await got(
      `http://fundgz.1234567.com.cn/js/${code}.js`,
      {}
    );
    return body.startsWith('jsonpgz')
      ? (eval(body) as Promise<Fund.ResponseItem | null>)
      : null;
  } catch (error) {
    console.log(error);
    return null;
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
    const { body: html } = await got(
      `https://www.dayfund.cn/fundinfo/${code}.html`
    );
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
    console.log(error);
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
    const gszzl = NP.times(NP.divide(NP.minus(gsz, dwjz), dwjz), 100).toFixed(
      2
    );

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
    console.log(error);
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
    const [_, contnet] = utf8String.split('=');
    const data = contnet.replace(/(")|(;)|(\s)/g, '');
    if (!data) {
      return null;
    }
    const { body: html } = await got(
      `https://finance.sina.com.cn/fund/quotes/${code}/bc.shtml`
    );
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
    console.log(error);
    return null;
  }
}

// 好买基金
export async function FromHowbuy(code: string) {
  try {
    const { body } = await got(
      `https://www.howbuy.com/fund/ajax/gmfund/valuation/valuationnav.htm`,
      {
        method: 'post',
        searchParams: {
          jjdm: code,
        },
      }
    );
    if (!body) {
      return null;
    }
    let $ = cheerio.load(body);
    const gsz = $('span').eq(0).text();
    const gszzl = $('span').eq(2).text().replace(/%/g, '');
    const gztime = `${new Date().getFullYear()}-${$('span')
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
    const jzrq =
      /\d{2}-\d{2}/.exec($('.dRate').next().text())?.[0] || '无法获取';
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
    console.log(error);
    return null;
  }
}

// 好买基金
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
          gztime: string; //'09:30';
          gzprice: number; //'1.0468';
          gzzf: string; // '0.56';
          hushen300xj: number; // '5009.46';
          shenzhengxj: number; //'13967.33';
          shangzhengxj: number; //'3436.76';
          hushen300zf: number; //'0.33';
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
    const firstDate = $('.table')
      .eq(1)
      .find('tbody tr')
      .eq(0)
      .find('td')
      .eq(0)
      .text();

    const firstJz = $('.table')
      .eq(1)
      .find('tbody tr')
      .eq(0)
      .find('td')
      .eq(1)
      .text();

    const secondDate = $('.table')
      .eq(1)
      .find('tbody tr')
      .eq(1)
      .find('td')
      .eq(0)
      .text();

    const secondJz = $('.table')
      .eq(1)
      .find('tbody tr')
      .eq(1)
      .find('td')
      .eq(1)
      .text();
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
    console.log(error);
    return null;
  }
}

// 从天天基金获取估值图片
export async function GetEstimatedFromEastmoney(code: string) {
  try {
    const { rawBody }: any = await got(
      `http://j4.dfcfw.com/charts/pic6/${code}.png`,
      {}
    );
    // const base64Str = rawBody.toString('base64');
    const b64encoded = btoa(String.fromCharCode.apply(null, rawBody));
    return `data:image/png;base64,${b64encoded}`;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// 从天天基金获取股票持仓
export async function GetStockWareHouseFromEastmoney(
  code: string,
  stockCodes: string[]
) {
  try {
    const { body: html } = await got(
      `http://fund.eastmoney.com/${code}.html`,
      {}
    );
    const $ = cheerio.load(html);
    const secids = (stockCodes || []).join(',') || '';
    const tors = $('#quotationItem_DataTable')
      .find('#position_shares')
      .find('tr > td:nth-child(2)')
      .text()
      .split('%');

    const {
      body: { data },
    } = await got('https://push2.eastmoney.com/api/qt/ulist.np/get', {
      searchParams: {
        fields: 'f2,f3,f12,f14',
        fltt: 2,
        secids,
      },
      responseType: 'json',
    });
    const diff: {
      f2: string; // 最新价
      f3: number; // 涨跌幅
      f14: string; // 名称
      f12: string; // 股票代码
    }[] = data.diff;

    const result: Fund.WareHouse[] = diff.map((item, index) => {
      return {
        zxz: item.f2,
        name: item.f14,
        code: item.f12,
        zdf: item.f3,
        ccb: tors[index], // 持仓比
      };
    });
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// 从天天基金获取债券持仓
export async function GetSecuritiesWareHouseFromEastmoney(
  code: string,
  securitiesCodes: string
) {
  try {
    const { body: html } = await got(
      `http://fund.eastmoney.com/${code}.html`,
      {}
    );
    const $ = cheerio.load(html);
    const secids = securitiesCodes || '';
    const tors = $('#quotationItem_DataTable')
      .find('#position_bonds')
      .find('tr > td:nth-child(2)')
      .text()
      .split('%');

    const {
      body: { data },
    } = await got('https://push2.eastmoney.com/api/qt/ulist.np/get', {
      searchParams: {
        fields: 'f2,f3,f12,f14',
        fltt: 2,
        secids,
      },
      responseType: 'json',
    });
    const diff: {
      f2: string; // 最新价
      f3: number; // 涨跌幅
      f14: string; // 名称
      f12: string; // 债券代码
    }[] = data.diff;
    const result: Fund.WareHouse[] = diff.map((item, index) => {
      return {
        zxz: item.f2,
        name: item.f14,
        code: item.f12,
        zdf: item.f3,
        ccb: tors[index], // 持仓比
      };
    });
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// 从天天基金获取基金详情
export async function GetFundDetailFromEastmoney(code: string) {
  try {
    const { body } = await got(
      `http://fund.eastmoney.com/pingzhongdata/${code}.js`,
      {}
    );
    const response: Fund.PingzhongData = Utils.parsepingzhongdata(body);
    return response;
  } catch (error) {
    console.log(error);
    return {};
  }
}

// 从天天基金获取近期表现
export async function GetFundPerformanceFromEastmoney(
  code: string,
  type: string //'m' | 'q' | 'hy' | 'y' | 'try' | 'se'
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
    console.log(error);
    return [];
  }
}

// 从天天基金获取所有基金信息
export async function GetRemoteFundsFromEastmoney() {
  try {
    const { body } = await got(
      'http://fund.eastmoney.com/js/fundcode_search.js',
      {}
    );
    return Utils.ParseRemoteFunds(body);
  } catch (error) {
    console.log(error);
    return [];
  }
}

// 从天天基金查询最新净值信息
export async function GetFixFromEastMoney(code: string) {
  try {
    const { body: html } = await got(`http://fund.eastmoney.com/${code}.html`);
    const $ = cheerio.load(html);
    const fixZzl = $('.fix_zzl').text();
    const fixDate = $('.fix_date').text();
    const fixDwjz = $('.fix_dwjz').text();
    const fixName = $('.fix_fname').text();

    const result: Fund.FixData = {
      code,
      fixDwjz,
      fixName,
      fixZzl: fixZzl?.replace(/[^0-9/./-]/g, ''),
      fixDate: fixDate?.replace(/[^0-9/-]/g, ''),
    };

    return result;
  } catch (error) {
    console.log(error);
    return {};
  }
}

// 从天天基金查询基金经理详情信息
export async function GetFundManagerDetailFromEastMoney(code: string) {
  try {
    const { body: html } = await got(
      `http://fund.eastmoney.com/manager/${code}.html`
    );
    const $ = cheerio.load(html);
    const description = $('meta[name="description"]').attr('content');
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
        const [code, name, _1, type, _2, date, days, rzhb] = $(tr)
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
    console.log(error);
    return {};
  }
}
