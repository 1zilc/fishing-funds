export enum ToolBarDwawerType {
  None,
  AddFund,
  Setting,
}

export enum EyeStatus {
  Close,
  Open,
}

export enum FundApiType {
  Eastmoney, // 东方财富-天天基金
  Dayfund, // 基金速查网
  Tencent, // 腾讯证券
  Sina, // 新浪基金
  Howbuy, // 好买基金
  Etf, // 易天富
  Ant, // 支付宝-蚂蚁基金
  Fund10jqka, // 同花顺-爱基金
}

export enum FundSortType {
  Custom, // 默认
  Growth, // 涨幅
  Cost, // 成本
  Money, // 收益
  Estimate, // 估值
  Income, // 收益
  IncomeRate, // 收益率
  Name, // a-z
}

export enum ZindexSortType {
  Custom, // 自定义
  Zdd, // 涨跌点
  Zdf, // 涨跌幅
  Zsz, // 指数值
  Name, // a-z
}

export enum QuotationSortType {
  Zdf, // 涨跌幅
  Zde, // 涨跌额
  Zdd, // 涨跌点
  Zsz, // 总市值
  Zxj, // 最新价
  Szjs, // 上涨家数
  Xdjs, // 下跌家数
  Name, // a-z
}

export enum StockSortType {
  Custom, // 自定义
  Zdd, // 涨跌点
  Zdf, // 涨跌幅
  Zx, // 指数值
  Name, // a-z
}

export enum CoinSortType {
  Custom, // 自定义
  Zdf, // 24H涨跌幅
  Price, // 价值
  Volum, // 24H交易量
  Name, // a-z
}

export enum SortOrderType {
  Desc,
  Asc,
}

export enum TabKeyType {
  Funds,
  Zindex,
  Quotation,
  Stock,
  Coin,
}

// 持仓类型
export enum WareHouseType {
  Stock, // 股票
  IndustryLayout, // 行业持仓
  Securities, // 债券
  StockEstimate, // 股票仓位测算
}
// 配置类型
export enum ConfigType {
  Scale, // 规模变动呢
  Hold, // 持有人结构
  WareHouse, // 仓位
  Assets, // 资产配置
}
// 走势类型
export enum PerformanceType {
  Month,
  ThreeMonth,
  HalfYear,
  Year,
  ThreeYear,
  Max,
}

// 检索类型
export enum SearchType {
  Code,
  Name,
}

// 同类比较类型
export enum SimilarCompareType {
  Rank,
  Proportion,
  Evaluation,
}

// 历史类型
export enum HistoryType {
  Performance,
  Value,
  InvestStyle,
}

// 经理能力类型
export enum ManagerPowerType {
  Appraise,
  Profit,
}

export enum SystemThemeType {
  Auto,
  Light,
  Dark,
}
export enum FundFlowType {
  RealTime,
  AfterTime,
}

export enum ZindexType {
  SS,
  America,
  Asia,
  Europe,
  Australia,
  Other,
}

export enum FundRankType {
  Sy,
  Syl,
  Cysy,
  Cysyl,
}
export enum WalletIncomType {
  Jrsy,
  Jrsyl,
  Cysy,
  Cysyl,
}

export enum TrayContent {
  Sy,
  Syl,
  Zsy,
  Zsyl,
}
export enum StockMarketType {
  AB = 1,
  Zindex = 2,
  Quotation = 3,
  HK = 4,
  US = 5,
  UK = 6,
  XSB = 7,
  Fund = 8,
  Bond = 9,
}

export enum CoinUnitType {
  Usd = 'usd',
  Cny = 'cny',
  Btc = 'btc',
}

export enum TimestampType {
  Local,
  Network,
}

export enum QuotationType {
  All,
  Area,
  Industry,
  Concept,
}
