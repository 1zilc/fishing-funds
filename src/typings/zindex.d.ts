declare namespace Zindex {
  export interface SettingItem {
    code: string;
    name?: string;
  }

  export interface ResponseItem {
    name: string; // 名称 '诺安混合'
    zindexCode: string; // 代码 '320007'
    zsz: number; // 指数值 3500.68
    zdd: number; // 涨跌点 -15.65
    zdf: number; // 涨跌幅 -0.44
  }
}
