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
  export interface CodeMap {
    [index: string]: Wallet.SettingItem & Wallet.OriginRow;
  }
  export interface OriginRow {
    originSort: number;
  }

  export interface SortRow {
    id: string;
  }
}
