import got from 'got';

/**
 *
 * @param code 指数代码: 000001
 * 从天天基金获取板块行情
 */
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
        fields: 'f2,f3,f4,f8,f14,f20,f128,f136,f104,f105,f140,f207,f208,f222',
        _: new Date().getTime(),
      },
      responseType: 'json',
      retry: 0,
    });
    const result: Quotation.ResponseItem[] = data.data.diff.map((i) => ({
      name: i.f14,
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
