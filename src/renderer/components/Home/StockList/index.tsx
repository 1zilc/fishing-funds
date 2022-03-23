import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import StockRow from '@/components/Home/StockList/StockRow';
import Empty from '@/components/Empty';
import LoadingBar from '@/components/LoadingBar';
import DetailStockContent from '@/components/Home/StockList/DetailStockContent';
import CustomDrawer from '@/components/CustomDrawer';
import GridView from '@/components/GridView';
import { StoreState } from '@/reducers/types';
import { useDrawer, useSyncFixStockSetting } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import styles from './index.module.scss';

interface StockListProps {
  filter: (stock: Stock.ResponseItem & Stock.ExtraRow) => boolean;
}

const StockList: React.FC<StockListProps> = (props) => {
  const stocks = useSelector((state: StoreState) => state.stock.stocks);
  const stocksLoading = useSelector((state: StoreState) => state.stock.stocksLoading);
  const stockViewMode = useSelector((state: StoreState) => state.sort.viewMode.stockViewMode);

  const { data: detailStockSecid, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');

  const list = stocks.filter(props.filter);

  const view = useMemo(() => {
    switch (stockViewMode.type) {
      case Enums.StockViewType.Grid:
        return <GridView list={list.map((item) => ({ ...item, value: item.zx, code: item.secid }))} onDetail={setDetailDrawer} />;
      case Enums.StockViewType.List:
      default:
        return list.map((stock) => <StockRow key={stock.secid} stock={stock} onDetail={setDetailDrawer} />);
    }
  }, [list, stockViewMode]);

  const { done: syncStockSettingDone } = useSyncFixStockSetting();

  return (
    <div className={styles.container}>
      <LoadingBar show={stocksLoading} />
      {list.length ? syncStockSettingDone ? view : <Empty text="正在同步股票设置~" /> : <Empty text="暂无股票数据~" />}
      <CustomDrawer show={showDetailDrawer}>
        <DetailStockContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} secid={detailStockSecid} />
      </CustomDrawer>
    </div>
  );
};
export default StockList;
