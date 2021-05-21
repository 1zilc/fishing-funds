import React from 'react';
import { Empty } from 'antd';

import styles from './index.scss';

export interface EmptyProps {
  text?: string;
}
const EmptyContent: React.FC<EmptyProps> = ({ text }) => {
  return (
    <div className={styles.content}>
      <div className={styles.img}>
        <Empty description={text || ''} />
      </div>
    </div>
  );
};

export default EmptyContent;
