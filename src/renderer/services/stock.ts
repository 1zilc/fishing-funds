import got from 'got';

export async function SearchFromEastmoney(keyword: string) {
  try {
    const {
      body: { Data },
    } = await got<{ Data: Stock.SearchResultItem[] }>(
      'https://searchapi.eastmoney.com/bussiness/web/QuotationLabelSearch?cb=jQuery351007636061885471346_1625279445536&keyword=btc&type=0&pi=1&ps=30&token=32A8A21716361A5A387B0D85259A0037&_=1625279445537',
      {
        searchParams: {
          keyword,
          type: 0,
          ps: 1000,
          token: 1,
          _: new Date().getTime(),
        },
        responseType: 'json',
      }
    );
    return Data;
  } catch (error) {
    return [];
  }
}

export async function GetDetailFromEastmoney(secid: string) {
  try {
    const { body } = await got(
      '  http://push2.eastmoney.com/api/qt/stock/details/get',
      {
        searchParams: {
          secid,
          fields1: 'f1,f2,f3,f4',
          fields2: 'f51,f52,f53,f54,f55',
          _: new Date().getTime(),
        },
        responseType: 'json',
      }
    );
    return {};
  } catch (error) {
    return [];
  }
}
