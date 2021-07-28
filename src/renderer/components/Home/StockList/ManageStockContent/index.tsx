import React, { useState } from 'react';
import { Tabs } from 'antd';

import PureCard from '@/components/Card/PureCard';
import Optional from '@/components/Home/StockList/ManageStockContent/Optional';
import SelfRank from '@/components/Home/StockList/ManageStockContent/SelfRank';
import MainRank from '@/components/Home/StockList/ManageStockContent/MainRank';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import styles from './index.scss';

export interface ManageStockContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const ManageStockContent: React.FC<ManageStockContentProps> = (props) => {
  return (
    <CustomDrawerContent title="管理股票" enterText="确定" onEnter={props.onEnter} onClose={props.onClose}>
      <div className={styles.content}>
        <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
          <Tabs.TabPane tab="自选股票" key={String(0)}>
            <Optional />
          </Tabs.TabPane>
          <Tabs.TabPane tab="个股资金流" key={String(1)}>
            <PureCard>
              <SelfRank />
            </PureCard>
          </Tabs.TabPane>
          <Tabs.TabPane tab="主力排名" key={String(2)}>
            <PureCard>
              <MainRank />
            </PureCard>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </CustomDrawerContent>
  );
};

export default ManageStockContent;
