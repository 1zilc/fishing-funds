import React from 'react';
import { Collapse } from 'react-collapse';
import classnames from 'classnames';
import { useDispatch } from 'react-redux';

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
              <span className={styles.zindexName}>{quotation.name}</span>
            </div>
            {!conciseSetting && (
              <div className={styles.rowBar}>
                <div>
                  {/* <span className={styles.code}>{quotation.zindexCode}</span> */}
                  {/* <span>{zindex.gztime.slice(5)}</span> */}
                </div>
              </div>
            )}
          </div>
          {/* <div className={classnames(styles.value)}>
            <div
              className={classnames(
                styles.zsz,
                zindex.zdf < 0 ? 'down-text' : 'up-text'
              )}
            >
              {zindex.zsz}
              {zindex.zdf < 0 ? (
                <ArrowDownLineIcon
                  className={zindex.zdf < 0 ? 'down-svg' : 'up-svg'}
                />
              ) : (
                <ArrowUpLineIcon
                  className={zindex.zdf < 0 ? 'down-svg' : 'up-svg'}
                />
              )}
            </div>
            {!conciseSetting && (
              <div className={styles.zd}>
                <div
                  className={classnames(
                    styles.zdd,
                    zindex.zdd < 0 ? 'down-text' : 'up-text'
                  )}
                >
                  {Utils.Yang(zindex.zdd)}
                </div>
                <div
                  className={classnames(
                    styles.zdf,
                    zindex.zdf < 0 ? 'down-text' : 'up-text'
                  )}
                >
                  {Utils.Yang(zindex.zdf)} %
                </div>
              </div>
            )}
          </div>*/}
        </div>
      </div>
      <Collapse isOpened={!!quotation.collapse}>
        <div className={styles.collapseContent}></div>
      </Collapse>
    </div>
  );
};

export default QuotationRow;
