import React, { useState } from 'react';
import { Tabs } from 'antd';

import PureCard from '@/components/Card/PureCard';
import SelfRank from '@/components/Home/StockView/StockRankingContent/SelfRank';
import MainRank from '@/components/Home/StockView/StockRankingContent/MainRank';
import NorthRank from '@/components/Home/StockView/StockRankingContent/NorthRank';
import StockRank from '@/components/Home/StockView/StockRankingContent/StockRank';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import styles from './index.module.css';

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
              label: '沪深京',
              children: (
                <PureCard>
                  <StockRank fsCode="m:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23,m:0+t:81+s:2048" />
                </PureCard>
              ),
            },
            {
              key: String(1),
              label: '创业',
              children: (
                <PureCard>
                  <StockRank fsCode="m:0+t:80" />
                </PureCard>
              ),
            },
            {
              key: String(2),
              label: '科创',
              children: (
                <PureCard>
                  <StockRank fsCode="m:1+t:23" />
                </PureCard>
              ),
            },
            {
              key: String(3),
              label: '新股',
              children: (
                <PureCard>
                  <StockRank fsCode="m:0+f:8,m:1+f:8" />
                </PureCard>
              ),
            },
            {
              key: String(4),
              label: '上证',
              children: (
                <PureCard>
                  <StockRank fsCode="m:1+t:2,m:1+t:23" />
                </PureCard>
              ),
            },
            {
              key: String(5),
              label: '深证',
              children: (
                <PureCard>
                  <StockRank fsCode="m:0+t:6,m:0+t:80" />
                </PureCard>
              ),
            },
            {
              key: String(6),
              label: '北证',
              children: (
                <PureCard>
                  <StockRank fsCode="m:0+t:81+s:2048" />
                </PureCard>
              ),
            },
            {
              key: String(-1),
              label: '个股',
              children: (
                <PureCard>
                  <SelfRank />
                </PureCard>
              ),
            },
            {
              key: String(-2),
              label: '北向',
              children: (
                <PureCard>
                  <NorthRank />
                </PureCard>
              ),
            },
            {
              key: String(-3),
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
