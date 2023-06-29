import React from 'react';
import { useRequest } from 'ahooks';
import styles from './index.module.scss';
const { ipcRenderer } = window.contextModules.electron;

export interface LogoProps {
  size?: number;
}
const Logo: React.FC<LogoProps> = React.memo((props) => {
  const { data } = useRequest(ipcRenderer.invoke.bind(null, 'get-app-icon'), {
    cacheKey: 'get-app-icon',
    cacheTime: -1,
  });
  return (
    <div
      className={styles.content}
      style={{
        height: props.size,
        width: props.size,
      }}
    >
      <img src={data} draggable={false} />
    </div>
  );
});
export default Logo;
