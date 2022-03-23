import React, { useCallback } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, message } from 'antd';

import DetailStockContent from '@/components/Home/StockList/DetailStockContent';
import CustomDrawer from '@/components/CustomDrawer';
import { addStockAction } from '@/actions/stock';
import { StoreState } from '@/reducers/types';
import { useDrawer } from '@/utils/hooks';
import * as Helpers from '@/helpers';

import styles from './index.module.scss';

interface StockSearchProps {
  groupList: Stock.SearchResult[];
}

const StockSearch: React.FC<StockSearchProps> = (props) => {
  const { groupList } = props;
  const dispatch = useDispatch();
  const { codeMap } = useSelector((state: StoreState) => state.stock.config);
  const { data: detailData, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer({ secid: '', type: 0 });

  const onAdd = useCallback(async (secid: string, type: number) => {
    const stock = await Helpers.Stock.GetStock(secid);
    if (stock) {
      dispatch(
        addStockAction({
          market: stock.market!,
          code: stock.code!,
          secid: stock.secid,
          name: stock.name!,
          type,
        })
      );
    } else {
      message.error('添加股票失败，未找到或数据出错~');
    }
  }, []);

  return (
    <div className={clsx(styles.content)}>
      <Tabs animated={{ tabPane: true }} tabBarGutter={15} tabBarStyle={{ marginLeft: 15 }} destroyInactiveTabPane>
        {groupList.map(({ Datas, Name, Type }) => (
          <Tabs.TabPane tab={Name} key={String(Type)}>
            {Datas.map(({ Name, Code, MktNum }) => {
              const secid = `${MktNum}.${Code}`;
              return (
                <div key={secid} className={styles.stock} onClick={() => setDetailDrawer({ secid, type: Type })}>
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
      <CustomDrawer show={showDetailDrawer}>
        <DetailStockContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} secid={detailData.secid} type={detailData.type} />
      </CustomDrawer>
    </div>
  );
};

export default StockSearch;
