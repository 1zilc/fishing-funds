import React from 'react';
import { Tabs } from 'antd';

import CustomDrawerContent from '@/components/CustomDrawer/Content';

import ClosedCalendar from '@/components/Home/StockView/EconomicCalendarContent/ClosedCalendar';
import Metting from '@/components/Home/StockView/EconomicCalendarContent/Metting';
import styles from './index.module.css';

interface EconomicCalendarContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const EconomicCalendarContent: React.FC<EconomicCalendarContentProps> = (props) => {
  return (
    <CustomDrawerContent title="财经日历" enterText="确定" onClose={props.onClose} onEnter={props.onEnter}>
      <div className={styles.content}>
        <div className={styles.container}>
          <Tabs
            animated={{ tabPane: true }}
            tabBarGutter={15}
            items={[
              {
                key: String(0),
                label: '休市安排',
                children: <ClosedCalendar />,
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
                label: '财经会议',
                children: <Metting code="1" />,
              },
              {
                key: String(1),
                label: '重要经济数据',
                children: <Metting code="2" />,
              },
              {
                key: String(2),
                label: '其他',
                children: <Metting code="3" />,
              },
            ]}
          />
        </div>
      </div>
    </CustomDrawerContent>
  );
};

export default EconomicCalendarContent;
