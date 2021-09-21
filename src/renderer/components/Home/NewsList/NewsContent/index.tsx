import React, { useState } from 'react';
import { Tabs } from 'antd';

import PureCard from '@/components/Card/PureCard';
import FocusList from '@/components/Home/NewsList/NewsContent/FocusList';
import LiveList from '@/components/Home/NewsList/NewsContent/LiveList';
import ListedList from '@/components/Home/NewsList/NewsContent/ListedList';
import GlobalList from '@/components/Home/NewsList/NewsContent/GlobalList';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import styles from './index.scss';

interface NewsContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const NewsContent: React.FC<NewsContentProps> = (props) => {
  return (
    <CustomDrawerContent title="新闻动态" enterText="确定" onEnter={props.onEnter} onClose={props.onClose}>
      <div className={styles.content}>
        <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
          <Tabs.TabPane tab="焦点" key={String(0)}>
            <PureCard>
              <FocusList />
            </PureCard>
          </Tabs.TabPane>
          <Tabs.TabPane tab="股市直播" key={String(1)}>
            <PureCard>
              <LiveList />
            </PureCard>
          </Tabs.TabPane>
          <Tabs.TabPane tab="上市公司" key={String(2)}>
            <PureCard>
              <ListedList />
            </PureCard>
          </Tabs.TabPane>
          <Tabs.TabPane tab="全球直播" key={String(3)}>
            <PureCard>
              <GlobalList />
            </PureCard>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </CustomDrawerContent>
  );
};

export default NewsContent;
