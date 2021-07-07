import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDebounceFn, useRequest } from 'ahooks';
import { Input, Tabs } from 'antd';

import DetailStockContent from '@/components/Home/StockList/DetailStockContent';
import CustomDrawer from '@/components/CustomDrawer';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import Empty from '@/components/Empty';
import { addStock, getStock, getStockConfig } from '@/actions/stock';
import { StoreState } from '@/reducers/types';
import { useDrawer } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as Services from '@/services';
import styles from './index.scss';

export interface AddStockContentProps {
  defaultSecid?: string;
  onEnter: () => void;
  onClose: () => void;
}

const { Search } = Input;

const AddStockContent: React.FC<AddStockContentProps> = (props) => {
  const { defaultSecid } = props;
  const { codeMap } = getStockConfig();
  const [none, setNone] = useState<boolean>(false);
  const [groupList, setGroupList] = useState<Stock.SearchResut[]>([]);

  const { run: runSearch } = useRequest(Services.Stock.SearchFromEastmoney, {
    manual: true,
    throwOnError: true,
    onSuccess: setGroupList,
  });

  const {
    data: detailSecid,
    show: showDetailDrawer,
    set: setDetailDrawer,
    close: closeDetailDrawer,
  } = useDrawer('');

  async function onAdd(secid: string) {
    const stock = await getStock(secid);
    if (stock) {
      setNone(false);
      addStock({
        market: stock.market!,
        code: stock.code!,
        secid: stock.secid,
        name: stock.name!,
      });
      props.onEnter();
    } else {
      setNone(true);
    }
  }

  const { run: onSearch } = useDebounceFn((_value: string) => {
    const value = _value.trim();
    if (!value) {
      setGroupList([]);
      return;
    }
    runSearch(value);
  });

  useEffect(() => {
    if (defaultSecid) {
      runSearch(defaultSecid);
    }
  }, [defaultSecid]);

  return (
    <CustomDrawerContent
      title="添加股票"
      enterText="确定"
      onEnter={props.onEnter}
      onClose={props.onClose}
    >
      <div className={styles.content}>
        <section>
          <label>关键字：</label>
          <Search
            type="text"
            placeholder="股票代码或名称关键字"
            enterButton
            onSearch={onSearch}
            size="small"
          />
        </section>
        {none && (
          <section>
            <span className={styles.none}>添加股票失败，未找到或数据出错~</span>
          </section>
        )}
      </div>
      {groupList.length ? (
        <Tabs
          animated={{ tabPane: true }}
          tabBarGutter={15}
          tabBarStyle={{ marginLeft: 15 }}
        >
          {groupList.map(({ Datas, Name, Type }) => (
            <Tabs.TabPane tab={Name} key={String(Type)}>
              {Datas.map(({ Name, Code, MktNum }) => {
                const secid = `${MktNum}.${Code}`;
                return (
                  <div
                    key={secid}
                    className={styles.stock}
                    onClick={() => setDetailDrawer(secid)}
                  >
                    <div>
                      <div className={styles.name}>
                        <span className={styles.nameText}>{Name}</span>
                      </div>
                      <div className={styles.code}>{Code}</div>
                    </div>
                    {codeMap[secid] ? (
                      <button className={styles.added} disabled>
                        已添加
                      </button>
                    ) : (
                      <button
                        className={styles.select}
                        onClick={(e) => {
                          onAdd(secid);
                          e.stopPropagation();
                        }}
                      >
                        自选
                      </button>
                    )}
                  </div>
                );
              })}
            </Tabs.TabPane>
          ))}
        </Tabs>
      ) : (
        <Empty text="暂无相关数据~" />
      )}
      <CustomDrawer show={showDetailDrawer}>
        <DetailStockContent
          onEnter={closeDetailDrawer}
          onClose={closeDetailDrawer}
          secid={detailSecid}
        />
      </CustomDrawer>
    </CustomDrawerContent>
  );
};

export default AddStockContent;
