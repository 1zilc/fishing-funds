import React from 'react';
import classnames from 'classnames';
import ArrowLine from '@/components/ArrowLine';
import * as Utils from '@/utils';
import styles from './index.module.scss';

interface ViewItem {
  name: string;
  value: number;
  zdd: number;
  zdf: number;
  code: string; // 唯一标识符
}

interface GridViewProps {
  list: ViewItem[];
  onDetail: (code: string) => void;
}

const GridView: React.FC<GridViewProps> = (props) => {
  const { list } = props;

  return (
    <div className={classnames(styles.content)}>
      {list.map((item) => {
        const valueColor = Utils.GetValueColor(item.zdd);
        return (
          <div
            key={item.code}
            className={classnames(styles.item, valueColor.bgClass, valueColor.textClass)}
            onClick={() => props.onDetail(item.code)}
          >
            <div className={styles.header}>
              <div>{item.name}</div>
              <ArrowLine value={item.zdd} />
            </div>
            <div className={styles.value}>{item.value}</div>
            <div className={styles.footer}>
              <div>{Utils.Yang(item.zdd)}</div>
              <div>{Utils.Yang(item.zdf)}%</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GridView;
