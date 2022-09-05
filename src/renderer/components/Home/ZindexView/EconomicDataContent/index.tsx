import React from 'react';
import { Tabs } from 'antd';

import Economy from '@/components/Home/ZindexView/EconomicDataContent/Economy';
import FinancialStatistics from '@/components/Home/ZindexView/EconomicDataContent/FinancialStatistics';
import TreasuryYield from '@/components/Home/ZindexView/EconomicDataContent/TreasuryYield';
import NationalTeam from '@/components/Home/ZindexView/EconomicDataContent/NationalTeam';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import styles from './index.module.scss';

export interface EconomicDataContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const EconomicDataContent: React.FC<EconomicDataContentProps> = (props) => {
  return (
    <CustomDrawerContent title="经济数据" enterText="确定" onEnter={props.onEnter} onClose={props.onClose}>
      <div className={styles.content}>
        <TreasuryYield />
        <Tabs
          animated={{ tabPane: true }}
          tabBarGutter={15}
          items={[
            {
              key: String(0),
              label: '经济指数',
              children: <Economy />,
            },
            {
              key: String(1),
              label: '财政统计',
              children: <FinancialStatistics />,
            },
            {
              key: String(2),
              label: '国家队持股数据',
              children: <NationalTeam />,
            },
          ]}
        />
      </div>
    </CustomDrawerContent>
  );
};

export default EconomicDataContent;
