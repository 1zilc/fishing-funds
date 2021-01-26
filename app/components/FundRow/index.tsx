import React from 'react';
import { useBoolean } from 'ahooks';
import { Collapse } from 'react-collapse';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { StoreState } from '../../reducers/types';
import { ToolbarState } from '../../reducers/toolbar';
import { ReactComponent as MoneyIcon } from 'assets/icons/consumption.svg';
import { ReactComponent as RemoveIcon } from 'assets/icons/remove.svg';
import { ReactComponent as ArrowDownIcon } from 'assets/icons/arrow-down.svg';
import { ReactComponent as ArrowUpIcon } from 'assets/icons/arrow-up.svg';

import * as Utils from '../../utils';

import styles from './index.scss';

export interface Fund {
  name: string;
  fundcode: string;
  gztime: string;
  gszzl: string;
  jzrq: string;
  dwjz: string;
  gsz: string;
}

export interface RowProps {
  fund: Fund;
  index: number;
  toolbar: ToolbarState;
}
export const codes = [
  {
    code: '003834',
    cyfe: 1279.65
  },
  {
    code: '161725',
    cyfe: 3482.86
  },
  {
    code: '260108',
    cyfe: 2341.88
  },
  {
    code: '003984',
    cyfe: 1122.73
  },
  {
    code: '320007',
    cyfe: 0
  }
];

const codeMap = codes.reduce((r, c) => {
  r[c.code] = c;
  return r;
}, {} as { [index: string]: { code: string; cyfe: number } });

const FundRow: React.FC<RowProps> = props => {
  const { fund, toolbar } = props;
  const [collapse, { toggle }] = useBoolean(false);
  const { deleteStatus } = toolbar;

  const cyfe = codeMap[fund?.fundcode]?.cyfe || 0;
  const bjz = Utils.Minus(fund.gsz, fund.dwjz);
  const jrsygz = Utils.Multiply(cyfe, bjz).toFixed(2);
  const gszz = Utils.Multiply(fund.gsz, cyfe).toFixed(2);

  return (
    <div>
      <div className={styles.row}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          onClick={() => toggle()}
        >
          <div className={styles.arrow}>
            {collapse ? (
              <ArrowUpIcon style={{ width: 12, height: 12 }} />
            ) : (
              <ArrowDownIcon style={{ width: 12, height: 12 }} />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <span className={styles.fundName}>{fund.name} </span>
            </div>
            <div className={styles.rowBar}>
              <div>
                <span className={styles.code}> ({fund.fundcode}) </span>
                <span>{fund.gztime.slice(5)}</span>
              </div>
            </div>
          </div>
          <div
            className={classnames(
              styles.value,
              Number(fund.gszzl) < 0 ? styles.down : styles.up
            )}
          >
            {Utils.yang(fund.gszzl)} %
          </div>
          <div
            className={styles.remove}
            style={{ width: deleteStatus ? 20 : 0 }}
          >
            <RemoveIcon />
          </div>
        </div>
      </div>
      <Collapse isOpened={collapse}>
        <div className={styles.collapseContent}>
          <section>
            <span>当前净值：</span>
            <span>{fund.dwjz}</span>
          </section>
          <section>
            <span>估算值：</span>
            <span>{fund.gsz}</span>
            <span style={{ float: 'right' }}>({Utils.yang(bjz)})</span>
          </section>
          <section>
            <span>持有份额：</span>
            <span>{cyfe}</span>
          </section>
          <section>
            <span>今日收益估值：</span>
            <span>¥ {Utils.yang(jrsygz)}</span>
          </section>
          <section>
            <span>截止日期：</span>
            <span>{fund.jzrq}</span>
          </section>
          <section>
            <span>今日估算总值：</span>
            <span>¥ {gszz}</span>
          </section>
        </div>
      </Collapse>
    </div>
  );
};

export default connect((state: StoreState) => ({
  toolbar: state.toolbar
}))(FundRow);
