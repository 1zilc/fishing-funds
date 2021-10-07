import React from 'react';
import { Tabs } from 'antd';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import Offshore from '@/components/Home/ZindexList/ExchangeContent/Offshore';
import BaseExchange from '@/components/Home/ZindexList/ExchangeContent/BaseExchange';
import CrossExchange from '@/components/Home/ZindexList/ExchangeContent/CrossExchange';
import CnyCenterExchange from '@/components/Home/ZindexList/ExchangeContent/CnyCenterExchange';
import CnyMixExchange from '@/components/Home/ZindexList/ExchangeContent/CnyMixExchange';
import GlobalBond from '@/components/Home/ZindexList/ExchangeContent/GlobalBond';
import styles from './index.scss';

interface ExchangeContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const ExchangeContent: React.FC<ExchangeContentProps> = (props) => {
  return (
    <CustomDrawerContent title="外汇债券" enterText="确定" onClose={props.onClose} onEnter={props.onEnter}>
      <div className={styles.content}>
        <Offshore />
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="基本汇率" key={String(0)}>
              <BaseExchange />
            </Tabs.TabPane>
            <Tabs.TabPane tab="交叉汇率" key={String(1)}>
              <CrossExchange />
            </Tabs.TabPane>
            <Tabs.TabPane tab="中间价" key={String(2)}>
              <CnyCenterExchange />
            </Tabs.TabPane>
            <Tabs.TabPane tab="即期混合" key={String(3)}>
              <CnyMixExchange />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="全球债券" key={String(0)}>
              <GlobalBond />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </CustomDrawerContent>
  );
};

export default ExchangeContent;
