declare namespace Stock {
  export interface SearchItem {
    Code: string; // '839489';
    Name: string; // '同步天成';
    ID: string; // '839489_TB';
    MktNum: string; // '0';
    SecurityType: string; // '10';
    MarketType: string; // '_TB';
    JYS: string; // '81';
    GubaCode: string; // '839489';
    UnifiedCode: string; // '839489';
  }

  export interface SearchResultItem {
    Type: number; // 7,
    Name: string; // "三板",
    Count: number; // 3;
    Datas: SearchResultItem[];
  }
}
