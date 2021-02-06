import React, { PropsWithChildren } from 'react';
import styles from './index.scss';

const Footer: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
export default Footer;
