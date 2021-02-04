declare namespace Option {
  export interface DefaultOption {
    key: string | number;
    value: string;
  }
  export interface EnumsOption<T> {
    key: T;
    value: string;
  }
}
