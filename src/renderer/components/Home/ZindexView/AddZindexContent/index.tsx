import React, { useState, useEffect, useRef } from 'react';
import { useDebounceFn, useRequest } from 'ahooks';
import { Input } from 'antd';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import Empty from '@/components/Empty';
import ZindexSearch, { zindexTypesConfig } from '@/components/Toolbar/AppCenterContent/ZindexSearch';
import SearchHistory, { type SearchHistoryRef } from '@/components/SearchHistory';
import * as Services from '@/services';
import styles from './index.module.scss';

export interface AddZindexContentProps {
  defaultName?: string;
  onEnter: () => void;
  onClose: () => void;
}

const { Search } = Input;

const AddZindexContent: React.FC<AddZindexContentProps> = (props) => {
  const { defaultName } = props;
  const [keyword, setKeyword] = useState(defaultName);
  const [groupList, setGroupList] = useState<Stock.SearchResult[]>([]);
  const searchHistoryRef = useRef<SearchHistoryRef>(null);

  const { run: runSearch, loading: loadingSearchFromEastmoney } = useRequest(Services.Stock.SearchFromEastmoney, {
    manual: true,
    onSuccess: (res) => setGroupList(res.filter(({ Type }) => zindexTypesConfig.map(({ code }) => code).includes(Type))),
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
    <CustomDrawerContent title="添加指数" enterText="确定" onEnter={props.onEnter} onClose={props.onClose}>
      <div className={styles.content}>
        <section>
          <label>关键字：</label>
          <Search
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            defaultValue={defaultName}
            type="text"
            placeholder="指数代码或名称关键字"
            enterButton
            onSearch={onSearch}
            size="small"
            loading={loadingSearchFromEastmoney}
          />
          <SearchHistory
            storageKey="indexSearchHistory"
            ref={searchHistoryRef}
            onClickRecord={(record) => {
              setKeyword(record);
              runSearch(record);
            }}
          />
        </section>
        {groupList.length ? <ZindexSearch groupList={groupList} /> : <Empty text="暂无相关数据~" />}
      </div>
    </CustomDrawerContent>
  );
};

export default AddZindexContent;
