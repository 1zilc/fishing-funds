import React from 'react';
import { Tabs } from 'antd';

import PureCard from '@/components/Card/PureCard';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import History from '@/components/Home/QuotationView/HoldingContent/History';
import MutualQuota from '@/components/Home/QuotationView/HoldingContent/MutualQuota';
import styles from './index.module.scss';

interface HoldingContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const HoldingContent: React.FC<HoldingContentProps> = (props) => {
  return (
    <CustomDrawerContent title="沪深港通持股" onClose={props.onClose} onEnter={props.onEnter}>
      <div className={styles.content}>
        <MutualQuota />
        <div className={styles.container}>
          <Tabs
            animated={{ tabPane: true }}
            tabBarGutter={15}
            items={[
              {
                key: String(0),
                label: '北向',
                children: (
                  <PureCard>
                    <History marketCode="005" reportName="RPT_MUTUAL_MARKET_STA" />
                  </PureCard>
                ),
              },
              {
                key: String(1),
                label: '沪股通',
                children: (
                  <PureCard>
                    <History marketCode="001" reportName="RPT_HMUTUAL_MARKET_STA" />
                  </PureCard>
                ),
              },
              {
                key: String(2),
                label: '深股通',
                children: (
                  <PureCard>
                    <History marketCode="003" reportName="RPT_SMUTUAL_MARKET_STA" />
                  </PureCard>
                ),
              },
            ]}
          />
        </div>
      </div>
    </CustomDrawerContent>
  );
};

export default HoldingContent;
