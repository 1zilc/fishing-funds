import React from 'react';
import { useSelector } from 'react-redux';

import StockRow from '@/components/Home/StockList/StockRow';
import Empty from '@/components/Empty';
import LoadingBar from '@/components/LoadingBar';
import DetailZindexContent from '@/components/Home/ZindexList/DetailZindexContent';
import CustomDrawer from '@/components/CustomDrawer';
import { StoreState } from '@/reducers/types';
import { useDrawer } from '@/utils/hooks';
import styles from './index.scss';

const StockList = () => {
  const stocks = useSelector((state: StoreState) => state.stock.stocks);
  const stocksLoading = useSelector(
    (state: StoreState) => state.stock.stocksLoading
  );

  const {
    data: detailStockSecid,
    show: showDetailDrawer,
    set: setDetailDrawer,
    close: closeDetailDrawer,
  } = useDrawer('');

  return (
    <div className={styles.container}>
      <LoadingBar show={stocksLoading} />
      {stocks.length ? (
        stocks.map((stock) => (
          <StockRow
            key={stock.secid}
            stock={stock}
            onDetail={setDetailDrawer}
          />
        ))
      ) : (
        <Empty text="暂无股票数据~" />
      )}
      <CustomDrawer show={showDetailDrawer}>
        <DetailZindexContent
          onEnter={closeDetailDrawer}
          onClose={closeDetailDrawer}
          code={detailStockSecid}
        />
      </CustomDrawer>
    </div>
  );
};
export default StockList;
