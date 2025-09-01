import React from 'react';
import clsx from 'clsx';

import NP from 'number-precision';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import ArrowLine from '@/components/ArrowLine';
import Collapse from '@/components/Collapse';

import { setFavoriteQuotationMapAction, toggleQuotationCollapseAction } from '@/store/features/quotation';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import * as Utils from '@/utils';
import styles from './index.module.css';

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
  const dispatch = useAppDispatch();
  const favoriteQuotationMap = useAppSelector((state) => state.quotation.favoriteQuotationMap);
  const conciseSetting = useAppSelector((state) => state.setting.systemSetting.conciseSetting);
  const favorited = favoriteQuotationMap[quotation.code];

  function onDetailClick() {
    props.onDetail(quotation.code!);
  }

  return (
    <>
      <div className={clsx(styles.row)} onClick={() => dispatch(toggleQuotationCollapseAction(quotation))}>
        <div className={styles.arrow}>
          {quotation.collapse ? <RiArrowUpSLine style={{ ...arrowSize }} /> : <RiArrowDownSLine style={{ ...arrowSize }} />}
        </div>
        <div style={{ flex: 1, width: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className={styles.quotationName}>{quotation.name}</span>
            {favorited && <span className={styles.favorite}>关注</span>}
          </div>
          {!conciseSetting && (
            <div className={styles.rowBar}>
              {quotation.zdf < 0 ? (
                <>
                  <span className={styles.code}>{quotation.ldgpName}</span>
                  <span className={clsx(Utils.GetValueColor(quotation.ldgpZdf).textClass)}>领跌</span>
                  <span className={clsx(Utils.GetValueColor(quotation.ldgpZdf).textClass)}>
                    {Utils.Yang(quotation.ldgpZdf)} %
                  </span>
                </>
              ) : (
                <>
                  <span className={styles.code}>{quotation.lzgpName}</span>
                  <span className={clsx(Utils.GetValueColor(quotation.lzgpZdf).textClass)}>领涨</span>
                  <span className={clsx(Utils.GetValueColor(quotation.lzgpZdf).textClass)}>
                    {Utils.Yang(quotation.lzgpZdf)} %
                  </span>
                </>
              )}
            </div>
          )}
        </div>
        <div className={clsx(styles.value)}>
          <div className={clsx(styles.zxj, Utils.GetValueColor(quotation.zdf).textClass)}>
            {quotation.zxj}
            <ArrowLine value={quotation.zdf} />
          </div>
          {!conciseSetting && (
            <div className={styles.zd}>
              <div className={clsx(styles.zdd, Utils.GetValueColor(quotation.zdf).textClass)}>{Utils.Yang(quotation.zdd)}</div>
              <div className={clsx(styles.zdf, Utils.GetValueColor(quotation.zdf).textClass)}>{Utils.Yang(quotation.zdf)} %</div>
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
            <span className={clsx(Utils.GetValueColor(quotation.zdf).textClass)}>
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
            <span className={clsx(Utils.GetValueColor(quotation.lzgpZdf).textClass)}>{Utils.Yang(quotation.lzgpZdf)} %</span>
          </section>
          <section>
            <a onClick={() => props.onStockDetail(`${quotation.ldgpMarket}.${quotation.ldgpCode}`)}>{quotation.ldgpName}：</a>
            <span className={clsx(Utils.GetValueColor(quotation.ldgpZdf).textClass)}>{Utils.Yang(quotation.ldgpZdf)} %</span>
          </section>
          <section>
            <span>换手率：</span>
            <span>{quotation.hs} %</span>
          </section>
          {conciseSetting && (
            <section>
              <span>涨跌幅：</span>
              <span className={clsx(Utils.GetValueColor(quotation.zdf).textClass)}>{Utils.Yang(quotation.zdf)} %</span>
            </section>
          )}
          <section>
            <span>特别关注：</span>
            {favorited ? (
              <a onClick={() => dispatch(setFavoriteQuotationMapAction({ code: quotation.code, status: false }))}>已关注</a>
            ) : (
              <a onClick={() => dispatch(setFavoriteQuotationMapAction({ code: quotation.code, status: true }))}>未关注</a>
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
