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
          <Tabs
            animated={{ tabPane: true }}
            tabBarGutter={15}
            items={[
              {
                key: String(0),
                label: '标题',
                children: null,
              },
            ]}
          />
        </div>
      </div>
    </CustomDrawerContent>
  );
};

export default TemplateName;
