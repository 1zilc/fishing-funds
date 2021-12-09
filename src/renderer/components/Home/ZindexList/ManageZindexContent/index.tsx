import React from 'react';
import { Tabs } from 'antd';

import Optional from '@/components/Home/ZindexList/ManageZindexContent/Optional';
import Economy from '@/components/Home/ZindexList/ManageZindexContent/Economy';
import FinancialStatistics from '@/components/Home/ZindexList/ManageZindexContent/FinancialStatistics';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import styles from './index.module.scss';

export interface ManageZindexContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const ManageZindexContent: React.FC<ManageZindexContentProps> = (props) => {
  return (
    <CustomDrawerContent title="管理指数" enterText="确定" onEnter={props.onEnter} onClose={props.onClose}>
      <div className={styles.content}>
        <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
          <Tabs.TabPane tab="自选指数" key={String(0)}>
            <Optional />
          </Tabs.TabPane>
          <Tabs.TabPane tab="经济指数" key={String(1)}>
            <Economy />
          </Tabs.TabPane>
          <Tabs.TabPane tab="财政统计" key={String(2)}>
            <FinancialStatistics />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </CustomDrawerContent>
  );
};

export default ManageZindexContent;
