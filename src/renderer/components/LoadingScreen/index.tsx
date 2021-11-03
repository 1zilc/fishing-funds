import React from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { Spin } from 'antd';

import { StoreState } from '@/reducers/types';
import styles from './index.module.scss';

export interface LoadingScreenProps {}
const LoadingScreen: React.FC<LoadingScreenProps> = () => {
  const remoteFundsLoading = useSelector((state: StoreState) => state.fund.remoteFundsLoading);
  return (
    <div
      className={classnames(styles.content, {
        [styles.disable]: !remoteFundsLoading,
      })}
    >
      <Spin spinning={remoteFundsLoading} tip="数据初始化..." />
    </div>
  );
};
export default LoadingScreen;
