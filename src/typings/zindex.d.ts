declare namespace Zindex {
  export interface SettingItem {
    code: string;
    name?: string;
    show?: boolean;
  }

  export interface ResponseItem {
    name: string; // 名称 '诺安混合'
    zindexCode: string; // 代码 '320007'
    type: number; // market
    zsz: number; // 指数值 3500.68
    zdd: number; // 涨跌点 -15.65
    zdf: number; // 涨跌幅 -0.44
    zg: number; // 最高
    zd: number; // 最低
    jk: number; // 今开
    zs: number; // 昨收
    hs: number; // 换手
    zf: number; // 振幅
  }

  export interface ExtraRow {
    collapse?: boolean;
  }
}
