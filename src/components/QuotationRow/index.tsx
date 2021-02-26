import React from 'react';
import { Collapse } from 'react-collapse';
import classnames from 'classnames';
import { useDispatch } from 'react-redux';
import NP from 'number-precision';

import { ReactComponent as ArrowDownLineIcon } from '@/assets/icons/arrow-down-line.svg';
import { ReactComponent as ArrowUpLineIcon } from '@/assets/icons/arrow-up-line.svg';
import { ReactComponent as ArrowDownIcon } from '@/assets/icons/arrow-down.svg';
import { ReactComponent as ArrowUpIcon } from '@/assets/icons/arrow-up.svg';
import { getSystemSetting } from '@/actions/setting';
import { TOGGLE_QUOTATION_COLLAPSE } from '@/actions/quotation';

import * as Utils from '@/utils';

import styles from './index.scss';

export interface RowProps {
  quotation: Quotation.ResponseItem & Quotation.ExtraRow;
}

const arrowSize = {
  width: 12,
  height: 12,
};

const QuotationRow: React.FC<RowProps> = (props) => {
  const { quotation } = props;
  const dispatch = useDispatch();
  const { conciseSetting } = getSystemSetting();

  return (
    <div>
      <div className={styles.row}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onClick={() => {
            dispatch({
              type: TOGGLE_QUOTATION_COLLAPSE,
              payload: quotation,
            });
          }}
        >
          <div className={styles.arrow}>
            {quotation.collapse ? (
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
              <span className={styles.quotationName}>{quotation.name}</span>
            </div>
            {!conciseSetting && (
              <div className={styles.rowBar}>
                {quotation.zdf < 0 ? (
                  <>
                    <span className={styles.code}>{quotation.lzgpName}</span>
                    <span
                      className={classnames(
                        quotation.ldgpZdf < 0 ? 'down-text' : 'up-text'
                      )}
                    >
                      领跌
                    </span>
                    <span
                      className={classnames(
                        quotation.ldgpZdf < 0 ? 'down-text' : 'up-text'
                      )}
                    >
                      {Utils.Yang(quotation.ldgpZdf)} %
                    </span>
                  </>
                ) : (
                  <>
                    <span className={styles.code}>{quotation.lzgpName}</span>
                    <span
                      className={classnames(
                        quotation.lzgpZdf < 0 ? 'down-text' : 'up-text'
                      )}
                    >
                      领涨
                    </span>
                    <span
                      className={classnames(
                        quotation.lzgpZdf < 0 ? 'down-text' : 'up-text'
                      )}
                    >
                      {Utils.Yang(quotation.lzgpZdf)} %
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
          <div className={classnames(styles.value)}>
            <div
              className={classnames(
                styles.zxj,
                quotation.zdf < 0 ? 'down-text' : 'up-text'
              )}
            >
              {quotation.zxj}
              {quotation.zdf < 0 ? (
                <ArrowDownLineIcon
                  className={quotation.zdf < 0 ? 'down-svg' : 'up-svg'}
                />
              ) : (
                <ArrowUpLineIcon
                  className={quotation.zdf < 0 ? 'down-svg' : 'up-svg'}
                />
              )}
            </div>
            {!conciseSetting && (
              <div className={styles.zd}>
                <div
                  className={classnames(
                    styles.zdd,
                    quotation.zdf < 0 ? 'down-text' : 'up-text'
                  )}
                >
                  {Utils.Yang(quotation.zde)}
                </div>
                <div
                  className={classnames(
                    styles.zdf,
                    quotation.zdf < 0 ? 'down-text' : 'up-text'
                  )}
                >
                  {Utils.Yang(quotation.zdf)} %
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Collapse isOpened={!!quotation.collapse}>
        <div className={styles.collapseContent}>
          {conciseSetting && (
            <section>
              <span>涨跌额：</span>
              <span
                className={classnames(
                  quotation.zdf < 0 ? 'down-text' : 'up-text'
                )}
              >
                {Utils.Yang(quotation.zde)}
              </span>
            </section>
          )}
          {conciseSetting && (
            <section>
              <span>涨跌幅：</span>
              <span
                className={classnames(
                  quotation.zdf < 0 ? 'down-text' : 'up-text'
                )}
              >
                {Utils.Yang(quotation.zdf)} %
              </span>
            </section>
          )}
          <section>
            <span>总市值：</span>
            <span>
              {NP.divide(quotation.zsz, Math.pow(10, 8)).toFixed(2)}亿
            </span>
          </section>
          <section>
            <span>换手率：</span>
            <span>{quotation.hs} %</span>
          </section>
          <section>
            <span>上涨家数：</span>
            <span className={'up-text'}>{quotation.szjs}</span>
          </section>
          <section>
            <span>下跌家数：</span>
            <span className={'down-text'}>{quotation.xdjs}</span>
          </section>
          {conciseSetting && (
            <section>
              <span>
                {quotation.lzgpName}({quotation.lzgpCode})：
              </span>
              <span
                className={classnames(
                  quotation.lzgpZdf < 0 ? 'down-text' : 'up-text'
                )}
              >
                {Utils.Yang(quotation.lzgpZdf)} %
              </span>
            </section>
          )}
          {conciseSetting && (
            <section>
              <span>
                {quotation.ldgpName}({quotation.ldgpCode})：
              </span>
              <span
                className={classnames(
                  quotation.ldgpZdf < 0 ? 'down-text' : 'up-text'
                )}
              >
                {Utils.Yang(quotation.ldgpZdf)} %
              </span>
            </section>
          )}
        </div>
      </Collapse>
    </div>
  );
};

export default QuotationRow;
