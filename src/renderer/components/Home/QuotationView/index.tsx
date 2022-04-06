import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import QuotationRow from '@/components/Home/QuotationView/QuotationRow';
import Empty from '@/components/Empty';
import LoadingBar from '@/components/LoadingBar';
import CustomDrawer from '@/components/CustomDrawer';
import GridView from '@/components/GridView';
import { StoreState } from '@/reducers/types';
import { useDrawer } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import styles from './index.module.scss';

const DetailQuotationContent = React.lazy(() => import('@/components/Home/QuotationView/DetailQuotationContent'));
const DetailStockContent = React.lazy(() => import('@/components/Home/StockList/DetailStockContent'));

interface QuotationViewProps {
  filter: (quotation: Quotation.ResponseItem & Quotation.ExtraRow) => boolean;
}

const QuotationView: React.FC<QuotationViewProps> = (props) => {
  const quotations = useSelector((state: StoreState) => state.quotation.quotations);
  const quotationsLoading = useSelector((state: StoreState) => state.quotation.quotationsLoading);
  const quotationViewMode = useSelector((state: StoreState) => state.sort.viewMode.quotationViewMode);
  const {
    data: quodationCode,
    show: showDetailQuodationDrawer,
    set: setDetailQuodationDrawer,
    close: closeDetailQuodationDrawer,
  } = useDrawer('');

  const { data: stockSecid, show: showDetailStockDrawer, set: setDetailStockDrawer, close: closeDetailStockDrawer } = useDrawer('');

  const list = quotations.filter(props.filter);

  const view = useMemo(() => {
    switch (quotationViewMode.type) {
      case Enums.QuotationViewType.Grid:
        return <GridView list={list.map((item) => ({ ...item, value: item.zxj }))} onDetail={setDetailQuodationDrawer} />;
      case Enums.QuotationViewType.List:
      default:
        return list.map((quotation) => (
          <QuotationRow
            key={quotation.name}
            quotation={quotation}
            onDetail={setDetailQuodationDrawer}
            onStockDetail={setDetailStockDrawer}
          />
        ));
    }
  }, [list, quotationViewMode]);

  return (
    <div className={styles.container}>
      <LoadingBar show={quotationsLoading} />
      {list.length ? view : <Empty text="暂无板块数据~" />}
      <CustomDrawer show={showDetailQuodationDrawer}>
        <DetailQuotationContent onEnter={closeDetailQuodationDrawer} onClose={closeDetailQuodationDrawer} code={quodationCode} />
      </CustomDrawer>
      <CustomDrawer show={showDetailStockDrawer}>
        <DetailStockContent onEnter={closeDetailStockDrawer} onClose={closeDetailStockDrawer} secid={stockSecid} />
      </CustomDrawer>
    </div>
  );
};
export default QuotationView;
