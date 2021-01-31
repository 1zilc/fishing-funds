/* eslint-disable no-eval */
import got from 'got';
import NP from 'number-precision';
import cheerio from 'cheerio';
import * as Utils from '../utils';

const delayTime = 1000;

// 天天基金
export const FromEastmoney: (
  code: string
) => Promise<Fund.ResponseItem | null> = async code => {
  try {
    const { body } = await got(`http://fundgz.1234567.com.cn/js/${code}.js`);
    await Utils.Sleep(delayTime);
    return body.startsWith('jsonpgz') ? eval(body) : null;
  } catch (error) {
    return null;
  }
};

// 基金速查网
export const FromDayFund: (
  code: string
) => Promise<Fund.ResponseItem | null> = async code => {
  try {
    const { body } = await got('https://www.dayfund.cn/ajs/ajaxdata.shtml', {
      searchParams: {
        showtype: 'getfundvalue',
        fundcode: code
      }
    });
    if (body === '||||%|%|||||') {
      return null;
    }
    const { body: html } = await got(
      `https://www.dayfund.cn/fundinfo/${code}.html`
    );
    const $ = cheerio.load(html);
    const [name] = $('meta[name=keywords]')
      .attr('content')
      ?.split(',') || [''];
    const [
      jzrq,
      dwjz,
      ljjz,
      sjbjz,
      sjzzl,
      gsbjl,
      gsbjz,
      gszzl,
      gsz,
      gzrq,
      gztime
    ] = body.split('|');
    // 2021-01-29|1.8040|2.2490|-0.0440|-2.3800%|-1.8652%|-0.0345|1.8135|1.8480|2021-01-29|15:35:00
    const gzDate = gzrq.slice(5);
    await Utils.Sleep(delayTime);
    return {
      name,
      fundcode: code,
      gztime: `${gzDate} ${gztime}`,
      gszzl: gsbjl.replace(/%/g, ''),
      jzrq,
      dwjz,
      gsz
    };
  } catch (error) {
    return null;
  }
};

// 腾讯证券
export const FromTencent: (
  code: string
) => Promise<Fund.ResponseItem | null> = async code => {
  try {
    const {
      body: { data }
    } = await got('https://web.ifzq.gtimg.cn/fund/newfund/fundSsgz/getSsgz', {
      searchParams: {
        app: 'web',
        symbol: `jj${code}`
      },
      responseType: 'json'
    });
    const { yesterdayDwjz, code: status, data: list } = data;
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
    const gzDate = jzrq.slice(5);
    const gzTime = `${time.slice(0, 2)}:${time.slice(2)}`;
    const gszzl = NP.times(NP.divide(NP.minus(gsz, dwjz), dwjz), 100).toFixed(
      2
    );
    return {
      name,
      dwjz,
      fundcode: code,
      gztime: `${gzDate} ${gzTime}`,
      jzrq,
      gsz,
      gszzl
    };
  } catch (error) {
    return null;
  }
};
