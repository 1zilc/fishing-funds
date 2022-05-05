declare namespace System {
  export interface Setting {
    fundApiTypeSetting: import('@/utils/enums').FundApiType; // 基金源

    conciseSetting: boolean; // 简洁模式
    lowKeySetting: boolean; // 低调模式
    baseFontSizeSetting: number; // 全局基础字体大小
    systemThemeSetting: import('@/utils/enums').SystemThemeType; // 系统主题

    adjustmentNotificationSetting: boolean; // 调仓提醒
    adjustmentNotificationTimeSetting: string; // 调仓时间
    riskNotificationSetting: boolean; // 风险提醒
    trayContentSetting: import('@/utils/enums').TrayContent[]; // 托盘内容

    coinUnitSetting: import('@/utils/enums').CoinUnitType; // 货币单位

    autoStartSetting: boolean; // 自动启动
    autoFreshSetting: boolean; // 自动刷新
    freshDelaySetting: number; // 刷新时间间隔
    autoCheckUpdateSetting: boolean; // 自动检查更新
    timestampSetting: import('@/utils/enums').TimestampType; // 时间戳
  }
}
