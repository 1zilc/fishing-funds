import React from 'react';
import { useSelector } from 'react-redux';

import StockRow from '@/components/Home/StockList/StockRow';
import Empty from '@/components/Empty';
import LoadingBar from '@/components/LoadingBar';
import DetailStockContent from '@/components/Home/StockList/DetailStockContent';
import DetailQuotationContent from '@/components/Home/QuotationList/DetailQuotationContent';
import CustomDrawer from '@/components/CustomDrawer';
import { StoreState } from '@/reducers/types';
import { useDrawer, useSyncFixStockSetting } from '@/utils/hooks';
import styles from './index.scss';

interface StockListProps {
  filter: (stock: Stock.ResponseItem & Stock.ExtraRow) => boolean;
}

const StockList: React.FC<StockListProps> = (props) => {
  const stocks = useSelector((state: StoreState) => state.stock.stocks);
  const stocksLoading = useSelector((state: StoreState) => state.stock.stocksLoading);

  const { data: detailStockSecid, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');

  const list = stocks.filter(props.filter);

  const { done: syncStockSettingDone } = useSyncFixStockSetting();

  return (
    <div className={styles.container}>
      <LoadingBar show={stocksLoading} />
      {list.length ? (
        syncStockSettingDone ? (
          list.map((stock) => <StockRow key={stock.secid} stock={stock} onDetail={setDetailDrawer} />)
        ) : (
          <Empty text="正在同步股票设置~" />
        )
      ) : (
        <Empty text="暂无股票数据~" />
      )}
      <CustomDrawer show={showDetailDrawer}>
        <DetailStockContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} secid={detailStockSecid} />
      </CustomDrawer>
    </div>
  );
};
export default StockList;
