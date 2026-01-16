import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';
import styles from './index.module.css';

const Header: React.FC<PropsWithChildren<{}>> = (props) => {
  return (
    <div className={clsx(styles.layout)}>
      <div className={clsx(styles.content)}>{props.children}</div>
    </div>
  );
};
export default Header;
