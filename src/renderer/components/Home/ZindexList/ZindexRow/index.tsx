import React from 'react';
import { Collapse } from 'react-collapse';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as ArrowDownLineIcon } from '@/assets/icons/arrow-down-line.svg';
import { ReactComponent as ArrowUpLineIcon } from '@/assets/icons/arrow-up-line.svg';
import { ReactComponent as ArrowDownIcon } from '@/assets/icons/arrow-down.svg';
import { ReactComponent as ArrowUpIcon } from '@/assets/icons/arrow-up.svg';
import { StoreState } from '@/reducers/types';
import { TOGGLE_ZINDEX_COLLAPSE } from '@/actions/zindex';
import * as Utils from '@/utils';
import styles from './index.scss';

export interface RowProps {
  zindex: Zindex.ResponseItem & Zindex.ExtraRow;
  onDetail?: (code: string) => void;
}

const arrowSize = {
  width: 12,
  height: 12,
};

const ZindexRow: React.FC<RowProps> = (props) => {
  const { zindex } = props;
  const dispatch = useDispatch();
  const { conciseSetting } = useSelector(
    (state: StoreState) => state.setting.systemSetting
  );

  const onDetailClick = () => {
    props.onDetail && props.onDetail(`${zindex.type}.${zindex.zindexCode}`);
  };

  return (
    <>
      <div
        className={classnames(styles.row, 'hoverable')}
        onClick={() => {
          dispatch({
            type: TOGGLE_ZINDEX_COLLAPSE,
            payload: zindex,
          });
        }}
      >
        <div className={styles.arrow}>
          {zindex.collapse ? (
            <ArrowUpIcon style={{ ...arrowSize }} />
          ) : (
            <ArrowDownIcon style={{ ...arrowSize }} />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span className={styles.zindexName}>{zindex.name}</span>
          </div>
          {!conciseSetting && (
            <div className={styles.rowBar}>
              <div>
                <span className={styles.code}>{zindex.zindexCode}</span>
                {/* <span>{zindex.gztime.slice(5)}</span> */}
              </div>
            </div>
          )}
        </div>
        <div className={classnames(styles.value)}>
          <div
            className={classnames(
              styles.zsz,
              zindex.zdf < 0 ? 'text-down' : 'text-up'
            )}
          >
            {zindex.zsz}
            {zindex.zdf < 0 ? (
              <ArrowDownLineIcon
                className={zindex.zdf < 0 ? 'svg-down' : 'svg-up'}
              />
            ) : (
              <ArrowUpLineIcon
                className={zindex.zdf < 0 ? 'svg-down' : 'svg-up'}
              />
            )}
          </div>
          {!conciseSetting && (
            <div className={styles.zd}>
              <div
                className={classnames(
                  styles.zdd,
                  zindex.zdd < 0 ? 'text-down' : 'text-up'
                )}
              >
                {Utils.Yang(zindex.zdd)}
              </div>
              <div
                className={classnames(
                  styles.zdf,
                  zindex.zdf < 0 ? 'text-down' : 'text-up'
                )}
              >
                {Utils.Yang(zindex.zdf)} %
              </div>
            </div>
          )}
        </div>
      </div>
      <Collapse isOpened={!!zindex.collapse}>
        <div className={styles.collapseContent}>
          {conciseSetting && (
            <section>
              <span>涨跌点：</span>
              <span
                className={classnames(zindex.zdd < 0 ? 'text-down' : 'text-up')}
              >
                {Utils.Yang(zindex.zdd)}
              </span>
            </section>
          )}
          {conciseSetting && (
            <section>
              <span>涨跌幅：</span>
              <span
                className={classnames(zindex.zdf < 0 ? 'text-down' : 'text-up')}
              >
                {Utils.Yang(zindex.zdf)} %
              </span>
            </section>
          )}
          <section>
            <span>今开：</span>
            <span
              className={classnames(
                zindex.jk < zindex.zs ? 'text-down' : 'text-up'
              )}
            >
              {zindex.jk}
            </span>
          </section>
          <section>
            <span>昨收：</span>
            <span>{zindex.zs}</span>
          </section>
          <section>
            <span>最高：</span>
            <span
              className={classnames(
                zindex.zg < zindex.zs ? 'text-down' : 'text-up'
              )}
            >
              {zindex.zg}
            </span>
          </section>
          <section>
            <span>最低：</span>
            <span
              className={classnames(
                zindex.zd < zindex.zs ? 'text-down' : 'text-up'
              )}
            >
              {zindex.zd}
            </span>
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
