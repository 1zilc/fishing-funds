declare namespace Stock {
  export interface SettingItem {
    market: number;
    code: string;
    secid: string;
    name: string;
  }
  export interface DetailItem {
    code: string;
    name: string;
    market: number;
    zg: number; // 最高
    zd: number; // 最低
    jk: number; // 今开
    zss: number; // 总手数
    zt: number; // 涨停
    dt: number; // 跌停
    zx: number; // 最新
    cjl: number; // 成交量
    lb: number; // 量比
    cje: number; // 成交额
    wp: number; // 外盘
    zs: number; // 昨收
    jj: number; // 均价
    np: number; // 内盘
    hs: number; // 换手
    zdd: number; // 涨跌点
    zdf: number; /// 涨跌幅
  }

  export interface TrendItem {
    datetime: string;
    last: number;
    current: number;
    average: number;
  }

  export interface ResponseItem {
    secid: string;
    code: string;
    name: string;
    market: number;
    zx: number; // 最新
    zdd: number; // 涨跌点
    zdf: number; /// 涨跌幅
    zs: number; /// 昨收
    zg: number; // 最高
    zd: number; // 最低
    jk: number; // 今开
    trends: TrendItem[]; // 趋势
  }

  export interface SearchResut {
    Type: number; // 7,
    Name: string; // "三板",
    Count: number; // 3;
    Datas: SearchItem[];
  }

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
  export interface ExtraRow {
    collapse?: boolean;
  }
}
