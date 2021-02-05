import React, { useContext } from 'react';
import { useBoolean } from 'ahooks';
import { Collapse } from 'react-collapse';
import classnames from 'classnames';
import { connect } from 'react-redux';
import Drawer from 'rc-drawer';

import { ReactComponent as EditIcon } from '../../assets/icons/edit.svg';
import { ReactComponent as RemoveIcon } from '../../assets/icons/remove.svg';
import { ReactComponent as ArrowDownIcon } from '../../assets/icons/arrow-down.svg';
import { ReactComponent as ArrowUpIcon } from '../../assets/icons/arrow-up.svg';

import EditContent from '../EditContent';
import { StoreState } from '../../reducers/types';
import { ToolbarState } from '../../reducers/toolbar';
import { deleteFund, calcFund } from '../../actions/fund';
import { HomeContext } from '../Home';
import * as Utils from '../../utils';

import styles from './index.scss';

export interface RowProps {
  zindex: Zindex.ResponseItem;
  index: number;
}

const arrowSize = {
  width: 12,
  height: 12,
};

const ZindexRow: React.FC<RowProps> = (props) => {
  const { zindex } = props;
  const [collapse, { toggle }] = useBoolean(false);

  return (
    <div>
      <div className={styles.row}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
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
                alignItems: 'center',
              }}
            >
              <span className={styles.zindexName}>{zindex.name}</span>
            </div>
            <div className={styles.rowBar}>
              <div>
                <span className={styles.code}>{zindex.zindexCode}</span>
                {/* <span>{zindex.gztime.slice(5)}</span> */}
              </div>
            </div>
          </div>
          <div className={classnames(styles.value)}>
            <div
              className={classnames(
                styles.zsz,
                zindex.zdf < 0 ? styles.down : styles.up
              )}
            >
              {zindex.zsz}
            </div>
            <div className={styles.zd}>
              <div
                className={classnames(
                  styles.zde,
                  zindex.zde < 0 ? styles.down : styles.up
                )}
              >
                {Utils.Yang(zindex.zde)}
              </div>
              <div
                className={classnames(
                  styles.zdf,
                  zindex.zdf < 0 ? styles.down : styles.up
                )}
              >
                {Utils.Yang(zindex.zdf)} %
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect((state: StoreState) => ({
  toolbar: state.toolbar,
}))(ZindexRow);
