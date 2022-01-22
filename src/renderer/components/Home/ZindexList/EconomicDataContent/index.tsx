import React from 'react';
import { Tabs } from 'antd';

import Economy from '@/components/Home/ZindexList/EconomicDataContent/Economy';
import FinancialStatistics from '@/components/Home/ZindexList/EconomicDataContent/FinancialStatistics';
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
        <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
          <Tabs.TabPane tab="经济指数" key={String(0)}>
            <Economy />
          </Tabs.TabPane>
          <Tabs.TabPane tab="财政统计" key={String(1)}>
            <FinancialStatistics />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </CustomDrawerContent>
  );
};

export default EconomicDataContent;
