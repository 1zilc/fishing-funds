import React, { useState } from 'react';
import { Tabs } from 'antd';
import { useRequest } from 'ahooks';

import Eye from '@/components/Eye';
import ChartCard from '@/components/Card/ChartCard';
import PureCard from '@/components/Card/PureCard';
import ColorfulTags from '@/components/ColorfulTags';
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
import * as Services from '@lib/enh/services';
import * as Utils from '@/utils';
import * as Adpters from '@/utils/adpters';
import * as CONST from '@/constants';

import { useAllCyFunds, useAppSelector } from '@/utils/hooks/utils';
import styles from './index.module.css';

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

  const codes = Object.keys(statusMap).filter((key) => statusMap[key]);

  const collectors = allCyFunds.map((fund) => async () => {
    const { stocks } = await Services.Fund.GetIndustryRateFromEaseMoney(fund.fundcode!);
    return {
      ...fund,
      stocks,
    };
  });

  const { data: sankeyResult = [] } = useRequest(() => Adpters.ChokeGroupAdapter(collectors, 3, 800), {
    refreshDeps: [allCyFunds],
    cacheKey: Utils.GenerateRequestKey(
      'Fund.GetIndustryRateFromEaseMoney',
      allCyFunds.map(({ fundcode }) => fundcode)
    ),
    staleTime: CONST.DEFAULT.SWR_STALE_DELAY,
  });

  const sankeyData = sankeyResult.filter(Utils.NotEmpty);
  const tags = Array.from(new Set(sankeyData.map(({ stocks = [] }) => stocks.map((stock) => stock.INDEXNAME)).flat()));

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
        <ColorfulTags tags={tags} />
        <Tabs
          animated={{ tabPane: true }}
          tabBarGutter={15}
          items={[
            {
              key: String(0),
              label: '持基结构',
              children: (
                <ChartCard>
                  <TypeConfig funds={allCyFunds} />
                </ChartCard>
              ),
            },
            {
              key: String(1),
              label: '资产结构',
              children: (
                <ChartCard>
                  <AssetsConfig funds={allCyFunds} codes={codes} />
                </ChartCard>
              ),
            },
            {
              key: String(2),
              label: '钱包配置',
              children: (
                <ChartCard>
                  <WalletConfig funds={allCyFunds} codes={codes} />
                </ChartCard>
              ),
            },
            {
              key: String(3),
              label: '钱包收益',
              children: (
                <ChartCard>
                  <WalletIncome funds={allCyFunds} codes={codes} />
                </ChartCard>
              ),
            },
          ]}
        />
        <Tabs
          animated={{ tabPane: true }}
          tabBarGutter={15}
          items={[
            {
              key: String(0),
              label: '基金收益排行',
              children: (
                <ChartCard>
                  <FundRank funds={allCyFunds} codes={codes} />
                </ChartCard>
              ),
            },
            {
              key: String(1),
              label: '基金收益概览',
              children: (
                <ChartCard>
                  <FundOverview funds={allCyFunds} codes={codes} />
                </ChartCard>
              ),
            },
            {
              key: String(2),
              label: '基金持仓排行',
              children: (
                <ChartCard>
                  <FundWarehouse funds={allCyFunds} codes={codes} />
                </ChartCard>
              ),
            },
          ]}
        />
      </div>
    </CustomDrawerContent>
  );
};

export default FundStatisticsContent;
