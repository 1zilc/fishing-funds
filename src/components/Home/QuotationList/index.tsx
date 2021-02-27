import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import QuotationRow from '@/components/Home/QuotationList/QuotationRow';
import Empty from '@/components/Empty';
import LoadingBar from '@/components/LoadingBar';
import { loadQuotations } from '@/actions/quotation';
import { StoreState } from '@/reducers/types';
import { useWorkDayTimeToDo } from '@/utils/hooks';
import { useActions } from '@/utils/hooks';
import styles from './index.scss';

const QuotationList = () => {
  const quotations = useSelector(
    (state: StoreState) => state.quotation.quotations
  );
  const quotationsLoading = useSelector(
    (state: StoreState) => state.quotation.quotationsLoading
  );
  const runLoadQuotations = useActions(loadQuotations);

  // 间隔时间刷新板块
  useWorkDayTimeToDo(runLoadQuotations, 1000 * 30);

  useEffect(() => {
    runLoadQuotations();
  }, []);

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
