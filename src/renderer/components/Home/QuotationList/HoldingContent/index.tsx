import React from 'react';
import { Tabs } from 'antd';

import PureCard from '@/components/Card/PureCard';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import History from '@/components/Home/QuotationList/HoldingContent/History';
import styles from './index.module.scss';

interface HoldingContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const HoldingContent: React.FC<HoldingContentProps> = (props) => {
  return (
    <CustomDrawerContent title="沪深港通持股" onClose={props.onClose} onEnter={props.onEnter}>
      <div className={styles.content}>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="北向" key={String(0)}>
              <PureCard>
                <History marketCode="005" reportName="RPT_MUTUAL_MARKET_STA" />
              </PureCard>
            </Tabs.TabPane>
            <Tabs.TabPane tab="沪股通" key={String(1)}>
              <PureCard>
                <History marketCode="001" reportName="RPT_HMUTUAL_MARKET_STA" />
              </PureCard>
            </Tabs.TabPane>
            <Tabs.TabPane tab="深股通" key={String(2)}>
              <PureCard>
                <History marketCode="003" reportName="RPT_SMUTUAL_MARKET_STA" />
              </PureCard>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </CustomDrawerContent>
  );
};

export default HoldingContent;
