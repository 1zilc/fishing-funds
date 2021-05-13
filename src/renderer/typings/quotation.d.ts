declare namespace Quotation {
  export interface SettingItem {}

  export interface ResponseItem {
    code: string; // 板块代码
    name: string; // 名称 '有色金属'
    zxj: number; // 最新价
    zde: number; // 涨跌额
    zdf: number; // 涨跌幅 -0.44
    zsz: number; // 总市值
    hs: number; // 换手
    szjs: number; // 上涨家数
    xdjs: number; // 下跌家数
    lzgpCode: string; // 领涨股票code
    lzgpName: string; // 领涨股票
    lzgpZdf: number; // 领涨股票涨跌幅
    ldgpCode: string; // 领跌股票code
    ldgpName: string; // 领跌股票
    ldgpZdf: number; // 领跌股票涨跌幅
  }

  export interface ExtraRow {
    collapse?: boolean;
  }

  export interface DetailData {
    name: string;
    code: string;
    szjs: number;
    xdjs: number;
    zdf: number;
    zdd: number;
    hsl: number;
    zxj: number;
  }
}
