import NP from 'number-precision';
import dayjs from 'dayjs';
import * as Utils from '@/utils';

const { got } = window.contextModules;

export async function FromCoinCap(keyword: string, codes = '') {
  try {
    const {
      body: { data, timestamp },
    } = await got<{
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
    console.log(error);
    return [];
  }
}

export async function GetFromCoinCap(code: string) {
  try {
    const {
      body: { data },
    } = await got<{
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
      supply: NP.divide(Number(data.supply), 10 ** 4).toFixed(2),
      maxSupply: data.maxSupply && NP.divide(Number(data.maxSupply), 10 ** 4).toFixed(2),
      marketCapUsd: NP.divide(Number(data.marketCapUsd), 10 ** 8).toFixed(2),
      volumeUsd24Hr: NP.divide(Number(data.volumeUsd24Hr), 10 ** 8).toFixed(2),
      priceUsd: Number(data.priceUsd).toFixed(2),
      vwap24Hr: Number(data.vwap24Hr).toFixed(2),
      changePercent24Hr: Number(data.changePercent24Hr).toFixed(2),
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function GetHistoryFromCoinCap(code: string, interval: string) {
  // interval m1, m5, m15, m30, h1, h2, h6, h12, d1
  try {
    const {
      body: { data },
    } = await got<{
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
    console.log(error);
    return [];
  }
}
