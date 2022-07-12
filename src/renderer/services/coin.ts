import NP from 'number-precision';
import dayjs from 'dayjs';
import request from '@/utils/request';
import * as Utils from '@/utils';

// CoinCap
export async function FromCoinCap(keyword: string, codes = '') {
  try {
    const {
      body: { data, timestamp },
    } = await request<{
      data: [
        {
          id: 'tokenclub';
          rank: '436';
          symbol: 'TCT';
          name: 'TokenClub';
          supply: '817902279.4440348000000000';
          maxSupply: string | null;
          marketCapUsd: '25215840.3014434523346795';
          volumeUsd24Hr: '4750006.2506309048486091';
          priceUsd: '0.0308298936623380';
          changePercent24Hr: '-1.5098207890204188';
          vwap24Hr: '0.0303235253576153';
          explorer: 'https://etherscan.io/token/0x4824a7b64e3966b0133f4f4ffb1b9d6beb75fff7';
        }
      ];
      timestamp: 1628823350268;
    }>('https://api.coincap.io/v2/assets', {
      searchParams: {
        search: keyword,
        ids: codes,
        limit: 200,
        offset: 0,
      },
      headers: {
        'Accept-Encoding': 'gzip',
      },
      responseType: 'json',
    });

    return data.map((item) => ({
      ...item,
      code: item.id,
      supply: NP.divide(Number(item.supply), 10 ** 4).toFixed(2),
      maxSupply: item.maxSupply && NP.divide(Number(item.maxSupply), 10 ** 4).toFixed(2),
      marketCapUsd: NP.divide(Number(item.marketCapUsd), 10 ** 8).toFixed(2),
      volumeUsd24Hr: NP.divide(Number(item.volumeUsd24Hr), 10 ** 8).toFixed(2),
      priceUsd: Number(item.priceUsd).toFixed(2),
      vwap24Hr: Number(item.vwap24Hr).toFixed(2),
      changePercent24Hr: Number(item.changePercent24Hr).toFixed(2),
      updateTime: dayjs(timestamp).format('MM-DD HH:mm'),
    }));
  } catch (error) {
    return [];
  }
}

export async function GetFromCoinCap(code: string) {
  try {
    const {
      body: { data },
    } = await request<{
      data: {
        id: 'bitcoin';
        rank: '1';
        symbol: 'BTC';
        name: 'Bitcoin';
        supply: '18784368.0000000000000000';
        maxSupply: '21000000.0000000000000000';
        marketCapUsd: '851027620943.5670999354882832';
        volumeUsd24Hr: '20625637682.6219292545352639';
        priceUsd: '45305.0973524138315399';
        changePercent24Hr: '-2.2722114060520030';
        vwap24Hr: '44881.8715490864544111';
        explorer: 'https://blockchain.info/';
      };
      timestamp: 1628823545124;
    }>(`https://api.coincap.io/v2/assets/${code}`, {
      headers: {
        'Accept-Encoding': 'gzip',
      },
      responseType: 'json',
    });
    return {
      ...data,
      code: data.id,
      supply: NP.divide(data.supply, 10 ** 4).toFixed(2),
      maxSupply: data.maxSupply && NP.divide(data.maxSupply, 10 ** 4).toFixed(2),
      marketCapUsd: NP.divide(data.marketCapUsd, 10 ** 8).toFixed(2),
      volumeUsd24Hr: NP.divide(data.volumeUsd24Hr, 10 ** 8).toFixed(2),
      priceUsd: Number(data.priceUsd).toFixed(2),
      vwap24Hr: Number(data.vwap24Hr).toFixed(2),
      changePercent24Hr: Number(data.changePercent24Hr).toFixed(2),
    };
  } catch (error) {
    return null;
  }
}

export async function GetHistoryFromCoinCap(code: string, interval: string) {
  // interval m1, m5, m15, m30, h1, h2, h6, h12, d1
  try {
    const {
      body: { data },
    } = await request<{
      data: {
        priceUsd: '10250.7246875711059188';
        time: 1565913600000;
        date: '2019-08-16T00:00:00.000Z';
      }[];
      timestamp: 1628823545124;
    }>(`https://api.coincap.io/v2/assets/${code}/history`, {
      searchParams: { interval },
      headers: {
        'Accept-Encoding': 'gzip',
      },
      responseType: 'json',
    });
    return data.map((item) => ({
      time: item.time,
      priceUsd: Number(item.priceUsd).toFixed(2),
    }));
  } catch (error) {
    return [];
  }
}

