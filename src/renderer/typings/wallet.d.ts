declare namespace Wallet {
  export interface SettingItem {
    name: string;
    iconIndex: number;
    code: string;
    funds: Fund.SettingItem[];
  }
  export interface StateItem {
    code: string;
    funds: (Fund.ResponseItem & Fund.FixData & Fund.ExtraRow)[];
    updateTime: string;
  }
  export interface OriginRow {
    originSort: number;
  }

  export interface SortRow {
    id: string;
  }
}
