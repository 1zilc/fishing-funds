import React from 'react';
import { useSelector } from 'react-redux';

import FundRow from '@/components/Home/FundList/FundRow';
import Empty from '@/components/Empty';
import LoadingBar from '@/components/LoadingBar';
import EditFundContent from '@/components/Home/FundList/EditFundContent';
import DetailFundContent from '@/components/Home/FundList/DetailFundContent';
import CustomDrawer from '@/components/CustomDrawer';
import { StoreState } from '@/reducers/types';
import { useDrawer, useFreshFunds } from '@/utils/hooks';
import styles from './index.scss';

const FundList: React.FC<{}> = () => {
  const funds = useSelector((state: StoreState) => state.fund.funds);
  const fundsLoading = useSelector(
    (state: StoreState) => state.fund.fundsLoading
  );
  const {
    data: editFundData,
    show: showEditDrawer,
    set: setEditDrawer,
    close: closeEditDrawer,
  } = useDrawer({ cyfe: 0, code: '', name: '' });

  const {
    data: detailFundCode,
    show: showDetailDrawer,
    set: setDetailDrawer,
    close: closeDetailDrawer,
  } = useDrawer('');

  const freshFunds = useFreshFunds(0);

  const enterEditDrawer = () => {
    freshFunds();
    closeEditDrawer();
  };

  return (
    <div className={styles.container}>
      <LoadingBar show={fundsLoading} />
      {funds.length ? (
        funds.map((fund) => (
          <FundRow
            key={fund.fundcode}
            fund={fund}
            onEdit={setEditDrawer}
            onDetail={setDetailDrawer}
          />
        ))
      ) : (
        <Empty text="暂无基金数据~" />
      )}
      <CustomDrawer show={showEditDrawer}>
        <EditFundContent
          onClose={closeEditDrawer}
          onEnter={enterEditDrawer}
          fund={editFundData}
        />
      </CustomDrawer>
      <CustomDrawer show={showDetailDrawer}>
        <DetailFundContent
          onEnter={closeDetailDrawer}
          onClose={closeDetailDrawer}
          code={detailFundCode}
        />
      </CustomDrawer>
    </div>
  );
};
export default FundList;
