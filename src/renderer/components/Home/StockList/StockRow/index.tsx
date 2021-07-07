import React from 'react';
import { Collapse } from 'react-collapse';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as ArrowDownIcon } from '@/assets/icons/arrow-down.svg';
import { ReactComponent as ArrowUpIcon } from '@/assets/icons/arrow-up.svg';
import ArrowLine from '@/components/ArrowLine';
import { StoreState } from '@/reducers/types';
import { TOGGLE_STOCK_COLLAPSE } from '@/actions/stock';
import * as Utils from '@/utils';
import styles from './index.scss';

export interface RowProps {
  stock: Stock.ResponseItem & Stock.ExtraRow;
  onDetail: (code: string) => void;
}

const arrowSize = {
  width: 12,
  height: 12,
};

const StockRow: React.FC<RowProps> = (props) => {
  const { stock } = props;
  const dispatch = useDispatch();
  const { conciseSetting } = useSelector(
    (state: StoreState) => state.setting.systemSetting
  );

  const onDetailClick = () => {
    props.onDetail(stock.secid);
  };

  return (
    <>
      <div
        className={classnames(styles.row, 'hoverable')}
        onClick={() => {
          dispatch({
            type: TOGGLE_STOCK_COLLAPSE,
            payload: stock,
          });
        }}
      >
        <div className={styles.arrow}>
          {stock.collapse ? (
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
            <span className={styles.zindexName}>{stock.name}</span>
          </div>
          {!conciseSetting && (
            <div className={styles.rowBar}>
              <div>
                <span className={styles.code}>{stock.code}</span>
                {/* <span>{zindex.gztime.slice(5)}</span> */}
              </div>
            </div>
          )}
        </div>
        <div className={classnames(styles.value)}>
          <div
            className={classnames(
              styles.zx,
              Utils.GetValueColor(stock.zdf).textClass
            )}
          >
            {stock.zx}
            <ArrowLine value={stock.zdf} />
          </div>
          {!conciseSetting && (
            <div className={styles.zd}>
              <div
                className={classnames(
                  styles.zdd,
                  Utils.GetValueColor(stock.zdd).textClass
                )}
              >
                {Utils.Yang(stock.zdd)}
              </div>
              <div
                className={classnames(
                  styles.zdf,
                  Utils.GetValueColor(stock.zdf).textClass
                )}
              >
                {Utils.Yang(stock.zdf)} %
              </div>
            </div>
          )}
        </div>
      </div>
      <Collapse isOpened={!!stock.collapse}>
        <div className={styles.collapseContent}>
          {conciseSetting && (
            <section>
              <span>涨跌点：</span>
              <span
                className={classnames(Utils.GetValueColor(stock.zdd).textClass)}
              >
                {Utils.Yang(stock.zdd)}
              </span>
            </section>
          )}
          {conciseSetting && (
            <section>
              <span>涨跌幅：</span>
              <span
                className={classnames(Utils.GetValueColor(stock.zdf).textClass)}
              >
                {Utils.Yang(stock.zdf)} %
              </span>
            </section>
          )}
          <section>
            <span>昨收：</span>
            <span>{stock.zs}</span>
          </section>
          <div className={styles.view}>
            <a onClick={onDetailClick}>{'查看详情 >'}</a>
          </div>
        </div>
      </Collapse>
    </>
  );
};

export default StockRow;
