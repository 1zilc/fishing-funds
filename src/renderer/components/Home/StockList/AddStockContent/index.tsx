import React, { useState, useEffect } from 'react';
import { useDebounceFn, useRequest } from 'ahooks';
import { Input } from 'antd';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import StockSearch from '@/components/Toolbar/AppCenterContent/StockSearch';
import Empty from '@/components/Empty';
import * as Services from '@/services';
import * as Enums from '@/utils/enums';
import styles from './index.module.scss';

export interface AddStockContentProps {
  defaultName?: string;
  onEnter: () => void;
  onClose: () => void;
}

const { Search } = Input;

export const stockTypesConfig = [
  { name: 'AB股', code: Enums.StockMarketType.AB },
  // { name: '指数', code: Enums.StockMarketType.Zindex },
  // { name: '板块', code:  Enums.StockMarketType.Quotation },
  { name: '港股', code: Enums.StockMarketType.HK },
  { name: '美股', code: Enums.StockMarketType.US },
  { name: '英股', code: Enums.StockMarketType.UK },
  { name: '三板', code: Enums.StockMarketType.XSB },
  // { name: '基金', code:  Enums.StockMarketType.Fund },
  { name: '债券', code: Enums.StockMarketType.Bond },
];

const AddStockContent: React.FC<AddStockContentProps> = (props) => {
  const { defaultName } = props;
  const [groupList, setGroupList] = useState<Stock.SearchResult[]>([]);

  const { run: runSearch } = useRequest(Services.Stock.SearchFromEastmoney, {
    manual: true,
    onSuccess: (res) => setGroupList(res.filter(({ Type }) => stockTypesConfig.map(({ code }) => code).includes(Type))),
  });

  const { run: onSearch } = useDebounceFn((_value: string) => {
    const value = _value.trim();
    if (!value) {
      setGroupList([]);
    } else {
      runSearch(value);
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
          <Search defaultValue={defaultName} type="text" placeholder="股票代码或名称关键字" enterButton onSearch={onSearch} size="small" />
        </section>
      </div>
      {groupList.length ? <StockSearch groupList={groupList} /> : <Empty text="暂无相关数据~" />}
    </CustomDrawerContent>
  );
};

export default AddStockContent;
