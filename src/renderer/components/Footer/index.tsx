import React, { PropsWithChildren } from 'react';
import styles from './index.module.css';

const Footer: React.FC<PropsWithChildren<Record<string, unknown>>> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
export default Footer;
