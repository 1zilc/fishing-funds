declare namespace Wallet {
  export interface SettingItem {
    name: string;
    iconIndex: number;
    code: string;
    funds: Fund.SettingItem[];
  }
  export interface StateItem {
    funds: (Fund.ResponseItem & Fund.FixData)[];
    updateTime: string;
  }
  export interface OriginRow {
    originSort: number;
  }

  export interface SortRow {
    id: string;
  }
}
