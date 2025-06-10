import React from 'react';
import clsx from 'clsx';
import { Empty } from 'antd';

import styles from './index.module.css';

export interface EmptyProps {
  text?: string;
  className?: string;
}
const EmptyContent: React.FC<EmptyProps> = React.memo(({ text, className }) => {
  return (
    <div className={clsx(styles.content, className)}>
      <div className={styles.img}>
        <Empty description={text || ''} />
      </div>
    </div>
  );
});

export default EmptyContent;
