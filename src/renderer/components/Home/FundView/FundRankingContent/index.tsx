import React from 'react';
import { Tabs } from 'antd';

import Automatic from '@/components/Home/FundView/FundRankingContent/Automatic';
import Rank from '@/components/Home/FundView/FundRankingContent/Rank';
import Ranting from '@/components/Home/FundView/FundRankingContent/Ranting';
import Today from '@/components/Home/FundView/FundRankingContent/Today';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import styles from './index.module.scss';
import { children } from 'cheerio/lib/api/traversing';

export interface FundRankingContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const FundRankingContent: React.FC<FundRankingContentProps> = (props) => {
  return (
    <CustomDrawerContent title="基金榜" enterText="确定" onEnter={props.onEnter} onClose={props.onClose}>
      <div className={styles.content}>
        <Tabs
          animated={{ tabPane: true }}
          tabBarGutter={15}
          items={[
            {
              key: String(0),
              label: '今日榜',
              children: <Today />,
            },
            {
              key: String(1),
              label: '近期榜',
              children: <Rank />,
            },
            {
              key: String(2),
              label: '定投榜',
              children: <Automatic />,
            },
            {
              key: String(3),
              label: '评级榜',
              children: <Ranting />,
            },
          ]}
        />
      </div>
    </CustomDrawerContent>
  );
};

export default FundRankingContent;
