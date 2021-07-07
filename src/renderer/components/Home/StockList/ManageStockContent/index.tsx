import React, { useState } from 'react';
import { Tabs } from 'antd';

import PureCard from '@/components/Card/PureCard';
import Optional from '@/components/Home/StockList/ManageStockContent/Optional';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import styles from './index.scss';

export interface ManageStockContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const ManageStockContent: React.FC<ManageStockContentProps> = (props) => {
  const [activeKey, setActiveKey] = useState(String(0));

  return (
    <CustomDrawerContent
      title="管理股票"
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
          <Tabs.TabPane tab="自选股票" key={String(0)}>
            <Optional active={activeKey === String(0)} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </CustomDrawerContent>
  );
};

export default ManageStockContent;
