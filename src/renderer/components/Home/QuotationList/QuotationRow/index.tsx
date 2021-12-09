import React from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import NP from 'number-precision';

import ArrowDownIcon from '@/static/icon/arrow-down.svg';
import ArrowUpIcon from '@/static/icon/arrow-up.svg';
import ArrowLine from '@/components/ArrowLine';
import Collapse from '@/components/Collapse';
import { StoreState } from '@/reducers/types';
import { syncFavoriteQuotationMapAction, toggleQuotationCollapse } from '@/actions/quotation';
import * as Utils from '@/utils';
import styles from './index.module.scss';

export interface RowProps {
  quotation: Quotation.ResponseItem & Quotation.ExtraRow;
  onDetail: (code: string) => void;
  onStockDetail: (secid: string) => void;
}

const arrowSize = {
  width: 12,
  height: 12,
};

const QuotationRow: React.FC<RowProps> = (props) => {
  const { quotation } = props;
  const dispatch = useDispatch();
  const favoriteQuotationMap = useSelector((state: StoreState) => state.quotation.favoriteQuotationMap);
  const { conciseSetting } = useSelector((state: StoreState) => state.setting.systemSetting);
  const favorited = favoriteQuotationMap[quotation.code];

  function onDetailClick() {
    props.onDetail(quotation.code!);
  }

  return (
    <>
      <div className={classnames(styles.row)} onClick={() => dispatch(toggleQuotationCollapse(quotation))}>
        <div className={styles.arrow}>
          {quotation.collapse ? <ArrowUpIcon style={{ ...arrowSize }} /> : <ArrowDownIcon style={{ ...arrowSize }} />}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span className={styles.quotationName}>{quotation.name}</span>
            {favorited && <span className={styles.favorite}>关注</span>}
          </div>
          {!conciseSetting && (
            <div className={styles.rowBar}>
              {quotation.zdf < 0 ? (
                <>
                  <span className={styles.code}>{quotation.ldgpName}</span>
                  <span className={classnames(Utils.GetValueColor(quotation.ldgpZdf).textClass)}>领跌</span>
                  <span className={classnames(Utils.GetValueColor(quotation.ldgpZdf).textClass)}>{Utils.Yang(quotation.ldgpZdf)} %</span>
                </>
              ) : (
                <>
                  <span className={styles.code}>{quotation.lzgpName}</span>
                  <span className={classnames(Utils.GetValueColor(quotation.lzgpZdf).textClass)}>领涨</span>
                  <span className={classnames(Utils.GetValueColor(quotation.lzgpZdf).textClass)}>{Utils.Yang(quotation.lzgpZdf)} %</span>
                </>
              )}
            </div>
          )}
        </div>
        <div className={classnames(styles.value)}>
          <div className={classnames(styles.zxj, Utils.GetValueColor(quotation.zdf).textClass)}>
            {quotation.zxj}
            <ArrowLine value={quotation.zdf} />
          </div>
          {!conciseSetting && (
            <div className={styles.zd}>
              <div className={classnames(styles.zdd, Utils.GetValueColor(quotation.zdf).textClass)}>{Utils.Yang(quotation.zdd)}</div>
              <div className={classnames(styles.zdf, Utils.GetValueColor(quotation.zdf).textClass)}>{Utils.Yang(quotation.zdf)} %</div>
            </div>
          )}
        </div>
      </div>
      <Collapse isOpened={!!quotation.collapse}>
        <div className={styles.collapseContent}>
          <section>
            <span>总市值：</span>
            <span>{NP.divide(quotation.zsz, 10 ** 8).toFixed(2)}亿</span>
          </section>

          <section>
            <span>涨跌额：</span>
            <span className={classnames(Utils.GetValueColor(quotation.zdf).textClass)}>
              {Utils.Yang(NP.divide(quotation.zde, 10 ** 8).toFixed(2))}亿
            </span>
          </section>
          <section>
            <span>上涨家数：</span>
            <span className="text-up">{quotation.szjs}</span>
          </section>
          <section>
            <span>下跌家数：</span>
            <span className="text-down">{quotation.xdjs}</span>
          </section>
          <section>
            <a onClick={() => props.onStockDetail(`${quotation.lzgpMarket}.${quotation.lzgpCode}`)}>{quotation.lzgpName}：</a>
            <span className={classnames(Utils.GetValueColor(quotation.lzgpZdf).textClass)}>{Utils.Yang(quotation.lzgpZdf)} %</span>
          </section>
          <section>
            <a onClick={() => props.onStockDetail(`${quotation.ldgpMarket}.${quotation.ldgpCode}`)}>{quotation.ldgpName}：</a>
            <span className={classnames(Utils.GetValueColor(quotation.ldgpZdf).textClass)}>{Utils.Yang(quotation.ldgpZdf)} %</span>
          </section>
          <section>
            <span>换手率：</span>
            <span>{quotation.hs} %</span>
          </section>
          {conciseSetting && (
            <section>
              <span>涨跌幅：</span>
              <span className={classnames(Utils.GetValueColor(quotation.zdf).textClass)}>{Utils.Yang(quotation.zdf)} %</span>
            </section>
          )}
          <section>
            <span>特别关注：</span>
            {favorited ? (
              <a onClick={() => dispatch(syncFavoriteQuotationMapAction(quotation.code, false))}>已关注</a>
            ) : (
              <a onClick={() => dispatch(syncFavoriteQuotationMapAction(quotation.code, true))}>未关注</a>
            )}
          </section>
          <div className={styles.view}>
            <a onClick={onDetailClick}>{'查看详情 >'}</a>
          </div>
        </div>
      </Collapse>
    </>
  );
};

export default QuotationRow;
