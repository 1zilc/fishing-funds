import React from 'react';
import { Tabs } from 'antd';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import Offshore from '@/components/Home/ZindexList/ExchangeContent/Offshore';
import BaseExchange from '@/components/Home/ZindexList/ExchangeContent/BaseExchange';
import CrossExchange from '@/components/Home/ZindexList/ExchangeContent/CrossExchange';
import CnyCenterExchange from '@/components/Home/ZindexList/ExchangeContent/CnyCenterExchange';
import CnyMixExchange from '@/components/Home/ZindexList/ExchangeContent/CnyMixExchange';
import styles from './index.scss';

interface ExchangeContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const ExchangeContent: React.FC<ExchangeContentProps> = (props) => {
  return (
    <CustomDrawerContent title="外汇" enterText="确定" onClose={props.onClose} onEnter={props.onEnter}>
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
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="人民币汇率中间价" key={String(0)}>
              <CnyCenterExchange />
            </Tabs.TabPane>
            <Tabs.TabPane tab="人民币即期混合" key={String(1)}>
              <CnyMixExchange />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </CustomDrawerContent>
  );
};

export default ExchangeContent;
