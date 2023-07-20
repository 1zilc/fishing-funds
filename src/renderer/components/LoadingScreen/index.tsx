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
      <div className={styles.icon}>
        <Logo size={96} />
        <div className={styles.name}>Fishing Funds</div>
      </div>
      <div className={styles.spin}>
        <Spin spinning={loading} size="small" tip={text}>
          <div style={{ width: 240 }}></div>
        </Spin>
      </div>
      <a className={styles.link} onClick={() => shell.openExternal('https://ff.1zilc.top')}>
        ff.1zilc.top
      </a>
    </div>
  );
};
export default LoadingScreen;
