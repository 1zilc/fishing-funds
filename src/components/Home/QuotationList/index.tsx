import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';

import QuotationRow from '@/components/QuotationRow';
import { HomeContext } from '@/components/Home';
import { StoreState } from '@/reducers/types';
import { useWorkDayTimeToDo } from '@/utils/hooks';
import styles from './index.scss';

const QuotationList = () => {
  const quotations = useSelector(
    (state: StoreState) => state.quotation.quotations
  );
  const { runGetQuotations } = useContext(HomeContext);

  // 间隔时间刷新板块
  useWorkDayTimeToDo(runGetQuotations, 1000 * 30);

  useEffect(() => {
    runGetQuotations();
  }, []);

  return (
    <div className={styles.container}>
      {quotations.map((quotation) => (
        <QuotationRow key={quotation.name} quotation={quotation} />
      ))}
      {!quotations.length && <div className={styles.empty}>暂无板块数据~</div>}
    </div>
  );
};
export default QuotationList;
