import * as Utils from '@/utils';

export function Add<T extends {}>(config: { key: keyof T; list: T[]; data: T }) {
  const { list, key, data } = config;

  const exist = list.find((item) => data[key] === item[key]);
  if (!exist) {
    list.push(data);
  }

  return list;
}

export function Get<T extends {}>(config: { key: keyof T; list: T[]; data: string }) {
  const { list, key, data } = config;

  return list.find((item) => data === item[key]);
}

export function Update<T extends {}>(config: { key: keyof T; list: T[]; data: T }) {
  const { list, key, data } = config;

  list.forEach((item) => {
    if (data[key] === item[key]) {
      Object.keys(data).forEach((k) => {
        (item[k as keyof T] as any) = data[k as keyof T];
      });
    }
  });

  return list as Required<T>[];
}

export function Merge<T extends {}>(config: { data: T; overide: Partial<T> }) {
  const { overide, data } = config;

  Object.keys(overide).forEach((k) => {
    (data[k as keyof T] as any) = overide[k as keyof T];
  });

  return data;
}

export function Delete<T extends {}>(config: { key: keyof T; list: T[]; data: string }) {
  const { list, key, data } = config;

  const index = list.findIndex((item) => data === item[key]);

  if (index > -1) {
    list.splice(index, 1);
  }

  return list;
}

export function Collapse<T extends { collapse?: boolean }>(config: { key: keyof T; list: T[]; data: T }) {
  const { list, key, data } = config;

  list.forEach((item) => {
    if (item[key] === data[key]) {
      item.collapse = !data.collapse;
    }
  });

  return list;
}

export function CollapseAll<T extends { collapse?: boolean }>(config: { list: T[] }) {
  const { list } = config;

  const expandAll = list.every((item) => item.collapse);

  list.forEach((item) => {
    item.collapse = !expandAll;
  });

  return list;
}

export function Replace<T>(config: { key: keyof T; list: T[]; data: string; cover: T }) {
  const { list, key, data, cover } = config;

  list.forEach((item, index) => {
    if (item[key] === data) {
      list[index] = cover;
    }
  });

  return list;
}

export function Deduplication<T extends {}>(config: { key: keyof T; list: T[] }) {
  const { list, key } = config;

  const codeMap = Utils.GetCodeMap(list, key);
  // 去重复
  return Object.entries(codeMap).map(([code, item]) => item);
}
