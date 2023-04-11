import React from 'react';
import clsx from 'clsx';
import { Spin } from 'antd';

import styles from './index.module.scss';

export interface LoadingBarProps {
  show: boolean;
}
const LoadingBar: React.FC<LoadingBarProps> = ({ show }) => {
  return (
    <div
      className={clsx(styles.content, {
        [styles.disable]: !show,
      })}
    >
      <Spin size="small" spinning={show} tip="理财有风险，投资需谨慎" style={{ fontSize: 10 }} />
    </div>
  );
};
export default React.memo(LoadingBar);
