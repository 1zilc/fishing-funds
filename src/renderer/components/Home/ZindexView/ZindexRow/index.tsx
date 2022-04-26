import React from 'react';
import clsx from 'clsx';

import ArrowDownIcon from '@/static/icon/arrow-down.svg';
import ArrowUpIcon from '@/static/icon/arrow-up.svg';
import Collapse from '@/components/Collapse';
import ArrowLine from '@/components/ArrowLine';

import { toggleZindexCollapseAction } from '@/store/features/zindex';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import * as Utils from '@/utils';
import styles from './index.module.scss';

export interface RowProps {
  zindex: Zindex.ResponseItem & Zindex.ExtraRow;
  onDetail: (code: string) => void;
}

const arrowSize = {
  width: 12,
  height: 12,
};

const ZindexRow: React.FC<RowProps> = (props) => {
  const { zindex } = props;
  const dispatch = useAppDispatch();
  const { conciseSetting } = useAppSelector((state) => state.setting.systemSetting);

  const onDetailClick = () => {
    props.onDetail(zindex.code);
  };

  return (
    <>
      <div
        className={clsx(styles.row)}
        onClick={() => {
          dispatch(toggleZindexCollapseAction(zindex));
        }}
      >
        <div className={styles.arrow}>
          {zindex.collapse ? <ArrowUpIcon style={{ ...arrowSize }} /> : <ArrowDownIcon style={{ ...arrowSize }} />}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className={styles.zindexName}>{zindex.name}</span>
          </div>
          {!conciseSetting && (
            <div className={styles.rowBar}>
              <div>
                <span className={styles.code}>{zindex.zindexCode}</span>
                <span>{zindex.time}</span>
              </div>
            </div>
          )}
        </div>
        <div className={clsx(styles.value)}>
          <div className={clsx(styles.zsz, Utils.GetValueColor(zindex.zdf).textClass)}>
            {zindex.zsz}
            <ArrowLine value={zindex.zdf} />
          </div>
          {!conciseSetting && (
            <div className={styles.zd}>
              <div className={clsx(styles.zdd, Utils.GetValueColor(zindex.zdd).textClass)}>{Utils.Yang(zindex.zdd)}</div>
              <div className={clsx(styles.zdf, Utils.GetValueColor(zindex.zdf).textClass)}>{Utils.Yang(zindex.zdf)} %</div>
            </div>
          )}
        </div>
      </div>
      <Collapse isOpened={zindex.collapse}>
        <div className={styles.collapseContent}>
          {conciseSetting && (
            <section>
              <span>涨跌点：</span>
              <span className={clsx(Utils.GetValueColor(zindex.zdd).textClass)}>{Utils.Yang(zindex.zdd)}</span>
            </section>
          )}
          {conciseSetting && (
            <section>
              <span>涨跌幅：</span>
              <span className={clsx(Utils.GetValueColor(zindex.zdf).textClass)}>{Utils.Yang(zindex.zdf)} %</span>
            </section>
          )}
          <section>
            <span>今开：</span>
            <span className={clsx(Utils.GetValueColor(zindex.jk - zindex.zs).textClass)}>{zindex.jk}</span>
          </section>
          <section>
            <span>昨收：</span>
            <span>{zindex.zs}</span>
          </section>
          <section>
            <span>最高：</span>
            <span className={clsx(Utils.GetValueColor(zindex.zg - zindex.zs).textClass)}>{zindex.zg}</span>
          </section>
          <section>
            <span>最低：</span>
            <span className={clsx(Utils.GetValueColor(zindex.zd - zindex.zs).textClass)}>{zindex.zd}</span>
          </section>
          <section>
            <span>换手：</span>
            <span>{zindex.hs} %</span>
          </section>
          <section>
            <span>振幅：</span>
            <span>{zindex.zf} %</span>
          </section>
          {conciseSetting && (
            <section>
              <span>指数代码：</span>
              <span>{zindex.zindexCode}</span>
            </section>
          )}
          <div className={styles.view}>
            <a onClick={onDetailClick}>{'查看详情 >'}</a>
          </div>
        </div>
      </Collapse>
    </>
  );
};

export default ZindexRow;
