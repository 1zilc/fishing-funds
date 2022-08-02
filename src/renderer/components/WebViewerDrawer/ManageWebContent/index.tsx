import React from 'react';

import Optional from '@/components/WebViewerDrawer/ManageWebContent/Optional';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import styles from './index.module.scss';

export interface ManageWebContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const ManageWebContent: React.FC<ManageWebContentProps> = (props) => {
  return (
    <CustomDrawerContent title="管理H5" enterText="确定" onEnter={props.onEnter} onClose={props.onClose}>
      <div className={styles.content}>
        <Optional />
      </div>
    </CustomDrawerContent>
  );
};

export default ManageWebContent;
