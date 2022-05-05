import React from 'react';
import { Progress } from 'antd';
import clsx from 'clsx';
import styles from './index.module.scss';

interface CapacityProps {
  TopText: {
    PositionInd: number;
    Title: string;
    Content: string;
  };
}

const Capacity: React.FC<CapacityProps> = (props) => {
  const { PositionInd, Title, Content } = props.TopText;
  return (
    <div className={clsx(styles.content)}>
      <Progress type="circle" percent={PositionInd} width={64} strokeWidth={16} />
      <div className={styles.info}>
        <h3>{Title}</h3>
        <p>{Content}</p>
      </div>
    </div>
  );
};

export default Capacity;
