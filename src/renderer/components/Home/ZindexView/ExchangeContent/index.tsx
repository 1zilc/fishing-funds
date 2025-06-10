import React from 'react';
import { Tabs } from 'antd';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import Offshore from '@/components/Home/ZindexView/ExchangeContent/Offshore';
import BaseExchange from '@/components/Home/ZindexView/ExchangeContent/BaseExchange';
import CrossExchange from '@/components/Home/ZindexView/ExchangeContent/CrossExchange';
import CnyCenterExchange from '@/components/Home/ZindexView/ExchangeContent/CnyCenterExchange';
import CnyMixExchange from '@/components/Home/ZindexView/ExchangeContent/CnyMixExchange';
import GlobalBond from '@/components/Home/ZindexView/ExchangeContent/GlobalBond';
import styles from './index.module.css';

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
          <Tabs
            animated={{ tabPane: true }}
            tabBarGutter={15}
            items={[
              {
                key: String(0),
                label: '基本汇率',
                children: <BaseExchange />,
              },
              {
                key: String(1),
                label: '交叉汇率',
                children: <CrossExchange />,
              },
              {
                key: String(2),
                label: '中间价',
                children: <CnyCenterExchange />,
              },
              {
                key: String(3),
                label: '即期混合',
                children: <CnyMixExchange />,
              },
            ]}
          />
        </div>
        <div className={styles.container}>
          <Tabs
            animated={{ tabPane: true }}
            tabBarGutter={15}
            items={[
              {
                key: String(0),
                label: '全球债券',
                children: <GlobalBond />,
              },
            ]}
          />
        </div>
      </div>
    </CustomDrawerContent>
  );
};

export default ExchangeContent;
