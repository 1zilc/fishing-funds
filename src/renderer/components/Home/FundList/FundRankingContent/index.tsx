import React from 'react';
import { Tabs } from 'antd';

import Automatic from '@/components/Home/FundList/FundRankingContent/Automatic';
import Rank from '@/components/Home/FundList/FundRankingContent/Rank';
import Ranting from '@/components/Home/FundList/FundRankingContent/Ranting';
import Today from '@/components/Home/FundList/FundRankingContent/Today';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import styles from './index.module.scss';

export interface FundRankingContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const FundRankingContent: React.FC<FundRankingContentProps> = (props) => {
  return (
    <CustomDrawerContent title="基金榜" enterText="确定" onEnter={props.onEnter} onClose={props.onClose}>
      <div className={styles.content}>
        <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
          <Tabs.TabPane tab="今日榜" key={String(0)}>
            <Today />
          </Tabs.TabPane>
          <Tabs.TabPane tab="近期榜" key={String(1)}>
            <Rank />
          </Tabs.TabPane>
          <Tabs.TabPane tab="定投榜" key={String(2)}>
            <Automatic />
          </Tabs.TabPane>
          <Tabs.TabPane tab="评级榜" key={String(3)}>
            <Ranting />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </CustomDrawerContent>
  );
};

export default FundRankingContent;
