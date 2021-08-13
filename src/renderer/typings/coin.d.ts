declare namespace Coin {
  export interface SettingItem {
    code: string;
    name: string;
    symbol: string;
  }

  export interface ResponseItem {
    code: string;
    rank: string;
    symbol: string;
    name: string;
    supply: string;
    maxSupply: string;
    marketCapUsd: string;
    volumeUsd24Hr: string;
    priceUsd: string;
    changePercent24Hr: string;
    vwap24Hr: string;
  }

  export interface ExtraRow {
    collapse?: boolean;
  }
}
