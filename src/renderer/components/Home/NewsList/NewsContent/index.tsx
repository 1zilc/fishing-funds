import React from 'react';
import { Tabs } from 'antd';

import FocusList from '@/components/Home/NewsList/NewsContent/FocusList';
import LiveList from '@/components/Home/NewsList/NewsContent/LiveList';
import ListedList from '@/components/Home/NewsList/NewsContent/ListedList';
import GlobalList from '@/components/Home/NewsList/NewsContent/GlobalList';
import GoodsList from '@/components/Home/NewsList/NewsContent/GoodsList';
import ExchangeList from '@/components/Home/NewsList/NewsContent/ExchangeList';
import BondList from '@/components/Home/NewsList/NewsContent/BondList';
import FundList from '@/components/Home/NewsList/NewsContent/FundList';
import ChinaList from '@/components/Home/NewsList/NewsContent/ChinaList';
import UsaList from '@/components/Home/NewsList/NewsContent/UsaList';
import EuList from '@/components/Home/NewsList/NewsContent/EuList';
import UkList from '@/components/Home/NewsList/NewsContent/UkList';
import JpList from '@/components/Home/NewsList/NewsContent/JpList';
import CustomDrawer from '@/components/CustomDrawer';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import ViewerContent from '@/components/ViewerContent';
import { useDrawer } from '@/utils/hooks';
import styles from './index.module.scss';

interface NewsContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const NewsContent: React.FC<NewsContentProps> = (props) => {
  const { data: viewerData, show: showViewerDataDrawer, set: setViewerDataDrawer, close: closeViewerDataDrawer } = useDrawer({ url: '' });

  return (
    <CustomDrawerContent title="新闻动态" enterText="确定" onEnter={props.onEnter} onClose={props.onClose}>
      <div className={styles.content}>
        <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
          <Tabs.TabPane tab="焦点" key={String(0)}>
            <FocusList onView={(url) => setViewerDataDrawer({ url })} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="股市直播" key={String(1)}>
            <LiveList onView={(url) => setViewerDataDrawer({ url })} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="上市公司" key={String(2)}>
            <ListedList onView={(url) => setViewerDataDrawer({ url })} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="全球直播" key={String(3)}>
            <GlobalList onView={(url) => setViewerDataDrawer({ url })} />
          </Tabs.TabPane>
        </Tabs>
        <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
          <Tabs.TabPane tab="商品" key={String(0)}>
            <GoodsList onView={(url) => setViewerDataDrawer({ url })} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="外汇" key={String(1)}>
            <ExchangeList onView={(url) => setViewerDataDrawer({ url })} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="债券" key={String(2)}>
            <BondList onView={(url) => setViewerDataDrawer({ url })} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="基金" key={String(3)}>
            <FundList onView={(url) => setViewerDataDrawer({ url })} />
          </Tabs.TabPane>
        </Tabs>
        <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
          <Tabs.TabPane tab="中国央行" key={String(0)}>
            <ChinaList onView={(url) => setViewerDataDrawer({ url })} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="美联储" key={String(1)}>
            <UsaList onView={(url) => setViewerDataDrawer({ url })} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="欧洲" key={String(2)}>
            <EuList onView={(url) => setViewerDataDrawer({ url })} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="英国" key={String(3)}>
            <UkList onView={(url) => setViewerDataDrawer({ url })} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="日本" key={String(4)}>
            <JpList onView={(url) => setViewerDataDrawer({ url })} />
          </Tabs.TabPane>
        </Tabs>
      </div>
      <CustomDrawer show={showViewerDataDrawer}>
        <ViewerContent {...viewerData} title="新闻详情" phone onClose={closeViewerDataDrawer} onEnter={closeViewerDataDrawer} />
      </CustomDrawer>
    </CustomDrawerContent>
  );
};

export default NewsContent;
