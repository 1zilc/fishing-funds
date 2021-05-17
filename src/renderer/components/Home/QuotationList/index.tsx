import React from 'react';
import { useSelector } from 'react-redux';

import QuotationRow from '@/components/Home/QuotationList/QuotationRow';
import Empty from '@/components/Empty';
import LoadingBar from '@/components/LoadingBar';
import { StoreState } from '@/reducers/types';
import styles from './index.scss';

const QuotationList = () => {
  const quotations = useSelector(
    (state: StoreState) => state.quotation.quotations
  );
  const quotationsLoading = useSelector(
    (state: StoreState) => state.quotation.quotationsLoading
  );

  return (
    <div className={styles.container}>
      <LoadingBar show={quotationsLoading} />
      {quotations.length ? (
        quotations.map((quotation) => (
          <QuotationRow key={quotation.name} quotation={quotation} />
        ))
      ) : (
        <Empty text="暂无板块数据~" />
      )}
    </div>
  );
};
export default QuotationList;
