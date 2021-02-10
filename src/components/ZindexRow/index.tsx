import React, { useContext } from 'react';
import { useBoolean } from 'ahooks';
import { Collapse } from 'react-collapse';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { ReactComponent as ArrowDownLineIcon } from '../../assets/icons/arrow-down-line.svg';
import { ReactComponent as ArrowUpLineIcon } from '../../assets/icons/arrow-up-line.svg';
import { ReactComponent as ArrowDownIcon } from '../../assets/icons/arrow-down.svg';
import { ReactComponent as ArrowUpIcon } from '../../assets/icons/arrow-up.svg';

import { StoreState } from '../../reducers/types';
import { getSystemSetting } from '../../actions/setting';
import { HomeContext } from '../Home';
import * as Utils from '../../utils';

import styles from './index.scss';

export interface RowProps {
  zindex: Zindex.ResponseItem & Zindex.ExtraRow;
  index: number;
}

const arrowSize = {
  width: 12,
  height: 12,
};

const ZindexRow: React.FC<RowProps> = (props) => {
  const { zindex } = props;
  const { conciseSetting } = getSystemSetting();
  const { setZindexs } = useContext(HomeContext);

  const onToggleCollapse = () => {
    setZindexs((zindexs) => {
      const cloneZindexs = Utils.DeepCopy(zindexs);
      cloneZindexs.forEach((_) => {
        if (_.zindexCode === zindex.zindexCode) {
          _.collapse = !zindex.collapse;
        }
      });
      return cloneZindexs;
    });
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
          onClick={onToggleCollapse}
        >
          <div className={styles.arrow}>
            {zindex.collapse ? (
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
            {!conciseSetting && (
              <div className={styles.rowBar}>
                <div>
                  <span className={styles.code}>{zindex.zindexCode}</span>
                  {/* <span>{zindex.gztime.slice(5)}</span> */}
                </div>
              </div>
            )}
          </div>
          <div className={classnames(styles.value)}>
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
          </div>
        </div>
      </div>
      <Collapse isOpened={!!zindex.collapse}>
        <div className={styles.collapseContent}>
          {conciseSetting && (
            <section>
              <span>涨跌点：</span>
              <span
                className={classnames(zindex.zdd < 0 ? 'down-text' : 'up-text')}
              >
                {zindex.zdd}
              </span>
            </section>
          )}
          {conciseSetting && (
            <section>
              <span>涨跌幅：</span>
              <span
                className={classnames(zindex.zdf < 0 ? 'down-text' : 'up-text')}
              >
                {zindex.zdf}
              </span>
            </section>
          )}
          <section>
            <span>今开：</span>
            <span
              className={classnames(
                zindex.jk < zindex.zs ? 'down-text' : 'up-text'
              )}
            >
              {zindex.jk}
            </span>
          </section>
          <section>
            <span>昨收：</span>
            <span>{zindex.zs}</span>
          </section>
          <section>
            <span>最高：</span>
            <span
              className={classnames(
                zindex.zg < zindex.zs ? 'down-text' : 'up-text'
              )}
            >
              {zindex.zg}
            </span>
          </section>
          <section>
            <span>最低：</span>
            <span
              className={classnames(
                zindex.zd < zindex.zs ? 'down-text' : 'up-text'
              )}
            >
              {zindex.zd}
            </span>
          </section>
          <section>
            <span>换手：</span>
            <span>{zindex.hs} %</span>
          </section>
          <section>
            <span>振幅：</span>
            <span>{zindex.zf} %</span>
          </section>
          {conciseSetting && (
            <section>
              <span>指数代码：</span>
              <span>{zindex.zindexCode}</span>
            </section>
          )}
        </div>
      </Collapse>
    </div>
  );
};

export default connect((state: StoreState) => ({
  toolbar: state.toolbar,
}))(ZindexRow);
