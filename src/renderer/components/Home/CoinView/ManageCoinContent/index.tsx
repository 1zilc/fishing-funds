import React from 'react';

import Optional from '@/components/Home/CoinView/ManageCoinContent/Optional';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import styles from './index.module.css';

export interface ManageStockContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const ManageStockContent: React.FC<ManageStockContentProps> = (props) => {
  return (
    <CustomDrawerContent title="管理货币" enterText="确定" onEnter={props.onEnter} onClose={props.onClose}>
      <div className={styles.content}>
        <Optional />
      </div>
    </CustomDrawerContent>
  );
};

export default ManageStockContent;
