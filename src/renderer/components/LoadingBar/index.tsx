import React from 'react';
import classnames from 'classnames';
import { Spin } from 'antd';

import styles from './index.module.scss';

export interface LoadingBarProps {
  show: boolean;
}
const LoadingBar: React.FC<LoadingBarProps> = ({ show }) => {
  return (
    <div
      className={classnames(styles.content, {
        [styles.disable]: !show,
      })}
    >
      <Spin size="small" spinning={show} tip="理财有风险，投资需谨慎" />
    </div>
  );
};
export default LoadingBar;
