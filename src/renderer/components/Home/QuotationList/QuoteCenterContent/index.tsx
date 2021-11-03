import React, { useState } from 'react';
import { Tabs } from 'antd';
import { useRequest } from 'ahooks';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import ChartCard from '@/components/Card/ChartCard';
import Capacity from '@/components/Home/QuotationList/QuoteCenterContent/Capacity';
import MarketStyle from '@/components/Home/QuotationList/QuoteCenterContent/MarketStyle';
import Recommend from '@/components/Home/QuotationList/QuoteCenterContent/Recommend';
import * as Services from '@/services';
import styles from './index.module.scss';

interface QuoteCenterContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const QuoteCenterContent: React.FC<QuoteCenterContentProps> = (props) => {
  const [data, setData] = useState({
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
  });

  const { run: runGetQuoteCenterFromEastmoney } = useRequest(Services.Quotation.GetQuoteCenterFromEastmoney, {
    throwOnError: true,
    onSuccess: setData,
  });

  return (
    <CustomDrawerContent title="行情中心" enterText="确定" onClose={props.onClose} onEnter={props.onEnter}>
      <div className={styles.content}>
        <ChartCard
          auto
          onFresh={runGetQuoteCenterFromEastmoney}
          TitleBar={<span className={styles.cardTitle}>建议仓位 {data.TopText.PositionInd}%</span>}
        >
          <Capacity TopText={data.TopText} />
        </ChartCard>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            {data.MarketStyle.map((m) => (
              <Tabs.TabPane tab={m.Category} key={m.Category}>
                <ChartCard auto onFresh={runGetQuoteCenterFromEastmoney}>
                  <MarketStyle ThemeList={m.ThemeList} />
                </ChartCard>
              </Tabs.TabPane>
            ))}
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            {data.Recommend.map((r) => (
              <Tabs.TabPane tab={r.Title} key={r.Title}>
                <Recommend ThemeList={r.ThemeList} />
              </Tabs.TabPane>
            ))}
          </Tabs>
        </div>
      </div>
      <div className={styles.footer}>
        <div>仅供参考，不构成投资建议</div>
      </div>
    </CustomDrawerContent>
  );
};

export default QuoteCenterContent;
