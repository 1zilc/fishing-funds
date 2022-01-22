import React from 'react';

import Optional from '@/components/Home/CoinList/ManageCoinContent/Optional';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import styles from './index.module.scss';

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
