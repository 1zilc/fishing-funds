declare namespace Wallet {
  export interface SettingItem {
    name: string;
    iconIndex: number;
    code: string;
    funds: Fund.SettingItem[];
  }
  export interface StateItem {
    total: number;
    estimate: number;
    updateTime: string;
  }
  export interface OriginRow {
    originSort: number;
  }

  export interface SortRow {
    id: string;
  }
}
