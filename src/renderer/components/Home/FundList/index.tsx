import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import FundRow from '@/components/Home/FundList/FundRow';
import Empty from '@/components/Empty';
import LoadingBar from '@/components/LoadingBar';
import EditFundContent from '@/components/Home/FundList/EditFundContent';
import DetailFundContent from '@/components/Home/FundList/DetailFundContent';
import CustomDrawer from '@/components/CustomDrawer';
import GridView from '@/components/GridView';
import { StoreState } from '@/reducers/types';
import { useDrawer, useFreshFunds, useCurrentWallet } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

interface FundListProps {
  filter: (fund: Fund.ResponseItem & Fund.ExtraRow & Fund.FixData) => boolean;
}

const FundList: React.FC<FundListProps> = (props) => {
  const {
    currentWalletState: { funds },
    currentWalletCode,
  } = useCurrentWallet();
  const fundsLoading = useSelector((state: StoreState) => state.fund.fundsLoading);
  const fundViewMode = useSelector((state: StoreState) => state.sort.viewMode.fundViewMode);

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

  const view = useMemo(() => {
    switch (fundViewMode.type) {
      case Enums.FundViewType.Grid:
        return (
          <GridView
            list={list.map((fund) => {
              const calcFundResult = Helpers.Fund.CalcFund(fund, currentWalletCode);
              return {
                name: calcFundResult.name!,
                value: Number(Number(calcFundResult.gszz || 0).toFixed(2)),
                zdd: Number(Number(calcFundResult.jrsygz || 0).toFixed(2)),
                zdf: Number(calcFundResult.gszzl || 0),
                code: calcFundResult.fundcode!,
              };
            })}
            onDetail={setDetailDrawer}
          />
        );
      case Enums.FundViewType.List:
      default:
        return list.map((fund) => (
          <FundRow
            key={fund.fundcode}
            fund={fund}
            onEdit={(fundData, focus) => setEditDrawer({ fundData, focus })}
            onDetail={setDetailDrawer}
          />
        ));
    }
  }, [list, fundViewMode]);

  function enterEditDrawer() {
    freshFunds();
    closeEditDrawer();
  }

  return (
    <div className={styles.container}>
      <LoadingBar show={fundsLoading} />
      {list.length ? view : <Empty text="暂无基金数据~" />}
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
