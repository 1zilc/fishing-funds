import React from 'react';
import { Tabs } from 'antd';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import styles from './index.module.scss';

interface TemplateNameProps {
  onEnter: () => void;
  onClose: () => void;
}

const TemplateName: React.FC<TemplateNameProps> = (props) => {
  return (
    <CustomDrawerContent title="标题" enterText="确定" onClose={props.onClose} onEnter={props.onEnter}>
      <div className={styles.content}>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="标题" key={String(0)}></Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </CustomDrawerContent>
  );
};

export default TemplateName;
