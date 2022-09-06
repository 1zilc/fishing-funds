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
          <Tabs
            animated={{ tabPane: true }}
            tabBarGutter={15}
            items={[
              {
                key: String(0),
                label: '两市主力',
                children: <Estimate code="0.899001" />,
              },
              {
                key: String(1),
                label: '上证',
                children: <Estimate code="1.000001" />,
              },
              {
                key: String(2),
                label: '深成',
                children: <Estimate code="0.399001" />,
              },
              {
                key: String(3),
                label: '创业板',
                children: <Estimate code="0.399006" />,
              },
            ]}
          />
        </div>
        <div className={styles.container}>
          <Tabs
            animated={{ tabPane: true }}
            tabBarGutter={15}
            destroyInactiveTabPane
            items={[
              {
                key: String(0),
                label: '行业概览',
                children: <QuotationMap type={Enums.QuotationType.Industry} />,
              },
              {
                key: String(1),
                label: '概念概览',
                children: <QuotationMap type={Enums.QuotationType.Concept} />,
              },
              {
                key: String(2),
                label: '地域概览',
                children: <QuotationMap type={Enums.QuotationType.Area} />,
              },
              {
                key: String(3),
                label: '地图概览',
                children: (
                  <ChartCard>
                    <Geography />
                  </ChartCard>
                ),
              },
            ]}
          />
        </div>
        <div className={styles.container}>
          <Tabs
            animated={{ tabPane: true }}
            tabBarGutter={15}
            items={[
              {
                key: String(0),
                label: '北向资金',
                children: <NorthFlow />,
              },
              {
                key: String(1),
                label: '北向日线',
                children: <NorthDay />,
              },
              {
                key: String(2),
                label: '南向资金',
                children: <SouthFlow />,
              },
              {
                key: String(3),
                label: '南向日线',
                children: <SouthDay />,
              },
            ]}
          />
        </div>
        <div className={styles.container}>
          <Tabs
            animated={{ tabPane: true }}
            tabBarGutter={15}
            items={[
              {
                key: String(0),
                label: '行业资金流',
                children: <Industry />,
              },
              {
                key: String(1),
                label: '概念资金流',
                children: <Concept />,
              },
              {
                key: String(2),
                label: '地域资金流',
                children: <Area />,
              },
            ]}
          />
        </div>
      </div>
    </CustomDrawerContent>
  );
};
export default FundFlowContent;
