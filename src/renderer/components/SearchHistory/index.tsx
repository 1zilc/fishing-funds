import { Flex, Tag } from 'antd';
import React, { useImperativeHandle } from 'react';
import { useLocalStorageState, useMemoizedFn } from 'ahooks';
import * as CONST from '@/constants';
import styles from './index.module.scss';

export interface SearchHistoryProps {
  onClickRecord?: (text: string) => void;
  storageKey: string;
}
export interface SearchHistoryRef {
  addSearchHistory: (trst: string) => void;
}

const SearchHistory = React.forwardRef<SearchHistoryRef, SearchHistoryProps>((props, ref) => {
  const [searchList, setSearchList] = useLocalStorageState<string[]>(`${CONST.STORAGE.SEARCH_HISTORY}:${props.storageKey}`, {
    defaultValue: [],
  });

  const addSearchHistory = useMemoizedFn((text: string) => {
    setSearchList((list) => {
      const newList = list!.filter((item) => item !== text);
      newList.unshift(text);
      return newList;
    });
  });

  const onDelete = useMemoizedFn((text: string) => {
    setSearchList((list) => list!.filter((item) => item !== text));
  });

  useImperativeHandle(ref, () => ({
    addSearchHistory,
  }));

  return (
    searchList!.length > 0 && (
      <div className={styles.content}>
        <Flex wrap gap="small">
          {searchList?.map((item) => (
            <Tag key={item} closeIcon onClose={() => onDelete(item)} onClick={() => props.onClickRecord?.(item)}>
              {item}
            </Tag>
          ))}
        </Flex>
      </div>
    )
  );
});

export default SearchHistory;
