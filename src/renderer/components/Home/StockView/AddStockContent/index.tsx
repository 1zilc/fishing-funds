import React, { useState, useEffect, useRef } from 'react';
import { useDebounceFn, useRequest } from 'ahooks';
import { Input } from 'antd';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import Empty from '@/components/Empty';
import StockSearch, { stockTypesConfig } from '@/components/Toolbar/AppCenterContent/StockSearch';
import SearchHistory, { type SearchHistoryRef } from '@/components/SearchHistory';
import * as Services from '@/services';

import styles from './index.module.css';

export interface AddStockContentProps {
  defaultName?: string;
  onEnter: () => void;
  onClose: () => void;
}

const { Search } = Input;

const AddStockContent: React.FC<AddStockContentProps> = (props) => {
  const { defaultName } = props;
  const [keyword, setKeyword] = useState(defaultName);
  const [groupList, setGroupList] = useState<Stock.SearchResult[]>([]);
  const searchHistoryRef = useRef<SearchHistoryRef>(null);

  const { run: runSearch, loading: loadingSearchFromEastmoney } = useRequest(Services.Stock.SearchFromEastmoney, {
    manual: true,
    onSuccess: (res) => setGroupList(res.filter(({ Type }) => stockTypesConfig.map(({ code }) => code).includes(Type))),
  });

  const { run: onSearch } = useDebounceFn((_value: string) => {
    const value = _value.trim();
    if (!value) {
      setGroupList([]);
    } else {
      runSearch(value);
      searchHistoryRef.current?.addSearchHistory(value);
    }
  });

  useEffect(() => {
    if (defaultName) {
      runSearch(defaultName);
    }
  }, [defaultName]);

  return (
    <CustomDrawerContent title="添加股票" enterText="确定" onEnter={props.onEnter} onClose={props.onClose}>
      <div className={styles.content}>
        <section>
          <label>关键字：</label>
          <Search
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            defaultValue={defaultName}
            type="text"
            placeholder="股票代码或名称关键字"
            enterButton
            onSearch={onSearch}
            size="small"
            loading={loadingSearchFromEastmoney}
          />
          <SearchHistory
            storageKey="stockSearchHistory"
            ref={searchHistoryRef}
            onClickRecord={(record) => {
              setKeyword(record);
              runSearch(record);
            }}
          />
        </section>
        {groupList.length ? <StockSearch groupList={groupList} /> : <Empty text="暂无相关数据~" />}
      </div>
    </CustomDrawerContent>
  );
};

export default AddStockContent;
