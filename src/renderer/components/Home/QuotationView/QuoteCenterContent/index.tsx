import React, { useState } from 'react';
import { Tabs } from 'antd';
import { useRequest } from 'ahooks';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import ChartCard from '@/components/Card/ChartCard';
import Capacity from '@/components/Home/QuotationView/QuoteCenterContent/Capacity';
import MarketStyle from '@/components/Home/QuotationView/QuoteCenterContent/MarketStyle';
import Recommend from '@/components/Home/QuotationView/QuoteCenterContent/Recommend';
import TodayHot from '@/components/Home/QuotationView/QuoteCenterContent/TodayHot';
import HotTheme from '@/components/Home/QuotationView/QuoteCenterContent/HotTheme';
import RecentHot from '@/components/Home/QuotationView/QuoteCenterContent/RecentHot';
import * as Services from '@lib/enh/services';
import styles from './index.module.css';

interface QuoteCenterContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const QuoteCenterContent: React.FC<QuoteCenterContentProps> = (props) => {
  const {
    data = {
      TopText: {
        PositionInd: 0,
        Title: '',
        Content: '',
      },
      MarketStyle: [] as {
        Category: '权重';
        ThemeList: {
          Code: string;
          Name: string;
          IsImportant: string;
          TopCode: string;
          TopName: string;
          DayType: 1;
          Chg: string;
          HotRate: number;
        }[];
      }[],
      Recommend: [] as {
        Title: string;
        DefaultText: string;
        ThemeList: {
          Code: string;
          Name: string;
          Chg: string;
          TopCode: '';
          TopName: '';
          IsImportant: '0';
          Reason: string;
          StockList: {
            Code: string;
            Name: string;
            Market: string;
            Chg: string;
          }[];
        }[];
      }[],
    },
    run: runGetQuoteCenterFromEastmoney,
  } = useRequest(Services.Quotation.GetQuoteCenterFromEastmoney);

  return (
    <CustomDrawerContent title="行情中心" enterText="确定" onClose={props.onClose} onEnter={props.onEnter}>
      <div className={styles.content}>
        <div className={styles.container}>
          <Tabs
            animated={{ tabPane: true }}
            tabBarGutter={15}
            items={[
              {
                key: String(0),
                label: '建议仓位',
                children: (
                  <ChartCard
                    auto
                    onFresh={runGetQuoteCenterFromEastmoney}
                    TitleBar={<span className={styles.cardTitle}>建议仓位 {data.TopText.PositionInd}%</span>}
                  >
                    <Capacity TopText={data.TopText} />
                  </ChartCard>
                ),
              },
              {
                key: String(1),
                label: '今日机会',
                children: <TodayHot />,
              },
              {
                key: String(2),
                label: '近期热点',
                children: <RecentHot />,
              },
              {
                key: String(3),
                label: '热门主题',
                children: <HotTheme />,
              },
            ]}
          />
        </div>
        <div className={styles.container}>
          <Tabs
            animated={{ tabPane: true }}
            tabBarGutter={15}
            items={data.MarketStyle.map((m) => ({
              key: m.Category,
              label: m.Category,
              children: (
                <ChartCard auto onFresh={runGetQuoteCenterFromEastmoney}>
                  <MarketStyle ThemeList={m.ThemeList} />
                </ChartCard>
              ),
            }))}
          />
        </div>
        <div className={styles.container}>
          <Tabs
            animated={{ tabPane: true }}
            tabBarGutter={15}
            items={data.Recommend.map((r) => ({
              key: r.Title,
              label: r.Title,
              children: <Recommend ThemeList={r.ThemeList} />,
            }))}
          />
        </div>
      </div>
      <div className={styles.footer}>
        <div>仅供参考，不构成投资建议</div>
      </div>
    </CustomDrawerContent>
  );
};

export default QuoteCenterContent;
