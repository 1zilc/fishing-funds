import React from 'react';
import { Tabs } from 'antd';

import CustomDrawerContent from '@/components/CustomDrawer/Content';

import ClosedCalendar from '@/components/Home/StockList/EconomicCalendarContent/ClosedCalendar';
import Metting from '@/components/Home/StockList/EconomicCalendarContent/Metting';
import styles from './index.module.scss';

interface EconomicCalendarContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const EconomicCalendarContent: React.FC<EconomicCalendarContentProps> = (props) => {
  return (
    <CustomDrawerContent title="财经日历" enterText="确定" onClose={props.onClose} onEnter={props.onEnter}>
      <div className={styles.content}>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="休市安排" key={String(0)}>
              <ClosedCalendar />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="财经会议" key={String(0)}>
              <Metting code="1" />
            </Tabs.TabPane>
            <Tabs.TabPane tab="重要经济数据" key={String(1)}>
              <Metting code="2" />
            </Tabs.TabPane>
            <Tabs.TabPane tab="其他" key={String(2)}>
              <Metting code="3" />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </CustomDrawerContent>
  );
};

export default EconomicCalendarContent;
