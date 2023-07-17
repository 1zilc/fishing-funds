import React, { useEffect, useMemo } from 'react';
import FundRow from '@/components/Home/FundView/FundRow';
import Empty from '@/components/Empty';
import LoadingBar from '@/components/LoadingBar';
import CustomDrawer from '@/components/CustomDrawer';
import GridView from '@/components/GridView';

import { useDrawer, useFreshFunds, useAppSelector } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

const EditFundContent = React.lazy(() => import('@/components/Home/FundView/EditFundContent'));
const DetailFundContent = React.lazy(() => import('@/components/Home/FundView/DetailFundContent'));

interface FundListProps {
  filter: (fund: Fund.ResponseItem & Fund.ExtraRow & Fund.FixData) => boolean;
}

const FundView: React.FC<FundListProps> = (props) => {
  const fundsLoading = useAppSelector((state) => state.fund.fundsLoading);
  const fundViewMode = useAppSelector((state) => state.sort.viewMode.fundViewMode);
  const funds = useAppSelector((state) => state.wallet.currentWallet.funds);
  const fundConfigCodeMap = useAppSelector((state) => state.wallet.fundConfigCodeMap);

  const freshFunds = useFreshFunds();

  const {
    data: editData,
    show: showEditDrawer,
    set: setEditDrawer,
    close: closeEditDrawer,
  } = useDrawer({} as Fund.SettingItem);

  const {
    data: detailFundCode,
    show: showDetailDrawer,
    set: setDetailDrawer,
    close: closeDetailDrawer,
  } = useDrawer('');

  const list = funds.filter(props.filter);

  const view = useMemo(() => {
    switch (fundViewMode.type) {
      case Enums.FundViewType.Grid:
        return (
          <GridView
            list={list.map((fund) => {
              const calcFundResult = Helpers.Fund.CalcFund(fund, fundConfigCodeMap);
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
          <FundRow key={fund.fundcode} fund={fund} onEdit={setEditDrawer} onDetail={setDetailDrawer} />
        ));
    }
  }, [list, fundViewMode, fundConfigCodeMap]);

  function enterEditDrawer() {
    freshFunds();
    closeEditDrawer();
  }

  return (
    <div className={styles.container}>
      <LoadingBar show={fundsLoading} />
      {list.length ? view : <Empty text="暂无基金数据~" />}
      <CustomDrawer show={showEditDrawer}>
        <EditFundContent onClose={closeEditDrawer} onEnter={enterEditDrawer} fund={editData} />
      </CustomDrawer>
      <CustomDrawer show={showDetailDrawer}>
        <DetailFundContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} code={detailFundCode} />
      </CustomDrawer>
    </div>
  );
};
export default FundView;
