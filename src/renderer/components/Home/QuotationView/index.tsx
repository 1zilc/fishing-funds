import React, { useMemo } from 'react';

import QuotationRow from '@/components/Home/QuotationView/QuotationRow';
import QuotationFlow from '@/components/Home/QuotationView/QuotationFlow';
import Empty from '@/components/Empty';
import LoadingBar from '@/components/LoadingBar';
import CustomDrawer from '@/components/CustomDrawer';
import GridView from '@/components/GridView';

import { useDrawer, useAppSelector } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import styles from './index.module.css';

const DetailQuotationContent = React.lazy(() => import('@/components/Home/QuotationView/DetailQuotationContent'));
const DetailStockContent = React.lazy(() => import('@/components/Home/StockView/DetailStockContent'));

interface QuotationViewProps {
  filter: (quotation: Quotation.ResponseItem & Quotation.ExtraRow) => boolean;
}

const QuotationView: React.FC<QuotationViewProps> = (props) => {
  const quotations = useAppSelector((state) => state.quotation.quotations);
  const quotationsLoading = useAppSelector((state) => state.quotation.quotationsLoading);
  const quotationViewMode = useAppSelector((state) => state.sort.viewMode.quotationViewMode);
  const {
    data: quodationCode,
    show: showDetailQuodationDrawer,
    set: setDetailQuodationDrawer,
    close: closeDetailQuodationDrawer,
  } = useDrawer('');

  const {
    data: stockSecid,
    show: showDetailStockDrawer,
    set: setDetailStockDrawer,
    close: closeDetailStockDrawer,
  } = useDrawer('');

  const list = quotations.filter(props.filter);

  const view = useMemo(() => {
    switch (quotationViewMode.type) {
      case Enums.QuotationViewType.Grid:
        return <GridView list={list.map((item) => ({ ...item, value: item.zxj }))} onDetail={setDetailQuodationDrawer} />;
      case Enums.QuotationViewType.List:
        return list.map((quotation) => (
          <QuotationRow
            key={quotation.name}
            quotation={quotation}
            onDetail={setDetailQuodationDrawer}
            onStockDetail={setDetailStockDrawer}
          />
        ));
      case Enums.QuotationViewType.Flow:
      default:
        return <QuotationFlow list={list} onDetail={setDetailQuodationDrawer} />;
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
