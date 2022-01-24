import React from 'react';
import { Tabs } from 'antd';

import Economy from '@/components/Home/ZindexList/EconomicDataContent/Economy';
import FinancialStatistics from '@/components/Home/ZindexList/EconomicDataContent/FinancialStatistics';
import TreasuryYield from '@/components/Home/ZindexList/EconomicDataContent/TreasuryYield';
import NationalTeam from '@/components/Home/ZindexList/EconomicDataContent/NationalTeam';
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
        <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
          <Tabs.TabPane tab="经济指数" key={String(0)}>
            <Economy />
          </Tabs.TabPane>
          <Tabs.TabPane tab="财政统计" key={String(1)}>
            <FinancialStatistics />
          </Tabs.TabPane>
          <Tabs.TabPane tab="国家队持股数据" key={String(2)}>
            <NationalTeam />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </CustomDrawerContent>
  );
};

export default EconomicDataContent;
