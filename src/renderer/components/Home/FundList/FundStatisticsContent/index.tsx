import React, { useState, useMemo } from 'react';
import { Tabs } from 'antd';
import { useSelector } from 'react-redux';

import Eye from '@/components/Eye';
import ChartCard from '@/components/Card/ChartCard';
import PureCard from '@/components/Card/PureCard';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import TypeConfig from '@/components/Home/FundList/FundStatisticsContent/TypeConfig';
import FundRank from '@/components/Home/FundList/FundStatisticsContent/FundRank';
import WalletIncome from '@/components/Home/FundList/FundStatisticsContent/WalletIncome';
import WalletConfig from '@/components/Home/FundList/FundStatisticsContent/WalletConfig';
import AssetsStatistics from '@/components/Home/FundList/FundStatisticsContent/AssetsStatistics';
import AssetsConfig from '@/components/Home/FundList/FundStatisticsContent/AssetsConfig';
import { walletIcons } from '@/helpers/wallet';
import { StoreState } from '@/reducers/types';
import styles from './index.scss';

export interface FundStatisticsContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const FundStatisticsContent: React.FC<FundStatisticsContentProps> = (props) => {
  const { walletConfig } = useSelector((state: StoreState) => state.wallet.config);
  const wallets = useSelector((state: StoreState) => state.wallet.wallets);
  const [statusMap, setStatusMap] = useState<Record<string, boolean>>(
    walletConfig.reduce((r, c) => {
      r[c.code] = true;
      return r;
    }, {} as Record<string, boolean>)
  );

  const funds = useMemo(() => {
    const allFunds: (Fund.ResponseItem & Fund.FixData)[] = [];
    const fundCodeMap = new Map();
    wallets.forEach(({ code, funds }) => {
      if (statusMap[code]) {
        allFunds.push(...funds);
      }
    });
    return allFunds.filter((fund) => !fundCodeMap.has(fund.fundcode!) && fundCodeMap.set(fund.fundcode!, true));
  }, [statusMap, wallets]);

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
        <AssetsStatistics funds={funds} codes={codes} />
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
              <TypeConfig funds={funds} />
            </ChartCard>
          </Tabs.TabPane>
          <Tabs.TabPane tab="资产结构" key={String(1)}>
            <ChartCard>
              <AssetsConfig funds={funds} codes={codes} />
            </ChartCard>
          </Tabs.TabPane>
        </Tabs>
        <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
          <Tabs.TabPane tab="钱包配置" key={String(0)}>
            <ChartCard>
              <WalletConfig funds={funds} codes={codes} />
            </ChartCard>
          </Tabs.TabPane>
          <Tabs.TabPane tab="钱包收益" key={String(1)}>
            <ChartCard>
              <WalletIncome funds={funds} codes={codes} />
            </ChartCard>
          </Tabs.TabPane>
        </Tabs>
        <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
          <Tabs.TabPane tab="基金排行" key={String(0)}>
            <ChartCard>
              <FundRank funds={funds} codes={codes} />
            </ChartCard>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </CustomDrawerContent>
  );
};

export default FundStatisticsContent;
