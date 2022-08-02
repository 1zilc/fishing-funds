import React from 'react';
import { Tabs } from 'antd';

import ChartCard from '@/components/Card/ChartCard';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import Industry from '@/components/Home/QuotationView/FundFlowContent/Industry';
import Concept from '@/components/Home/QuotationView/FundFlowContent/Concept';
import Area from '@/components/Home/QuotationView/FundFlowContent/Area';
import NorthFlow from '@/components/Home/QuotationView/FundFlowContent/NorthFlow';
import SouthFlow from '@/components/Home/QuotationView/FundFlowContent/SouthFlow';
import NorthDay from '@/components/Home/QuotationView/FundFlowContent/NorthDay';
import SouthDay from '@/components/Home/QuotationView/FundFlowContent/SouthDay';
import QuotationMap from '@/components/Home/QuotationView/FundFlowContent/QuotationMap';
import Geography from '@/components/Home/QuotationView/FundFlowContent/Geography';
import Estimate from '@/components/Home/QuotationView/FundFlowContent/Estimate';

import * as Enums from '@/utils/enums';
import styles from './index.module.scss';

export interface DetailFundContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const FundFlowContent: React.FC<DetailFundContentProps> = (props) => {
  return (
    <CustomDrawerContent title="板块资金流" enterText="确定" onClose={props.onClose} onEnter={props.onEnter}>
      <div className={styles.content}>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="两市主力" key={String(0)}>
              <Estimate code="0.899001" />
            </Tabs.TabPane>
            <Tabs.TabPane tab="上证" key={String(1)}>
              <Estimate code="1.000001" />
            </Tabs.TabPane>
            <Tabs.TabPane tab="深成" key={String(2)}>
              <Estimate code="0.399001" />
            </Tabs.TabPane>
            <Tabs.TabPane tab="创业板" key={String(3)}>
              <Estimate code="0.399006" />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15} destroyInactiveTabPane>
            <Tabs.TabPane tab="行业概览" key={String(0)}>
              <QuotationMap type={Enums.QuotationType.Industry} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="概念概览" key={String(1)}>
              <QuotationMap type={Enums.QuotationType.Concept} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="地域概览" key={String(2)}>
              <QuotationMap type={Enums.QuotationType.Area} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="地图概览" key={String(3)}>
              <ChartCard>
                <Geography />
              </ChartCard>
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="北向资金" key={String(0)}>
              <NorthFlow />
            </Tabs.TabPane>
            <Tabs.TabPane tab="北向日线" key={String(1)}>
              <NorthDay />
            </Tabs.TabPane>
            <Tabs.TabPane tab="南向资金" key={String(2)}>
              <SouthFlow />
            </Tabs.TabPane>
            <Tabs.TabPane tab="南向日线" key={String(3)}>
              <SouthDay />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="行业资金流" key={String(0)}>
              <Industry />
            </Tabs.TabPane>
            <Tabs.TabPane tab="概念资金流" key={String(1)}>
              <Concept />
            </Tabs.TabPane>
            <Tabs.TabPane tab="地域资金流" key={String(2)}>
              <Area />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </CustomDrawerContent>
  );
};
export default FundFlowContent;
