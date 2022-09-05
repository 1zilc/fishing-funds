import React, { useMemo } from 'react';
import clsx from 'clsx';

import EditIcon from '@/static/icon/edit.svg';
import ArrowDownIcon from '@/static/icon/arrow-down.svg';
import ArrowUpIcon from '@/static/icon/arrow-up.svg';
import Collapse from '@/components/Collapse';
import MemoNote from '@/components/MemoNote';
import { toggleFundCollapseAction } from '@/store/features/wallet';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';
import * as Enums from '@/utils/enums';
import styles from './index.module.scss';

export interface RowProps {
  fund: Fund.ResponseItem & Fund.ExtraRow & Fund.FixData;
  readOnly?: boolean;
  onEdit?: (fund: Fund.SettingItem, focus: 'cbj' | 'cyfe') => void;
  onDetail?: (code: string) => void;
}

const arrowSize = {
  width: 12,
  height: 12,
};

const FundRow: React.FC<RowProps> = (props) => {
  const { fund, readOnly } = props;
  const dispatch = useAppDispatch();
  const { conciseSetting } = useAppSelector((state) => state.setting.systemSetting);
  const fundConfigCodeMap = useAppSelector((state) => state.wallet.fundConfigCodeMap);
  const eyeStatus = useAppSelector((state) => state.wallet.eyeStatus);
  const calcFundResult = useMemo(() => Helpers.Fund.CalcFund(fund, fundConfigCodeMap), [fund, fundConfigCodeMap]);
  const { isFix } = calcFundResult;
  function onRowClick() {
    if (readOnly) {
      onDetailClick();
    } else {
      dispatch(toggleFundCollapseAction(fund));
    }
  }

  function onDetailClick() {
    if (props.onDetail) {
      props.onDetail(fund.fundcode!);
    }
  }

  function onEditClick(focus: 'cbj' | 'cyfe') {
    if (props.onEdit) {
      props.onEdit(
        {
          name: fund.name!,
          code: fund.fundcode!,
          cyfe: Number(calcFundResult.cyfe),
          cbj: calcFundResult.cbj,
          zdfRange: fundConfigCodeMap[fund.fundcode!]?.zdfRange,
          jzNotice: fundConfigCodeMap[fund.fundcode!]?.jzNotice,
          memo: fundConfigCodeMap[fund.fundcode!]?.memo,
        },
        focus
      );
    }
  }

  return (
    <>
      <div className={clsx(styles.row)} onClick={onRowClick}>
        {!readOnly && (
          <div className={styles.arrow}>
            {fund.collapse ? <ArrowUpIcon style={{ ...arrowSize }} /> : <ArrowDownIcon style={{ ...arrowSize }} />}
          </div>
        )}
        <div style={{ flex: 1, width: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className={styles.fundName}>{fund.name}</span>
            {!!calcFundResult.cyfe && <span className={styles.hold}>持有</span>}
            {/* 估算持有收益率 */}
            {!!calcFundResult.cbj && eyeStatus === Enums.EyeStatus.Open && (
              <span className={clsx(Utils.GetValueColor(calcFundResult.gscysyl).blockClass, styles.gscysyl)}>
                 {calcFundResult.gscysyl === '' ? `  0.00 %` : `${Utils.Yang(calcFundResult.gscysyl)} %`}
              </span>
            )}
            {isFix && <span className={styles.warn}>更新</span>}
          </div>
          {!conciseSetting && (
            <div className={styles.rowBar}>
              <div>
                <span className={styles.code}>{fund.fundcode}</span>
                <span>{isFix ? calcFundResult.fixDate : calcFundResult.gztime?.slice(5)}</span>
                {eyeStatus === Enums.EyeStatus.Open && (
                  <span className={clsx(Utils.GetValueColor(calcFundResult.jrsygz).textClass, styles.worth)}>
                    {Utils.Yang(calcFundResult.jrsygz.toFixed(2))}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        {conciseSetting ? (
          <div className={clsx(styles.conciseValue, Utils.GetValueColor(calcFundResult.gszzl).textClass)}>
            {calcFundResult.gszzl === '' ? `  0.00 %` : `${Utils.Yang(calcFundResult.gszzl)} %`}
          </div>
        ) : (
          <div className={clsx(styles.value, Utils.GetValueColor(calcFundResult.gszzl).blockClass)}>
            {calcFundResult.gszzl === '' ? `  0.00 %` : `${Utils.Yang(calcFundResult.gszzl)} %`}
          </div>
        )}
      </div>
      <Collapse style={{ zIndex: 1 }} isOpened={fund.collapse}>
        <div className={styles.collapseContent}>
          <section>
            <span>净值：</span>
            <span>{calcFundResult.dwjz}</span>
            <span>（{calcFundResult.jzrq}）</span>
          </section>
          <section>
            <span>成本价：</span>
            {calcFundResult.cbj !== undefined ? <span>{calcFundResult.cbj}</span> : <a onClick={() => onEditClick('cbj')}>录入</a>}
          </section>
          <section>
            <span>持有份额：</span>
            <span>{calcFundResult.cyfe}</span>
            <EditIcon className={styles.editor} onClick={() => onEditClick('cyfe')} />
          </section>
          <section>
            <span>成本金额：</span>
            <span>{calcFundResult.cbje !== undefined ? `¥ ${calcFundResult.cbje.toFixed(2)}` : '暂无'}</span>
          </section>
          <section>
            <span>持有收益率：</span>
            <span className={clsx(Utils.GetValueColor(calcFundResult.cysyl).textClass)}>
              {calcFundResult.cysyl !== undefined ? `${Utils.Yang(calcFundResult.cysyl.toFixed(2))}%` : '暂无'}
            </span>
          </section>
          <section>
            <span>{isFix ? '今日收益：' : '估算收益：'}</span>
            <span className={clsx(Utils.GetValueColor(calcFundResult.jrsygz).textClass)}>
              ¥ {Utils.Yang(calcFundResult.jrsygz.toFixed(2))}
            </span>
          </section>
          <section>
            <span>持有收益：</span>
            <span className={clsx(Utils.GetValueColor(calcFundResult.cysy).textClass)}>
              {calcFundResult.cysy !== undefined ? `¥ ${Utils.Yang(calcFundResult.cysy.toFixed(2))}` : '暂无'}
            </span>
          </section>
          <section>
            <span>{isFix ? '今日总额：' : '估算总值：'}</span>
            <span>¥ {calcFundResult.gszz.toFixed(2)}</span>
          </section>
          {calcFundResult.memo && <MemoNote text={calcFundResult.memo} />}
          <div className={styles.view}>
            <a onClick={onDetailClick}>{'查看详情 >'}</a>
          </div>
        </div>
      </Collapse>
    </>
  );
};

export default FundRow;
