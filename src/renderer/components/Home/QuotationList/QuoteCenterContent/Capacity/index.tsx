import React from 'react';
import { Progress } from 'antd';
import classnames from 'classnames';
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
    <div className={classnames(styles.content)}>
      <Progress type="circle" percent={PositionInd} width={64} strokeWidth={16} />
      <div className={styles.info}>
        <h3>{Title}</h3>
        <p>{Content}</p>
      </div>
    </div>
  );
};

export default Capacity;
