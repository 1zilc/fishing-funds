import React from 'react';
import styles from './index.module.css';

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
      <img src="img/icon.ico" draggable={false} />
    </div>
  );
});
export default Logo;
