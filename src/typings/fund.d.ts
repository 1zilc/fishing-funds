declare namespace Fund {
  export interface SettingItem {
    code: string;
    cyfe: number;
  }
  export interface ResponseItem {
    name: string; // 名称 '诺安混合'
    fundcode: string; // 代码 '320007'
    gztime: string; // 估值时间 '2021-01-01 15:00'
    gszzl: string; // 估算增长率 '-1.234'
    jzrq: string; // 净值日期 '2021-01-01'
    dwjz: string; // 当前净值 '1.1111'
    gsz: string; // 估算值 '1.2222'
  }
}