// Coingecko
export async function FromCoingecko(codes: string, currency: string) {
  try {
    const { body } = await request<
      Record<
        string,
        {
          btc: 1.0;
          btc_market_cap: 18788387.0;
          btc_24h_vol: 736517.4638024335;
          btc_24h_change: 0.0;
          usd: 46310;
          usd_market_cap: 866740147397.4691;
          usd_24h_vol: 34086961197.17789;
          usd_24h_change: -2.9264155483511267;
          cny: 299962;
          cny_market_cap: 5611795758339.655;
          cny_24h_vol: 220788065066.3608;
          cny_24h_change: -2.9339084535836757;
          last_updated_at: 1629166496;
        } & Record<string, any>
      >
    >(`https://api.coingecko.com/api/v3/simple/price`, {
      searchParams: {
        ids: codes,
        vs_currencies: 'btc,usd,cny',
        include_market_cap: true,
        include_24hr_vol: true,
        include_24hr_change: true,
        include_last_updated_at: true,
      },
      responseType: 'json',
    });
    return Object.entries(body).map(([code, data]) => ({
      code,
      ...data,
      price: data[`${currency}`],
      marketCap: Utils.UnitTransform(data[`${currency}_market_cap`]),
      vol24h: Utils.UnitTransform(data[`${currency}_24h_vol`]),
      change24h: data[`${currency}_24h_change`].toFixed(2),
      updateTime: dayjs.unix(data.last_updated_at).format('MM-DD HH:mm'),
    }));
  } catch (error) {
    return [];
  }
}

export async function GetDetailFromCoingecko(code: string) {
  try {
    const { body } = await request<Coin.DetailItem>(`https://api.coingecko.com/api/v3/coins/${code}`, {
      searchParams: {
        localization: false,
        tickers: false,
        market_data: false,
        community_data: false,
        developer_data: false,
        sparkline: false,
      },
      responseType: 'json',
    });
    return body;
  } catch (error) {
    return;
  }
}

export async function GetRemoteCoinsFromCoingecko() {
  try {
    const { body } = await request<
      {
        id: string;
        symbol: string;
        name: string;
      }[]
    >('https://api.coingecko.com/api/v3/coins/list', {
      responseType: 'json',
    });
    return body.map((coin) => ({
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      code: coin.id,
    }));
  } catch (error) {
    return [];
  }
}

export async function GetKFromCoingecko(code: string, currency: string, days: number) {
  try {
    const { body } = await request<[1597795200000, 85083.78, 85083.78, 82712.82, 82712.82][]>(
      `https://api.coingecko.com/api/v3/coins/${code}/ohlc`,
      {
        searchParams: {
          days,
          vs_currency: currency,
        },
        responseType: 'json',
      }
    );
    return body.map(([time, o, h, l, c]) => ({
      time: dayjs(time).format('YYYY-MM-DD HH:mm'),
      kp: o,
      sp: c,
      zd: l,
      zg: h,
    }));
  } catch (error) {
    return [];
  }
}

export async function GetHistoryFromCoingecko(code: string, currency: string, days: number) {
  try {
    const { body } = await request<{
      prices: [1629106772337, 47108.05433394351][];
      market_caps: [1629106772337, 47108.05433394351][];
      total_volumes: [1629106772337, 47108.05433394351][];
    }>(`https://api.coingecko.com/api/v3/coins/${code}/market_chart`, {
      searchParams: { vs_currency: currency, days },
      headers: {
        'Accept-Encoding': 'gzip',
      },
      responseType: 'json',
    });
    return {
      prices: body.prices.map(([time, value]) => ({
        time,
        price: value.toFixed(2),
      })),
      vol24h: body.total_volumes.map(([time, value]) => ({
        time,
        price: NP.divide(value, 10 ** 8).toFixed(2),
      })),
    };
  } catch (error) {
    return { prices: [], vol24h: [] };
  }
}
