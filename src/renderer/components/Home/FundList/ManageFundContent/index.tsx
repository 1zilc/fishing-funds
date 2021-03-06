import React, { useState } from 'react';
import { Tabs } from 'antd';

import PureCard from '@/components/Card/PureCard';
import Optional from '@/components/Home/FundList/ManageFundContent/Optional';
import Automatic from '@/components/Home/FundList/ManageFundContent/Automatic';
import Rank from '@/components/Home/FundList/ManageFundContent/Rank';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import styles from './index.scss';

export interface ManageFundContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const ManageFundContent: React.FC<ManageFundContentProps> = (props) => {
  const [activeKey, setActiveKey] = useState(String(0));

  return (
    <CustomDrawerContent
      title="管理基金"
      enterText="确定"
      onEnter={props.onEnter}
      onClose={props.onClose}
    >
      <div className={styles.content}>
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          animated={{ tabPane: true }}
          tabBarGutter={15}
        >
          <Tabs.TabPane tab="自选基金" key={String(0)}>
            <Optional active={activeKey === String(0)} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="近期好基" key={String(1)}>
            <PureCard>
              <Rank />
            </PureCard>
          </Tabs.TabPane>
          <Tabs.TabPane tab="定投排行" key={String(2)}>
            <PureCard>
              <Automatic />
            </PureCard>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </CustomDrawerContent>
  );
};

export default ManageFundContent;
