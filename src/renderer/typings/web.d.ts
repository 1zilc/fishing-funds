declare namespace Web {
  export interface SettingItem {
    title: string;
    url: string;
    iconType: import('@/utils/enums').WebIconType;
    icon?: string;
    color?: string;
  }

  export interface CodeMap {
    [index: string]: Web.SettingItem;
  }
}
