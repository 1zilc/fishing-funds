import React, { useState, useEffect } from 'react';
import { useDebounceFn, useRequest } from 'ahooks';
import clsx from 'clsx';
import StockSearch from '@/components/Toolbar/AppCenterContent/StockSearch';
import ZindexSearch from '@/components/Toolbar/AppCenterContent/ZindexSearch';
import * as Services from '@/services';
import styles from './index.module.scss';

interface SearchGroupProps {
  keyword: string;
}

const SearchGroup: React.FC<SearchGroupProps> = (props) => {
  const { keyword } = props;
  const [groupList, setGroupList] = useState<Stock.SearchResult[]>([]);
  const { run: runSearch } = useRequest(Services.Stock.SearchFromEastmoney, {
    manual: true,
    ready: !!keyword,
    onSuccess: setGroupList,
  });

  const { run: onSearch } = useDebounceFn(runSearch);

  useEffect(() => {
    const value = keyword.trim();
    if (!value) {
      setGroupList([]);
    } else {
      onSearch(keyword);
    }
  }, [keyword]);

  return (
    <div className={clsx(styles.content)}>
      <StockSearch groupList={groupList} />
      <ZindexSearch groupList={groupList} />
    </div>
  );
};

export default SearchGroup;
