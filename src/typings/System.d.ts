declare namespace System {
  export interface Setting {
    conciseSetting: boolean; // 简洁模式
    lowKeySetting: boolean; // 低调模式
    autoStartSetting: boolean; // 自动启动
    autoFreshSetting: boolean; // 自动刷新
    freshDelaySetting: number; // 刷新时间间隔
    autoCheckUpdateSetting: boolean; // 自动检查更新
  }
}
