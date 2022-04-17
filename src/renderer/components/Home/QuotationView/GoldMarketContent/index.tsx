import React from 'react';
import { Tabs } from 'antd';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import GoldTrends from '@/components/Home/QuotationView/GoldMarketContent/GoldTrends';
import styles from './index.module.scss';

interface GoldMarketContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const GoldMarketContent: React.FC<GoldMarketContentProps> = (props) => {
  return (
    <CustomDrawerContent title="黄金市场" enterText="确定" onClose={props.onClose} onEnter={props.onEnter}>
      <div className={styles.content}>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="黄金期货" key={String(0)}>
              <GoldTrends secid="113.aum" title="沪金主力" />
            </Tabs.TabPane>
            <Tabs.TabPane tab="国际金价" key={String(1)}>
              <GoldTrends secid="101.GC00Y" title="COMEX黄金" />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </CustomDrawerContent>
  );
};

export default GoldMarketContent;
