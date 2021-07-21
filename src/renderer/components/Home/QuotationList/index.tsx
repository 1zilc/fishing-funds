import React from 'react';
import { useSelector } from 'react-redux';

import QuotationRow from '@/components/Home/QuotationList/QuotationRow';
import Empty from '@/components/Empty';
import LoadingBar from '@/components/LoadingBar';
import CustomDrawer from '@/components/CustomDrawer';
import DetailQuotationContent from '@/components/Home/QuotationList/DetailQuotationContent';
import DetailStockContent from '@/components/Home/StockList/DetailStockContent';
import { StoreState } from '@/reducers/types';
import { useDrawer } from '@/utils/hooks';
import styles from './index.scss';

interface QuotationListProps {
  filter: (quotation: Quotation.ResponseItem & Quotation.ExtraRow) => boolean;
}

const QuotationList: React.FC<QuotationListProps> = (props) => {
  const quotations = useSelector(
    (state: StoreState) => state.quotation.quotations
  );
  const quotationsLoading = useSelector(
    (state: StoreState) => state.quotation.quotationsLoading
  );
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

  return (
    <div className={styles.container}>
      <LoadingBar show={quotationsLoading} />
      {list.length ? (
        list.map((quotation) => (
          <QuotationRow
            key={quotation.name}
            quotation={quotation}
            onDetail={setDetailQuodationDrawer}
            onStockDetail={setDetailStockDrawer}
          />
        ))
      ) : (
        <Empty text="暂无板块数据~" />
      )}
      <CustomDrawer show={showDetailQuodationDrawer}>
        <DetailQuotationContent
          onEnter={closeDetailQuodationDrawer}
          onClose={closeDetailQuodationDrawer}
          code={quodationCode}
        />
      </CustomDrawer>
      <CustomDrawer show={showDetailStockDrawer}>
        <DetailStockContent
          onEnter={closeDetailStockDrawer}
          onClose={closeDetailStockDrawer}
          secid={stockSecid}
        />
      </CustomDrawer>
    </div>
  );
};
export default QuotationList;
