import React from 'react';
import { useRequest } from 'ahooks';
import Empty from '@/components/Empty';
import FundRow from '@/components/Home/FundView/FundRow';
import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer, useAppSelector } from '@/utils/hooks';
import * as Helpers from '@/helpers';
import styles from './index.module.css';

const DetailFundContent = React.lazy(() => import('@/components/Home/FundView/DetailFundContent'));

export interface SameFundListProps {
  swithSameType: string[][];
}
const SameFundList: React.FC<SameFundListProps> = ({ swithSameType = [] }) => {
  const { fundApiTypeSetting } = useAppSelector((state) => state.setting.systemSetting);
  const { data: detailFundCode, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');

  const fundsConfig = swithSameType.flat().map((item) => {
    const [code, name, value] = item.split('_');
    return { code, name, cyfe: 0 };
  });

  const { data: sameFunds = [] } = useRequest(() => Helpers.Fund.GetFunds(fundsConfig, fundApiTypeSetting), {
    ready: !!swithSameType?.length,
  });

  const sortSameFunds = sameFunds.filter(Boolean).sort((a, b) => Number(b.gszzl) - Number(a.gszzl));

  return (
    <div className={styles.content}>
      {sameFunds.length ? (
        sortSameFunds.map((fund) => <FundRow key={fund.fundcode} readOnly fund={fund} onDetail={setDetailDrawer} />)
      ) : (
        <Empty text="暂无同类型基金数据~" />
      )}
      <CustomDrawer show={showDetailDrawer}>
        <DetailFundContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} code={detailFundCode} />
      </CustomDrawer>
    </div>
  );
};

export default SameFundList;
