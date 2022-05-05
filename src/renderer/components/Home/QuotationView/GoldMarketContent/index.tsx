import React from 'react';
import { Tabs } from 'antd';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import GoldTrends from '@/components/Home/QuotationView/GoldMarketContent/GoldTrends';
import K from '@/components/Home/QuotationView/GoldMarketContent/K';
import InternationalMetalFutures from '@/components/Home/QuotationView/GoldMarketContent/InternationalMetalFutures';
import InternationalMetalGoods from '@/components/Home/QuotationView/GoldMarketContent/InternationalMetalGoods';
import ShanghaiGoldFutures from '@/components/Home/QuotationView/GoldMarketContent/ShanghaiGoldFutures';
import ShanghaiGoldGoods from '@/components/Home/QuotationView/GoldMarketContent/ShanghaiGoldGoods';
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
            <Tabs.TabPane tab="金价K线" key={String(2)}>
              <K />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="国际贵金属期货" key={String(0)}>
              <InternationalMetalFutures />
            </Tabs.TabPane>
            <Tabs.TabPane tab="国际贵金属现货" key={String(1)}>
              <InternationalMetalGoods />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="上海黄金期货" key={String(0)}>
              <ShanghaiGoldFutures />
            </Tabs.TabPane>
            <Tabs.TabPane tab="上海黄金现货" key={String(1)}>
              <ShanghaiGoldGoods />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </CustomDrawerContent>
  );
};

export default GoldMarketContent;
