import React from 'react';

import Optional from '@/components/Home/ZindexList/ManageZindexContent/Optional';
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
        <Optional />
      </div>
    </CustomDrawerContent>
  );
};

export default ManageZindexContent;
