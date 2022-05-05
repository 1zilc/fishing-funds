import React from 'react';
import { Spin } from 'antd';
import clsx from 'clsx';
import Logo from '@/components/Logo';
import styles from './index.module.scss';

export interface LoadingScreenProps {
  loading: boolean;
  text: string;
}

const { shell } = window.contextModules.electron;

const LoadingScreen: React.FC<LoadingScreenProps> = (props) => {
  const { loading, text } = props;

  return (
    <div className={clsx(styles.content)}>
      <Logo />
      <p>Fishing Funds</p>
      <Spin spinning={loading} size="small" tip={text} style={{ color: 'var(--main-text-color)' }} />
      <a onClick={() => shell.openExternal('https://ff.1zilc.top')}>ff.1zilc.top</a>
    </div>
  );
};
export default LoadingScreen;
