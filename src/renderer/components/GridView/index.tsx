import React from 'react';
import clsx from 'clsx';
import ArrowLine from '@/components/ArrowLine';
import { useAppSelector } from '@/utils/hooks';
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
  const { conciseSetting } = useAppSelector((state) => state.setting.systemSetting);

  return (
    <div className={clsx(styles.content)}>
      {list.map((item) => {
        const zddColor = Utils.GetValueColor(item.zdd);
        const zdfColor = Utils.GetValueColor(item.zdf);
        return (
          <div
            key={item.code}
            className={clsx(styles.item, zddColor.bgClass, zddColor.textClass)}
            onClick={() => props.onDetail(item.code)}
          >
            <div className={styles.header}>
              <div>{item.name}</div>
              {!conciseSetting ? <ArrowLine value={item.zdf} /> : <div className={zdfColor.textClass}>{Utils.Yang(item.zdf)}%</div>}
            </div>
            {!conciseSetting && (
              <>
                <div className={styles.value}>{item.value}</div>
                <div className={styles.footer}>
                  <div>{Utils.Yang(item.zdd)}</div>
                  <div className={zdfColor.textClass}>{Utils.Yang(item.zdf)}%</div>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GridView;
