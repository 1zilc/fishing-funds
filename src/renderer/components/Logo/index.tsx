import React from 'react';

import LogoImage from '@/assets/logo.png';
import styles from './index.scss';

const Logo = () => {
  return (
    <div className={styles.content}>
      <img src={LogoImage} draggable={false}></img>
    </div>
  );
};
export default Logo;
