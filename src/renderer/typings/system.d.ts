declare namespace System {
  export interface Setting {
    fundApiTypeSetting: number; // 基金源

    conciseSetting: boolean; // 简洁模式
    lowKeySetting: boolean; // 低调模式
    baseFontSizeSetting: number; // 全局基础字体大小
    systemThemeSetting: number; // 系统主题 "dark" | "light" | "auto"

    adjustmentNotificationSetting: boolean; // 调仓提醒
    adjustmentNotificationTimeSetting: string; // 调仓时间
    riskNotificationSetting: boolean; // 风险提醒
    trayContentSetting: number[]; // 托盘内容

    coinUnitSetting: string; // 货币单位

    httpProxySetting: boolean; // http代理
    httpProxyWhitelistSetting: boolean; // http白名单模式
    httpProxyAddressSetting: string; // http 代理地址
    httpProxyRuleSetting: string; // http 代理规则

    autoStartSetting: boolean; // 自动启动
    autoFreshSetting: boolean; // 自动刷新
    freshDelaySetting: number; // 刷新时间间隔
    autoCheckUpdateSetting: boolean; // 自动检查更新
    timestampSetting: number; // 时间戳
  }
}
