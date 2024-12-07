import { Flex, Tag } from 'antd';
import React, { RefObject, useImperativeHandle } from 'react';
import { useLocalStorageState, useMemoizedFn } from 'ahooks';
import * as CONST from '@/constants';
import styles from './index.module.scss';

export type SearchHistoryProps = {
  ref: RefObject<SearchHistoryRef | null>;
  onClickRecord?: (text: string) => void;
  storageKey: string;
};
export type SearchHistoryRef = {
  addSearchHistory: (trst: string) => void;
};

const SearchHistory: React.FC<SearchHistoryProps> = ({ ref, ...props }) => {
  const [searchList, setSearchList] = useLocalStorageState<string[]>(`${CONST.STORAGE.SEARCH_HISTORY}:${props.storageKey}`, {
    defaultValue: [],
  });

  const addSearchHistory = useMemoizedFn((text: string) => {
    setSearchList((list) => {
      const newList = list!.filter((item) => item !== text);
      newList.unshift(text);
      return newList.slice(0, 15);
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
};

export default SearchHistory;
