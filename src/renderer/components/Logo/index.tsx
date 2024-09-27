import React from 'react';
import appIcon from '@/static/img/icon.ico';
import styles from './index.module.scss';

export interface LogoProps {
  size?: number;
}
const Logo: React.FC<LogoProps> = React.memo((props) => {
  return (
    <div
      className={styles.content}
      style={{
        height: props.size,
        width: props.size,
      }}
    >
      <img src={appIcon} draggable={false} />
    </div>
  );
});
export default Logo;
