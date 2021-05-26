import React from 'react';
import { Collapse } from 'react-collapse';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as EditIcon } from '@/assets/icons/edit.svg';
import { ReactComponent as ArrowDownIcon } from '@/assets/icons/arrow-down.svg';
import { ReactComponent as ArrowUpIcon } from '@/assets/icons/arrow-up.svg';
import { TOGGLE_FUND_COLLAPSE, calcFund } from '@/actions/fund';
import { StoreState } from '@/reducers/types';
import * as Utils from '@/utils';
import styles from './index.scss';

export interface RowProps {
  fund: Fund.ResponseItem & Fund.ExtraRow & Fund.FixData;
  readOnly?: boolean;
  onEdit?: (fund: Fund.SettingItem) => void;
  onDetail?: (code: string) => void;
}

const arrowSize = {
  width: 12,
  height: 12,
};

const FundRow: React.FC<RowProps> = (props) => {
  const { fund, readOnly } = props;
  const dispatch = useDispatch();
  const { conciseSetting } = useSelector(
    (state: StoreState) => state.setting.systemSetting
  );
  const calcFundResult = calcFund(fund);
  const { isFix } = calcFundResult;

  const onRowClick = () => {
    if (readOnly) {
      onDetailClick();
    } else {
      dispatch({
        type: TOGGLE_FUND_COLLAPSE,
        payload: fund,
      });
    }
  };

  const onDetailClick = () => {
    props.onDetail && props.onDetail(fund.fundcode!);
  };

  const onEditClick = () => {
    props.onEdit &&
      props.onEdit({
        name: fund.name!,
        code: fund.fundcode!,
        cyfe: Number(calcFundResult.cyfe),
      });
  };

  return (
    <>
      <div className={classnames(styles.row, 'hoverable')} onClick={onRowClick}>
        {!readOnly && (
          <div className={styles.arrow}>
            {fund.collapse ? (
              <ArrowUpIcon style={{ ...arrowSize }} />
            ) : (
              <ArrowDownIcon style={{ ...arrowSize }} />
            )}
          </div>
        )}
        <div style={{ flex: 1, marginLeft: 5 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span className={styles.fundName}>
              {fund.name}
              {conciseSetting && isFix && (
                <span className={styles.warn}>净值更新</span>
              )}
            </span>
          </div>
          {!conciseSetting && (
            <div className={styles.rowBar}>
              <div>
                <span className={styles.code}>{fund.fundcode}</span>
                <span>
                  {isFix
                    ? calcFundResult.fixDate
                    : calcFundResult.gztime?.slice(5)}
                </span>
                {isFix && <span className={styles.warn}>净值更新</span>}
              </div>
            </div>
          )}
        </div>
        {conciseSetting ? (
          <div
            className={classnames(
              styles.conciseValue,
              Number(calcFundResult.gszzl) < 0 ? 'text-down' : 'text-up'
            )}
          >
            {Utils.Yang(calcFundResult.gszzl)} %
          </div>
        ) : (
          <div
            className={classnames(
              styles.value,
              Number(calcFundResult.gszzl) < 0 ? 'block-down' : 'block-up'
            )}
          >
            {Utils.Yang(calcFundResult.gszzl)} %
          </div>
        )}
      </div>
      <Collapse style={{ zIndex: 1 }} isOpened={!!fund.collapse}>
        <div className={styles.collapseContent}>
          <section>
            <span>净值：</span>
            <span>{calcFundResult.dwjz}</span>
            {isFix && (
              <span style={{ flex: 1, textAlign: 'center' }}>
                ({Utils.Yang(calcFundResult.bjz)})
              </span>
            )}
          </section>
          <section>
            <span>估算值：</span>
            <span className={classnames({ [styles.unuseText]: isFix })}>
              {fund.gsz}
            </span>
            {!isFix && (
              <span style={{ flex: 1, textAlign: 'center' }}>
                ({Utils.Yang(calcFundResult.bjz)})
              </span>
            )}
          </section>
          <section>
            <span>持有份额：</span>
            <span>{calcFundResult.cyfe}</span>
            <EditIcon className={styles.editor} onClick={onEditClick} />
          </section>
          <section>
            <span>{isFix ? '今日收益：' : '今日收益估值：'}</span>
            <span
              className={classnames(
                Number(calcFundResult.jrsygz) < 0 ? 'text-down' : 'text-up'
              )}
            >
              ¥ {Utils.Yang(calcFundResult.jrsygz.toFixed(2))}
            </span>
          </section>
          <section>
            <span>净值日期：</span>
            <span>{calcFundResult.jzrq}</span>
          </section>
          <section>
            <span>{isFix ? '今日总值：' : '今日估算总值：'}</span>
            <span>¥ {calcFundResult.gszz.toFixed(2)}</span>
          </section>
          <div className={styles.view}>
            <a onClick={onDetailClick}>{'查看详情 >'}</a>
          </div>
        </div>
      </Collapse>
    </>
  );
};

export default FundRow;
