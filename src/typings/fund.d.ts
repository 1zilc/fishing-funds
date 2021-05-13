declare namespace Fund {
  export interface SettingItem {
    name: string;
    code: string;
    cyfe: number;
  }
  export interface ResponseItem {
    name?: string; // 名称 '诺安混合'
    fundcode?: string; // 代码 '320007'
    gztime?: string; // 估值时间 '2021-01-01 15:00'
    gszzl?: string; // 估算增长率 '-1.234'
    jzrq?: string; // 净值日期 '2021-01-01'
    dwjz?: string; // 当前净值 '1.1111'
    gsz?: string; // 估算值 '1.2222'
  }

  export interface FixData {
    code?: string;
    fixName?: string;
    fixZzl?: string;
    fixDate?: string;
    fixDwjz?: string;
  }

  export interface ExtraRow {
    collapse?: boolean;
  }
  export interface OriginRow {
    originSort: number;
  }

  export interface SortRow {
    id: string;
  }
  export interface PingzhongData {
    /*基金持仓股票代码(新市场号)*/
    stockCodesNew?: string[];
    /*基金持仓债券代码（新市场号）*/
    zqCodesNew?: string;
    /*股票仓位测算图*/
    Data_fundSharesPositions?: [number, number][];
    /*单位净值走势 equityReturn-净值回报 unitMoney-每份派送金*/
    Data_netWorthTrend?: any[];
    /*累计收益率走势*/
    Data_grandTotal?: any[];
    /*同类排名走势*/
    Data_rateInSimilarType?: any[];
    /*同类排名百分比*/
    Data_rateInSimilarPersent?: any[];
    /*同类型基金涨幅榜*/
    swithSameType?: string[][];
    /*现任基金经理*/
    Data_currentFundManager: Fund.Manager.Info[];
    /*规模变动 mom-较上期环比*/
    Data_fluctuationScale: {
      categories: string[];
      series: { y: number; mom: string }[];
    };
    /*持有人结构*/
    Data_holderStructure: {
      categories: string[];
      series: { name: string; data: string[] }[];
    };
    /*资产配置*/
    Data_assetAllocation: {
      categories: string[];
      series: {
        name: string;
        type: string;
        data: number[];
        yAxis: number;
      }[];
    };
    /*业绩评价 */
    Data_performanceEvaluation: {
      categories: string[];
      dsc: string[];
      data: number[];
    };
    /*近一年收益率*/
    syl_1n?: string;
    /*近6月收益率*/
    syl_6y?: string;
    /*近三月收益率*/
    syl_3y?: string;
    /*近一月收益率*/
    syl_1y?: string;
  }

  export interface WareHouse {
    zxz: string;
    name: string;
    code: string;
    zdf: number;
    ccb: string;
  }

  // "000001","HXCZHH","华夏成长混合","混合型","HUAXIACHENGZHANGHUNHE"
  export interface RemoteFund extends Array<string> {
    0: string; // code
    1: string; // pinyin
    2: string; // name
    3: string; // type
    4: string; // quanpin
  }

  export namespace Manager {
    export interface Info {
      id: '30655271';
      pic: 'https://pdf.dfcfw.com/pdf/H8_PNG30655271_1.jpg';
      name: '蔡嵩松';
      star: 1;
      workTime: '2年又13天';
      fundSize: '409.92亿(2只基金)';
      power: Fund.Manager.Power;
      profit: Fund.Manager.Profit;
    }
    export interface Power {
      avr: string;
      categories: string[];
      dsc: string[];
      data: number[];
      jzrq: string;
    }
    export interface Profit {
      categories: ['任期收益', '同类平均', '沪深300'];
      series: [
        {
          data: [
            {
              name: null;
              color: '#7cb5ec';
              y: 149.5132;
            },
            {
              name: null;
              color: '#414c7b';
              y: 82.88;
            },
            {
              name: null;
              color: '#f7a35c';
              y: 57.95;
            }
          ];
        }
      ];
      jzrq: '2021-03-02';
    }
    export interface ManageHistoryFund {
      code: string; // 基金代码
      name: string; // 基金名称
      type: string; // 基金类型
      date: string; // 任职时期
      days: string; // 担任天数
      rzhb: string; // 任职回报率
    }
  }
}
