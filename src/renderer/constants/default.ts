export default {
  FRESH_BUTTON_THROTTLE_DELAY: 1000 * 3, // 刷新按钮节流延迟
  LOAD_WALLET_DELAY: 1000 * 3, // 多个钱包间加载延迟
  LOAD_FUNDS_SLEEP_DELAY: 1000, // 请求基金的最低延迟
  LOAD_ZINDEXS_SLEEP_DELAY: 1000, // 请求指数的最低延迟
  LOAD_QUOTATION_SLEEP_DELAY: 1000, // 请求行情的最低延迟
  ECHARTS_SCALE: 0.65, // echarts 图表长宽比例
  ESTIMATE_FUND_DELAY: 1000 * 60 * 1, // 基金估值图片刷新时间
  SWR_STALE_DELAY: 1000 * 60 * 60 * 24, // swr过期时间
  NEWS_STALE_DELAY: 1000 * 10, // 新闻过期时间

  DRAWER_ZINDEX_DEFAULT: 1000, //普通抽屉
  DRAWER_ZINDEX_HEIGHT: 1001, // 高级抽屉，如全局抽屉webViewer
  DRAWER_ZINDEX_TOP: 1002, // 顶级抽屉，高级抽屉之上
};
