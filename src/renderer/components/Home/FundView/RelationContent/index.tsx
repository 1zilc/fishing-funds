import React, { useMemo, useState } from 'react';
import { Tabs } from 'antd';
import { useRequest } from 'ahooks';
import Eye from '@/components/Eye';
import ChartCard from '@/components/Card/ChartCard';
import PureCard from '@/components/Card/PureCard';
import ColorfulTags from '@/components/ColorfulTags';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import Sankey from '@/components/Home/FundView/RelationContent/Sankey';
import { useAllCyFunds, useAppSelector } from '@/utils/hooks/utils';
import { walletIcons } from '@/helpers/wallet';
import * as Services from '@/services';
import * as Utils from '@/utils';
import * as Adpters from '@/utils/adpters';
import * as CONST from '@/constants';

import styles from './index.module.scss';

interface RelationContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const RelationContent: React.FC<RelationContentProps> = (props) => {
  const { walletConfig } = useAppSelector((state) => state.wallet.config);
  const [statusMap, setStatusMap] = useState(
    walletConfig.reduce((r, c) => {
      r[c.code] = true;
      return r;
    }, {} as Record<string, boolean>)
  );

  const allCyFunds = useAllCyFunds(statusMap);
  const collectors = allCyFunds.map((fund) => async () => {
    const { stocks } = await Services.Fund.GetIndustryRateFromEaseMoney(fund.fundcode!);
    return {
      ...fund,
      stocks,
    };
  });
  const { data: result = [], run: runGetIndustryRateFromEaseMoney } = useRequest(() => Adpters.ChokeGroupAdapter(collectors, 5, 500), {
    refreshDeps: [allCyFunds],
    cacheKey: Utils.GenerateRequestKey(
      'Fund.GetIndustryRateFromEaseMoney',
      allCyFunds.map(({ fundcode }) => fundcode)
    ),
    staleTime: CONST.DEFAULT.SWR_STALE_DELAY,
  });

  const data = result.filter(Utils.NotEmpty);

  function changeWalletStatus(code: string, status: boolean) {
    setStatusMap({
      ...statusMap,
      [code]: status,
    });
  }

  const tags = Array.from(new Set(data.map(({ stocks = [] }) => stocks.map((stock) => stock.INDEXNAME)).flat()));

  return (
    <CustomDrawerContent title="股基关系" enterText="确定" onClose={props.onClose} onEnter={props.onEnter}>
      <div className={styles.content}>
        <div className={styles.wallets}>
          {walletConfig.map((wallet, index) => (
            <PureCard key={wallet.code} className={styles.wallet}>
              <img src={walletIcons[wallet.iconIndex]} />
              {wallet.name}
              <Eye status={statusMap[wallet.code]} onClick={(status) => changeWalletStatus(wallet.code, status)} />
            </PureCard>
          ))}
        </div>
        <div className={styles.wallets}>
          <ColorfulTags tags={tags} />
        </div>
        <Tabs
          animated={{ tabPane: true }}
          tabBarGutter={15}
          items={[
            {
              key: String(0),
              label: '股票关系',
              children: (
                <ChartCard onFresh={runGetIndustryRateFromEaseMoney}>
                  <Sankey data={data} valueKey="GPJC" length={allCyFunds.length} />
                </ChartCard>
              ),
            },
            {
              key: String(1),
              label: '板块关系',
              children: (
                <ChartCard onFresh={runGetIndustryRateFromEaseMoney}>
                  <Sankey data={data} valueKey="INDEXNAME" length={allCyFunds.length} />
                </ChartCard>
              ),
            },
          ]}
        />
      </div>
    </CustomDrawerContent>
  );
};

export default RelationContent;
