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
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import { useOpenWebView } from '@/utils/hooks';
import styles from './index.module.scss';

interface NewsContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const NewsContent: React.FC<NewsContentProps> = (props) => {
  const openWebView = useOpenWebView({ title: '新闻详情', phone: true });

  return (
    <CustomDrawerContent title="新闻动态" enterText="确定" onEnter={props.onEnter} onClose={props.onClose}>
      <div className={styles.content}>
        <Tabs
          animated={{ tabPane: true }}
          tabBarGutter={15}
          items={[
            {
              key: String(0),
              label: '焦点',
              children: <FocusList onView={openWebView} />,
            },
            {
              key: String(1),
              label: '股市直播',
              children: <LiveList onView={openWebView} />,
            },
            {
              key: String(2),
              label: '上市公司',
              children: <ListedList onView={openWebView} />,
            },
            {
              key: String(3),
              label: '全球直播',
              children: <GlobalList onView={openWebView} />,
            },
          ]}
        />

        <Tabs
          animated={{ tabPane: true }}
          tabBarGutter={15}
          items={[
            {
              key: String(0),
              label: '商品',
              children: <GoodsList onView={openWebView} />,
            },
            {
              key: String(1),
              label: '外汇',
              children: <ExchangeList onView={openWebView} />,
            },
            {
              key: String(2),
              label: '债券',
              children: <BondList onView={openWebView} />,
            },
            {
              key: String(3),
              label: '基金',
              children: <FundList onView={openWebView} />,
            },
          ]}
        />
        <Tabs
          animated={{ tabPane: true }}
          tabBarGutter={15}
          items={[
            {
              key: String(0),
              label: '中国央行',
              children: <ChinaList onView={openWebView} />,
            },
            {
              key: String(1),
              label: '美联储',
              children: <UsaList onView={openWebView} />,
            },
            {
              key: String(2),
              label: '欧洲',
              children: <EuList onView={openWebView} />,
            },
            {
              key: String(3),
              label: '英国',
              children: <UkList onView={openWebView} />,
            },
            {
              key: String(4),
              label: '日本',
              children: <JpList onView={openWebView} />,
            },
          ]}
        />
      </div>
    </CustomDrawerContent>
  );
};

export default NewsContent;
