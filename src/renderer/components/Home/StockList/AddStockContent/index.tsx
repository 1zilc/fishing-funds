import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDebounceFn, useRequest } from 'ahooks';
import { Input, Tabs } from 'antd';

import DetailStockContent from '@/components/Home/StockList/DetailStockContent';
import CustomDrawer from '@/components/CustomDrawer';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import Empty from '@/components/Empty';
import { addStockAction } from '@/actions/stock';
import { StoreState } from '@/reducers/types';
import { useDrawer } from '@/utils/hooks';
import * as Helpers from '@/helpers';
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
  const dispatch = useDispatch();
  const [none, setNone] = useState<boolean>(false);
  const [groupList, setGroupList] = useState<Stock.SearchResult[]>([]);
  const { codeMap } = useSelector((state: StoreState) => state.stock.config);

  const { run: runSearch } = useRequest(Services.Stock.SearchFromEastmoney, {
    manual: true,
    throwOnError: true,
    onSuccess: (res) => setGroupList(res.filter(({ Type }) => stockTypesConfig.map(({ code }) => code).includes(Type))),
  });

  const { data: detailSecid, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');

  async function onAdd(secid: string, type: number) {
    const stock = await Helpers.Stock.GetStock(secid);
    if (stock) {
      setNone(false);
      dispatch(
        addStockAction({
          market: stock.market!,
          code: stock.code!,
          secid: stock.secid,
          name: stock.name!,
          type,
        })
      );
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
        {none && (
          <section>
            <span className={styles.none}>添加股票失败，未找到或数据出错~</span>
          </section>
        )}
      </div>
      {groupList.length ? (
        <Tabs animated={{ tabPane: true }} tabBarGutter={15} tabBarStyle={{ marginLeft: 15 }}>
          {groupList.map(({ Datas, Name, Type }) => (
            <Tabs.TabPane tab={Name} key={String(Type)}>
              {Datas.map(({ Name, Code, MktNum }) => {
                const secid = `${MktNum}.${Code}`;
                return (
                  <div key={secid} className={styles.stock} onClick={() => setDetailDrawer(secid)}>
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
                          onAdd(secid, Type);
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
        <DetailStockContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} secid={detailSecid} />
      </CustomDrawer>
    </CustomDrawerContent>
  );
};

export default AddStockContent;
