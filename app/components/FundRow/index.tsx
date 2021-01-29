import React from 'react';
import { useBoolean } from 'ahooks';
import { Collapse } from 'react-collapse';
import classnames from 'classnames';
import { connect } from 'react-redux';
import Drawer from 'rc-drawer';
import EditContent from '../EditContent';
import { StoreState } from '../../reducers/types';
import { ToolbarState } from '../../reducers/toolbar';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { ReactComponent as RemoveIcon } from 'assets/icons/remove.svg';
import { ReactComponent as ArrowDownIcon } from 'assets/icons/arrow-down.svg';
import { ReactComponent as ArrowUpIcon } from 'assets/icons/arrow-up.svg';

import * as Utils from '../../utils';
import { deleteFund, calcFund } from '../../actions/fund';

import styles from './index.scss';

export interface RowProps {
  fund: Fund.ResponseItem;
  index: number;
  toolbar: ToolbarState;
  onFresh: () => Promise<void>;
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

const arrowSize = {
  width: 12,
  height: 12
};

const FundRow: React.FC<RowProps> = props => {
  const { fund, toolbar } = props;
  const { deleteStatus } = toolbar;
  const [collapse, { toggle }] = useBoolean(true);

  const [
    showEditDrawer,
    {
      setTrue: openEditDrawer,
      setFalse: closeEditDrawer,
      toggle: ToggleEditDrawer
    }
  ] = useBoolean(false);
  const { cyfe, bjz, jrsygz, gszz } = calcFund(fund);

  const remove = async () => {
    await deleteFund(fund);
    props.onFresh();
  };

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
              <ArrowUpIcon style={{ ...arrowSize }} />
            ) : (
              <ArrowDownIcon style={{ ...arrowSize }} />
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
            {Utils.Yang(fund.gszzl)} %
          </div>
          <div
            className={styles.remove}
            style={{ width: deleteStatus ? 20 : 0 }}
          >
            <RemoveIcon
              onClick={e => {
                remove();
                e.stopPropagation();
              }}
            />
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
            <span>¥ {Utils.Yang(jrsygz.toFixed(2))}</span>
          </section>
          <section>
            <span>截止日期：</span>
            <span>{fund.jzrq}</span>
          </section>
          <section>
            <span>今日估算总值：</span>
            <span>¥ {gszz.toFixed(2)}</span>
          </section>
        </div>
      </Collapse>
      <Drawer
        open={showEditDrawer}
        showMask
        maskClosable
        level={null}
        handler={false}
        onClose={closeEditDrawer}
        placement="bottom"
      >
        <EditContent
          onEnter={() => {
            props.onFresh();
            closeEditDrawer();
          }}
          onClose={closeEditDrawer}
          fund={{ cyfe: Number(cyfe), code: fund.fundcode, name: fund.name }}
        />
      </Drawer>
    </div>
  );
};

export default connect((state: StoreState) => ({
  toolbar: state.toolbar
}))(FundRow);
