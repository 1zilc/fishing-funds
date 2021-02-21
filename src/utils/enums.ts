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
  Eastmoney, // 天天基金
  Dayfund, // 基金速查网
  Tencent, // 腾讯证券
  Sina, // 新浪基金
  Howbuy, // 好买基金
}

export enum FundSortType {
  Default, // 默认
  Growth, // 涨幅
  Block, // 份额
  Money, // 收益
  Estimate, // 估值
}
export enum ZindexSortType {
  Custom, // 自定义
  Zdd, // 涨跌点
  Zdf, // 涨跌幅
  Zsz, // 指数值
}
export enum SortOrderType {
  Desc,
  Asc,
}
export enum TabKeyType {
  Funds,
  Zindex,
}
// 走势类型
export enum TrendType {
  Performance, // 业绩走势
  Estimate, // 估值走势
}
// 持仓类型
export enum WareHouseType {
  Stock, // 股票
  Securities, // 证券
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
