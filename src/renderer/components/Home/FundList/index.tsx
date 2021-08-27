import React from 'react';
import { useSelector } from 'react-redux';

import FundRow from '@/components/Home/FundList/FundRow';
import Empty from '@/components/Empty';
import LoadingBar from '@/components/LoadingBar';
import EditFundContent from '@/components/Home/FundList/EditFundContent';
import DetailFundContent from '@/components/Home/FundList/DetailFundContent';
import CustomDrawer from '@/components/CustomDrawer';
import { StoreState } from '@/reducers/types';
import { useDrawer, useFreshFunds, useCurrentWallet } from '@/utils/hooks';
import styles from './index.scss';

interface FundListProps {
  filter: (fund: Fund.ResponseItem & Fund.ExtraRow & Fund.FixData) => boolean;
}

const FundList: React.FC<FundListProps> = (props) => {
  const {
    currentWalletState: { funds },
  } = useCurrentWallet();
  const fundsLoading = useSelector((state: StoreState) => state.fund.fundsLoading);
  const {
    data: editData,
    show: showEditDrawer,
    set: setEditDrawer,
    close: closeEditDrawer,
  } = useDrawer({
    focus: '',
    fundData: { cyfe: 0, code: '', name: '' },
  });
  const freshFunds = useFreshFunds(0);
  const { data: detailFundCode, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');
  const list = funds.filter(props.filter);

  function enterEditDrawer() {
    freshFunds();
    closeEditDrawer();
  }

  return (
    <div className={styles.container}>
      <LoadingBar show={fundsLoading} />
      {list.length ? (
        list.map((fund) => (
          <FundRow
            key={fund.fundcode}
            fund={fund}
            onEdit={(fundData, focus) => setEditDrawer({ fundData, focus })}
            onDetail={setDetailDrawer}
          />
        ))
      ) : (
        <Empty text="暂无基金数据~" />
      )}
      <CustomDrawer show={showEditDrawer}>
        <EditFundContent onClose={closeEditDrawer} onEnter={enterEditDrawer} fund={editData.fundData} focus={editData.focus} />
      </CustomDrawer>
      <CustomDrawer show={showDetailDrawer}>
        <DetailFundContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} code={detailFundCode} />
      </CustomDrawer>
    </div>
  );
};
export default FundList;
