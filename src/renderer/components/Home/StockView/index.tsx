import React, { useMemo } from 'react';

import StockRow from '@/components/Home/StockView/StockRow';
import Empty from '@/components/Empty';
import LoadingBar from '@/components/LoadingBar';
import CustomDrawer from '@/components/CustomDrawer';
import GridView from '@/components/GridView';

import { useDrawer, useSyncFixStockSetting, useAppSelector } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import styles from './index.module.scss';

const DetailStockContent = React.lazy(() => import('@/components/Home/StockView/DetailStockContent'));

interface StockListProps {
  filter: (stock: Stock.ResponseItem & Stock.ExtraRow) => boolean;
}

const StockView: React.FC<StockListProps> = (props) => {
  const stocks = useAppSelector((state) => state.stock.stocks);
  const stocksLoading = useAppSelector((state) => state.stock.stocksLoading);
  const stockViewMode = useAppSelector((state) => state.sort.viewMode.stockViewMode);

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
export default StockView;
