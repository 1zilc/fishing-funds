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

  export interface ExtraRow {
    collapse?: boolean;
  }

  export interface OriginRow {
    originSort?: number;
  }

  export interface PingzhongData {
    /*基金持仓股票代码(新市场号)*/
    stockCodesNew?: string[];
    /*基金持仓债券代码（新市场号）*/
    zqCodesNew?: string;
    /*单位净值走势 equityReturn-净值回报 unitMoney-每份派送金*/
    Data_netWorthTrend?: any[];
    /*累计收益率走势*/
    Data_grandTotal?: any[];
    /*同类排名走势*/
    Data_rateInSimilarType?: any[];
    /*近一年收益率*/
    syl_1n?: string;
    /*近6月收益率*/
    syl_6y?: string;
    /*近三月收益率*/
    syl_3y?: string;
    /*近一月收益率*/
    syl_1y?: string;
  }
}
