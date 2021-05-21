import React from 'react';
import { useSelector } from 'react-redux';

import QuotationRow from '@/components/Home/QuotationList/QuotationRow';
import Empty from '@/components/Empty';
import LoadingBar from '@/components/LoadingBar';
import CustomDrawer from '@/components/CustomDrawer';
import DetailQuotationContent from '@/components/Home/QuotationList/DetailQuotationContent';
import { StoreState } from '@/reducers/types';
import { useDrawer } from '@/utils/hooks';
import styles from './index.scss';

const QuotationList = () => {
  const quotations = useSelector(
    (state: StoreState) => state.quotation.quotations
  );
  const quotationsLoading = useSelector(
    (state: StoreState) => state.quotation.quotationsLoading
  );
  const {
    data: detailQuodationCode,
    show: showDetailDrawer,
    set: setDetailDrawer,
    close: closeDetailDrawer,
  } = useDrawer('');

  return (
    <div className={styles.container}>
      <LoadingBar show={quotationsLoading} />
      {quotations.length ? (
        quotations.map((quotation) => (
          <QuotationRow
            key={quotation.name}
            quotation={quotation}
            onDetail={setDetailDrawer}
          />
        ))
      ) : (
        <Empty text="暂无板块数据~" />
      )}
      <CustomDrawer show={showDetailDrawer}>
        <DetailQuotationContent
          onEnter={closeDetailDrawer}
          onClose={closeDetailDrawer}
          code={detailQuodationCode}
        />
      </CustomDrawer>
    </div>
  );
};
export default QuotationList;
