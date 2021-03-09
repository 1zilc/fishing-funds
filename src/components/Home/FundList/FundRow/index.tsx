import React, { useCallback } from 'react';
import { useBoolean } from 'ahooks';
import { Collapse } from 'react-collapse';
import classnames from 'classnames';
import { useDispatch } from 'react-redux';

import { ReactComponent as EditIcon } from '@/assets/icons/edit.svg';
import { ReactComponent as ArrowDownIcon } from '@/assets/icons/arrow-down.svg';
import { ReactComponent as ArrowUpIcon } from '@/assets/icons/arrow-up.svg';
import EditFundContent from '@/components/Home/FundList/EditFundContent';
import DetailFundContent from '@/components/Home/FundList/DetailFundContent';
import CustomDrawer from '@/components/CustomDrawer';

import { TOGGLE_FUND_COLLAPSE, calcFund, loadFunds } from '@/actions/fund';
import { getSystemSetting } from '@/actions/setting';
import * as Utils from '@/utils';
import { useScrollToTop, useActions } from '@/utils/hooks';
import styles from './index.scss';

export interface RowProps {
  fund: Fund.ResponseItem & Fund.ExtraRow & Fund.FixData;
  readOnly?: boolean;
}

const arrowSize = {
  width: 12,
  height: 12,
};

const FundRow: React.FC<RowProps> = ({ fund, readOnly }) => {
  const dispatch = useDispatch();
  const { conciseSetting } = getSystemSetting();
  const runLoadFunds = useActions(loadFunds);
  const freshFunds = useScrollToTop({ after: runLoadFunds });
  const isFix = fund.fixDate === fund.gztime?.slice(5, 10);
  const [
    showEditDrawer,
    {
      setTrue: openEditDrawer,
      setFalse: closeEditDrawer,
      toggle: ToggleEditDrawer,
    },
  ] = useBoolean(false);

  const [
    showDetailDrawer,
    {
      setTrue: openDetailDrawer,
      setFalse: closeDetailDrawer,
      toggle: ToggleDetailDrawer,
    },
  ] = useBoolean(false);

  const { cyfe, bjz, jrsygz, gszz } = calcFund(fund);

  const onRowClick = () =>
    readOnly
      ? openDetailDrawer()
      : dispatch({
          type: TOGGLE_FUND_COLLAPSE,
          payload: fund,
        });

  const onFundEdit = () => {
    freshFunds();
    closeEditDrawer();
  };

  return (
    <div>
      <div className={styles.row}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onClick={onRowClick}
        >
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
              <span className={styles.fundName}>{fund.name}</span>
            </div>
            {!conciseSetting && (
              <div className={styles.rowBar}>
                <div>
                  <span className={styles.code}>{fund.fundcode}</span>
                  <span>{fund.gztime?.slice(5)}</span>
                </div>
              </div>
            )}
          </div>
          <div
            className={classnames(
              styles.value,
              Number(fund.gszzl) < 0 ? 'bg-down' : 'bg-up'
            )}
          >
            {Utils.Yang(fund.gszzl)} %
          </div>
        </div>
      </div>
      <Collapse isOpened={!!fund.collapse}>
        <div className={styles.collapseContent}>
          {conciseSetting && (
            <section>
              <span>基金代码：</span>
              <span>{fund.fundcode}</span>
            </section>
          )}
          {conciseSetting && (
            <section>
              <span>估值时间：</span>
              <span>{fund.gztime?.slice(5)}</span>
            </section>
          )}
          <section>
            <span>当前净值：</span>
            <span>{fund.dwjz}</span>
          </section>
          <section>
            <span>估算值：</span>
            <span>{fund.gsz}</span>
            <span style={{ flex: 1, textAlign: 'right' }}>
              ({Utils.Yang(bjz)})
            </span>
          </section>
          <section>
            <span>持有份额：</span>
            <span>{cyfe}</span>
            <EditIcon className={styles.editor} onClick={openEditDrawer} />
          </section>
          <section>
            <span>今日收益估值：</span>
            <span
              className={classnames(
                Number(jrsygz) < 0 ? 'text-down' : 'text-up'
              )}
            >
              ¥ {Utils.Yang(jrsygz.toFixed(2))}
            </span>
          </section>
          <section>
            <span>净值日期：</span>
            <span>{fund.jzrq}</span>
          </section>
          <section>
            <span>今日估算总值：</span>
            <span>¥ {gszz.toFixed(2)}</span>
          </section>
          <div className={styles.view}>
            <a onClick={openDetailDrawer}>{'查看详情 >'}</a>
          </div>
        </div>
      </Collapse>
      <CustomDrawer show={showEditDrawer}>
        <EditFundContent
          onClose={closeEditDrawer}
          onEnter={onFundEdit}
          fund={{ cyfe: Number(cyfe), code: fund.fundcode!, name: fund.name! }}
        />
      </CustomDrawer>
      <CustomDrawer show={showDetailDrawer}>
        <DetailFundContent
          onEnter={closeDetailDrawer}
          onClose={closeDetailDrawer}
          code={fund.fundcode!}
        />
      </CustomDrawer>
    </div>
  );
};

export default FundRow;
