declare namespace System {
  export interface Setting {
    fundApiTypeSetting: number; // 基金源

    conciseSetting: boolean; // 简洁模式
    lowKeySetting: boolean; // 低调模式
    baseFontSizeSetting: number; // 全局基础字体大小
    systemThemeSetting: number; // 系统主题 "dark" | "light" | "auto"

    autoStartSetting: boolean; // 自动启动
    adjustmentNotificationSetting: boolean; // 调仓提醒
    autoFreshSetting: boolean; // 自动刷新
    freshDelaySetting: number; // 刷新时间间隔
    autoCheckUpdateSetting: boolean; // 自动检查更新
  }
}
