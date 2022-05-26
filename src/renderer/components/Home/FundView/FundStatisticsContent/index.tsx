import React, { useState, useMemo } from 'react';
import { Tabs } from 'antd';

import Eye from '@/components/Eye';
import ChartCard from '@/components/Card/ChartCard';
import PureCard from '@/components/Card/PureCard';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import TypeConfig from '@/components/Home/FundView/FundStatisticsContent/TypeConfig';
import FundRank from '@/components/Home/FundView/FundStatisticsContent/FundRank';
import WalletIncome from '@/components/Home/FundView/FundStatisticsContent/WalletIncome';
import WalletConfig from '@/components/Home/FundView/FundStatisticsContent/WalletConfig';
import AssetsStatistics from '@/components/Home/FundView/FundStatisticsContent/AssetsStatistics';
import AssetsConfig from '@/components/Home/FundView/FundStatisticsContent/AssetsConfig';
import FundWarehouse from '@/components/Home/FundView/FundStatisticsContent/FundWarehouse';
import FundOverview from '@/components/Home/FundView/FundStatisticsContent/FundOverview';
import { walletIcons } from '@/helpers/wallet';

import { useAllCyFunds, useAppSelector } from '@/utils/hooks/utils';
import styles from './index.module.scss';

export interface FundStatisticsContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const FundStatisticsContent: React.FC<FundStatisticsContentProps> = (props) => {
  const { walletConfig } = useAppSelector((state) => state.wallet.config);
  const [statusMap, setStatusMap] = useState(
    walletConfig.reduce((r, c) => {
      r[c.code] = true;
      return r;
    }, {} as Record<string, boolean>)
  );

  const allCyFunds = useAllCyFunds(statusMap);

  const codes = useMemo(() => Object.keys(statusMap).filter((key) => statusMap[key]), [statusMap]);

  function changeWalletStatus(code: string, status: boolean) {
    setStatusMap({
      ...statusMap,
      [code]: status,
    });
  }

  return (
    <CustomDrawerContent title="基金统计" enterText="确定" onEnter={props.onEnter} onClose={props.onClose}>
      <div className={styles.content}>
        <AssetsStatistics funds={allCyFunds} codes={codes} />
        <div className={styles.wallets}>
          {walletConfig.map((wallet, index) => (
            <PureCard key={wallet.code} className={styles.wallet}>
              <img src={walletIcons[wallet.iconIndex]} />
              {wallet.name}
              <Eye status={statusMap[wallet.code]} onClick={(status) => changeWalletStatus(wallet.code, status)} />
            </PureCard>
          ))}
        </div>
        <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
          <Tabs.TabPane tab="持基结构" key={String(0)}>
            <ChartCard>
              <TypeConfig funds={allCyFunds} />
            </ChartCard>
          </Tabs.TabPane>
          <Tabs.TabPane tab="资产结构" key={String(1)}>
            <ChartCard>
              <AssetsConfig funds={allCyFunds} codes={codes} />
            </ChartCard>
          </Tabs.TabPane>
          <Tabs.TabPane tab="钱包配置" key={String(2)}>
            <ChartCard>
              <WalletConfig funds={allCyFunds} codes={codes} />
            </ChartCard>
          </Tabs.TabPane>
          <Tabs.TabPane tab="钱包收益" key={String(3)}>
            <ChartCard>
              <WalletIncome funds={allCyFunds} codes={codes} />
            </ChartCard>
          </Tabs.TabPane>
        </Tabs>
        <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
          <Tabs.TabPane tab="基金收益概览" key={String(0)}>
            <ChartCard>
              <FundOverview funds={allCyFunds} codes={codes} />
            </ChartCard>
          </Tabs.TabPane>
          <Tabs.TabPane tab="基金收益排行" key={String(1)}>
            <ChartCard>
              <FundRank funds={allCyFunds} codes={codes} />
            </ChartCard>
          </Tabs.TabPane>
          <Tabs.TabPane tab="基金持仓排行" key={String(2)}>
            <ChartCard>
              <FundWarehouse funds={allCyFunds} codes={codes} />
            </ChartCard>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </CustomDrawerContent>
  );
};

export default FundStatisticsContent;
