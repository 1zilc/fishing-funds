import React, { useState, useEffect, useMemo } from 'react';
import { Tabs } from 'antd';
import { useSelector } from 'react-redux';

import Eye from '@/components/Eye';
import ChartCard from '@/components/Card/ChartCard';
import PureCard from '@/components/Card/PureCard';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import TypeConfig from '@/components/Home/FundList/FundStatisticsContent/TypeConfig';
import FundRank from '@/components/Home/FundList/FundStatisticsContent/FundRank';
import { getWalletConfig, walletIcons } from '@/actions/wallet';
import { StoreState } from '@/reducers/types';
import styles from './index.scss';

export interface FundStatisticsContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const FundStatisticsContent: React.FC<FundStatisticsContentProps> = (props) => {
  const { walletConfig } = getWalletConfig();
  const walletsMap = useSelector(
    (state: StoreState) => state.wallet.walletsMap
  );
  const [statusMap, setStatusMap] = useState<Record<string, boolean>>({});
  const funds = useMemo(() => {
    const funds: (Fund.ResponseItem & Fund.FixData)[] = [];
    const fundCodeMap = new Map();
    Object.entries(walletsMap).forEach(([code, item]) => {
      if (statusMap[code]) {
        Array.prototype.push.apply(funds, item.funds);
      }
    });
    return funds.filter(
      (fund) =>
        !fundCodeMap.has(fund.fundcode!) &&
        fundCodeMap.set(fund.fundcode!, true)
    );
  }, [statusMap, walletsMap]);

  function changeWalletStatus(code: string, status: boolean) {
    setStatusMap({
      ...statusMap,
      [code]: status,
    });
  }

  useEffect(() => {
    const statusMap = walletConfig.reduce((r, c) => {
      r[c.code] = true;
      return r;
    }, {} as Record<string, boolean>);
    setStatusMap(statusMap);
  }, []);

  return (
    <CustomDrawerContent
      title="基金统计"
      enterText="确定"
      onEnter={props.onClose}
      onClose={props.onClose}
    >
      <div className={styles.content}>
        <div className={styles.wallets}>
          {walletConfig.map((wallet, index) => (
            <PureCard key={wallet.code} className={styles.wallet}>
              <img src={walletIcons[wallet.iconIndex]} />
              {wallet.name}
              <Eye
                status={statusMap[wallet.code]}
                onClick={(status) => changeWalletStatus(wallet.code, status)}
              />
            </PureCard>
          ))}
        </div>
        <Tabs
          defaultActiveKey={String(0)}
          animated={{ tabPane: true }}
          tabBarGutter={15}
        >
          <Tabs.TabPane tab="持基结构" key={String(0)}>
            <ChartCard>
              <TypeConfig funds={funds} />
            </ChartCard>
          </Tabs.TabPane>
        </Tabs>
        <Tabs
          defaultActiveKey={String(0)}
          animated={{ tabPane: true }}
          tabBarGutter={15}
        >
          <Tabs.TabPane tab="基金排行" key={String(0)}>
            <ChartCard>
              <FundRank
                funds={funds}
                codes={Object.keys(statusMap).filter((key) => statusMap[key])}
              />
            </ChartCard>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </CustomDrawerContent>
  );
};

export default FundStatisticsContent;
