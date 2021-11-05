import React, { useState } from 'react';
import { Tabs } from 'antd';

import Optional from '@/components/Home/CoinList/ManageCoinContent/Optional';
import MainRank from '@/components/Home/CoinList/ManageCoinContent/MainRank';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import styles from './index.module.scss';

export interface ManageStockContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const ManageStockContent: React.FC<ManageStockContentProps> = (props) => {
  return (
    <CustomDrawerContent title="管理货币" enterText="确定" onEnter={props.onEnter} onClose={props.onClose}>
      <div className={styles.content}>
        <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
          <Tabs.TabPane tab="自选货币" key={String(0)}>
            <Optional />
          </Tabs.TabPane>
          <Tabs.TabPane tab="排行榜" key={String(1)}>
            <MainRank />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </CustomDrawerContent>
  );
};

export default ManageStockContent;
