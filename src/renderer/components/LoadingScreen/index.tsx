import React from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import Logo from '@/components/Logo';
import { Spin } from 'antd';

import { StoreState } from '@/reducers/types';
import styles from './index.module.scss';

export interface LoadingScreenProps {}

const { shell } = window.contextModules.electron;

const LoadingScreen: React.FC<LoadingScreenProps> = () => {
  const remoteFundsLoading = useSelector((state: StoreState) => state.fund.remoteFundsLoading);

  return (
    <div
      className={classnames(styles.content, {
        [styles.disable]: !remoteFundsLoading,
      })}
    >
      <Logo />
      <p>Fishing Funds</p>
      <Spin spinning={remoteFundsLoading} size="small" tip="加载远程数据中..." style={{ color: '#fff' }} />
      <a onClick={() => shell.openExternal('https://ff.1zilc.top')}>ff.1zilc.top</a>
    </div>
  );
};
export default LoadingScreen;
