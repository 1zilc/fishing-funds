import React from 'react';
import { Tabs } from 'antd';

import MainRank from '@/components/Home/CoinList/CoinRankingContent/MainRank';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import styles from './index.module.scss';

export interface CoinRankingContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const CoinRankingContent: React.FC<CoinRankingContentProps> = (props) => {
  return (
    <CustomDrawerContent title="货币榜" enterText="确定" onEnter={props.onEnter} onClose={props.onClose}>
      <div className={styles.content}>
        <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
          <Tabs.TabPane tab="排行榜" key={String(0)}>
            <MainRank />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </CustomDrawerContent>
  );
};

export default CoinRankingContent;
