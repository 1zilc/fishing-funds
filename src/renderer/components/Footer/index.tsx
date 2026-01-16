import React, { PropsWithChildren } from 'react';
import styles from './index.module.css';

const Footer: React.FC<PropsWithChildren<Record<string, unknown>>> = ({ children }) => {
  return <div className={styles.layout}>{children}</div>;
};
export default Footer;
