import React from 'react';

import { ReactComponent as EmptyImage } from '@/assets/img/empty.svg';
import styles from './index.scss';

export interface EmptyProps {
  text?: string;
}
const Empty: React.FC<EmptyProps> = ({ text }) => {
  return (
    <div className={styles.content}>
      <div className={styles.text}>{text}</div>
      <div className={styles.img}>
        <EmptyImage />
      </div>
    </div>
  );
};

export default Empty;
