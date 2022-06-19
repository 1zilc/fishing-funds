import React, { useState } from 'react';
import { Tabs } from 'antd';

import PureCard from '@/components/Card/PureCard';
import SelfRank from '@/components/Home/StockView/StockRankingContent/SelfRank';
import MainRank from '@/components/Home/StockView/StockRankingContent/MainRank';
import NorthRank from '@/components/Home/StockView/StockRankingContent/NorthRank';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import styles from './index.module.scss';

export interface StockRankingContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const StockRankingContent: React.FC<StockRankingContentProps> = (props) => {
  return (
    <CustomDrawerContent title="股票榜" enterText="确定" onEnter={props.onEnter} onClose={props.onClose}>
      <div className={styles.content}>
        <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
          <Tabs.TabPane tab="个股资金流" key={String(0)}>
            <PureCard>
              <SelfRank />
            </PureCard>
          </Tabs.TabPane>
          <Tabs.TabPane tab="北向排名" key={String(1)}>
            <PureCard>
              <NorthRank />
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

export default StockRankingContent;
