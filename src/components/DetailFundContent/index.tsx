import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';

import styles from './index.scss';

export interface DetailFundContentProps {
  show?: boolean;
  onEnter: () => void;
  onClose: () => void;
  fund: any;
}

const DetailFundContent: React.FC<DetailFundContentProps> = (props) => {
  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <button className={styles.close} onClick={props.onClose}>
          关闭
        </button>
        <h3>基金详情</h3>
        <button className={styles.add} onClick={props.onEnter}>
          确定
        </button>
      </div>
      <div className={styles.body}> </div>
    </div>
  );
};
export default DetailFundContent;
