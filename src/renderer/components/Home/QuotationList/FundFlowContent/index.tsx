import React from 'react';
import { Tabs } from 'antd';

import ChartCard from '@/components/Card/ChartCard';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import Industry from '@/components/Home/QuotationList/FundFlowContent/Industry';
import Concept from '@/components/Home/QuotationList/FundFlowContent/Concept';
import Area from '@/components/Home/QuotationList/FundFlowContent/Area';
import NorthFlow from '@/components/Home/QuotationList/FundFlowContent/NorthFlow';
import SouthFlow from '@/components/Home/QuotationList/FundFlowContent/SouthFlow';
import NorthDay from '@/components/Home/QuotationList/FundFlowContent/NorthDay';
import SouthDay from '@/components/Home/QuotationList/FundFlowContent/SouthDay';

import * as Enums from '@/utils/enums';
import styles from './index.scss';

export interface DetailFundContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const FundFlowContent: React.FC<DetailFundContentProps> = (props) => {
  return (
    <CustomDrawerContent
      title="板块资金流"
      enterText="确定"
      onClose={props.onClose}
      onEnter={props.onEnter}
    >
      <div className={styles.content}>
        <div className={styles.container}>
          <Tabs
            defaultActiveKey={String(0)}
            animated={{ tabPane: true }}
            tabBarGutter={15}
          >
            <Tabs.TabPane tab="北向资金" key={String(0)}>
              <ChartCard>
                <NorthFlow />
              </ChartCard>
            </Tabs.TabPane>
            <Tabs.TabPane tab="南向资金" key={String(1)}>
              <ChartCard>
                <SouthFlow />
              </ChartCard>
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs
            defaultActiveKey={String(0)}
            animated={{ tabPane: true }}
            tabBarGutter={15}
          >
            <Tabs.TabPane tab="北向日线" key={String(0)}>
              <ChartCard>
                <NorthDay />
              </ChartCard>
            </Tabs.TabPane>
            <Tabs.TabPane tab="南向日线" key={String(1)}>
              <ChartCard>
                <SouthDay />
              </ChartCard>
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs
            defaultActiveKey={String(Enums.TrendType.Performance)}
            animated={{ tabPane: true }}
            tabBarGutter={15}
          >
            <Tabs.TabPane
              tab="行业资金流"
              key={String(Enums.TrendType.Performance)}
            >
              <ChartCard>
                <Industry />
              </ChartCard>
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs
            defaultActiveKey={String(Enums.HistoryType.Performance)}
            animated={{ tabPane: true }}
            tabBarGutter={15}
          >
            <Tabs.TabPane
              tab="概念资金流"
              key={String(Enums.HistoryType.Performance)}
            >
              <ChartCard>
                <Concept />
              </ChartCard>
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs
            defaultActiveKey={String(Enums.WareHouseType.Stock)}
            animated={{ tabPane: true }}
            tabBarGutter={15}
          >
            <Tabs.TabPane
              tab="地域资金流"
              key={String(Enums.WareHouseType.Stock)}
            >
              <ChartCard>
                <Area />
              </ChartCard>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </CustomDrawerContent>
  );
};
export default FundFlowContent;
