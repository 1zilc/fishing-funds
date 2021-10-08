import React from 'react';

import LogoImage from '@assets/icon.png';
import styles from './index.scss';

const Logo = () => {
  return (
    <div className={styles.content}>
      <img src={LogoImage} draggable={false} />
    </div>
  );
};
export default Logo;
