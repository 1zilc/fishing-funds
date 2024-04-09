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
        <Tabs
          animated={{ tabPane: true }}
          tabBarGutter={15}
          items={[
            {
              key: String(0),
              label: '个股',
              children: (
                <PureCard>
                  <SelfRank />
                </PureCard>
              ),
            },
            {
              key: String(1),
              label: '北向',
              children: (
                <PureCard>
                  <NorthRank />
                </PureCard>
              ),
            },
            {
              key: String(2),
              label: '主力',
              children: (
                <PureCard>
                  <MainRank />
                </PureCard>
              ),
            },
          ]}
        />
      </div>
    </CustomDrawerContent>
  );
};

export default StockRankingContent;
