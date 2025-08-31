import React from 'react';
import { Tabs } from 'antd';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import styles from './index.module.css';

export type FundsImportContentProps = {
  onEnter: () => void;
  onClose: () => void;
  funds: Partial<FundConfigItem>[];
  loading?: boolean;
};

export type FundConfigItem = {
  code: string; // 基金代码（必填）
  name: string; // 基金名称
  cyfe: number; // 持有份额
  cbj: number; // 持仓成本价
};

const FundsImportContent: React.FC<FundsImportContentProps> = (props) => {
  return (
    <CustomDrawerContent
      title="基金导入"
      enterText="确定"
      onClose={props.onClose}
      onEnter={props.onEnter}
      enterLoading={props.loading}
    >
      <div className={styles.content}>{JSON.stringify(props.funds)}</div>
    </CustomDrawerContent>
  );
};

export default FundsImportContent;
