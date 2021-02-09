import React, { useState, useContext, useMemo } from 'react';
import { useScroll, useDebounceFn } from 'ahooks';
import { connect } from 'react-redux';
import classsames from 'classnames';
import { Dropdown, Menu } from 'antd';

import { ReactComponent as SortArrowUpIcon } from '../../assets/icons/sort-arrow-up.svg';
import { ReactComponent as SortArrowDownIcon } from '../../assets/icons/sort-arrow-down.svg';
import { ReactComponent as ArrowDownIcon } from '../../assets/icons/arrow-down.svg';
import { ReactComponent as ArrowUpIcon } from '../../assets/icons/arrow-up.svg';

import {
  getSortMode,
  setFundSortMode,
  getSortConfig,
  troggleFundSortOrder,
  setZindexSortMode,
  troggleZindexSortOrder,
} from '../../actions/sort';
import { StoreState } from '../../reducers/types';
import { TabsState } from '../../reducers/tabs';
import { HomeContext } from '../Home';
import * as Enums from '../../utils/enums';
import * as Utils from '../../utils';
import styles from './index.scss';

export interface SortBarProps {
  tabs: TabsState;
}

const SortBar: React.FC<SortBarProps> = ({ tabs }) => {
  const {
    sortFunds,
    sortZindexs,
    zindexs,
    funds,
    setFunds,
    setZindexs,
  } = useContext(HomeContext);
  const {
    fundSortMode: { type: fundSortType, order: fundSortorder },
    zindexSortMode: { type: zindexSortType, order: zindexSortorder },
  } = getSortMode();
  const {
    fundSortModeOptions,
    fundSortModeOptionsMap,
    zindexSortModeOptions,
    zindexSortModeOptionsMap,
  } = getSortConfig();
  const [visible, setVisible] = useState(true);
  const { run: debounceSetVisible } = useDebounceFn(() => setVisible(true), {
    wait: 200,
  });
  const [expandAllFunds, expandSomeFunds] = useMemo(() => {
    return [funds.every((_) => _.collapse), funds.some((_) => _.collapse)];
  }, [funds]);

  const [expandAllZindexs, expandSomwZindexs] = useMemo(() => {
    return [zindexs.every((_) => _.collapse), zindexs.some((_) => _.collapse)];
  }, [zindexs]);

  const troggleExpandAllFundsRow = () => {
    setFunds((funds) => {
      const cloneFunds = Utils.DeepCopy(funds);
      cloneFunds.forEach((_) => {
        _.collapse = !expandAllFunds;
      });
      return cloneFunds;
    });
  };

  const troggleExpandAllZindexsRow = () => {
    setZindexs((zindexs) => {
      const cloneZindexs = Utils.DeepCopy(zindexs);
      cloneZindexs.forEach((_) => {
        _.collapse = !expandAllZindexs;
      });
      return cloneZindexs;
    });
  };

  useScroll(document, () => {
    setVisible(false);
    debounceSetVisible();
    return true;
  });

  const renderMenu = () => {
    switch (tabs.activeKey) {
      case Enums.TabKeyType.Funds:
        return (
          <div className={styles.bar}>
            <div className={styles.arrow} onClick={troggleExpandAllFundsRow}>
              {expandAllFunds ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </div>
            <div className={styles.name} onClick={troggleExpandAllFundsRow}>
              基金名称
            </div>
            <div className={styles.mode}>
              <Dropdown
                placement="bottomRight"
                overlay={
                  <Menu>
                    {fundSortModeOptions.map(({ key, value }) => (
                      <Menu.Item
                        key={key}
                        onClick={() => {
                          setFundSortMode({
                            type: key,
                          });
                          sortFunds();
                        }}
                      >
                        {value}
                      </Menu.Item>
                    ))}
                  </Menu>
                }
              >
                <a>{fundSortModeOptionsMap[fundSortType].value}</a>
              </Dropdown>
            </div>
            <div
              className={styles.sort}
              onClick={() => {
                troggleFundSortOrder();
                sortFunds();
              }}
            >
              <SortArrowUpIcon
                className={classsames({
                  [styles.selectOrder]:
                    fundSortorder === Enums.SortOrderType.Asc,
                })}
              />
              <SortArrowDownIcon
                className={classsames({
                  [styles.selectOrder]:
                    fundSortorder === Enums.SortOrderType.Desc,
                })}
              />
            </div>
          </div>
        );
      case Enums.TabKeyType.Zindex:
        return (
          <div className={styles.bar}>
            <div className={styles.arrow} onClick={troggleExpandAllZindexsRow}>
              {expandAllZindexs ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </div>
            <div className={styles.name} onClick={troggleExpandAllZindexsRow}>
              指数名称
            </div>
            <div className={styles.mode}>
              <Dropdown
                placement="bottomRight"
                overlay={
                  <Menu>
                    {zindexSortModeOptions.map(({ key, value }) => (
                      <Menu.Item
                        key={key}
                        onClick={() => {
                          setZindexSortMode({
                            type: key,
                          });
                          sortZindexs();
                        }}
                      >
                        {value}
                      </Menu.Item>
                    ))}
                  </Menu>
                }
              >
                <a>{zindexSortModeOptionsMap[zindexSortType].value}</a>
              </Dropdown>
            </div>
            <div
              className={styles.sort}
              onClick={() => {
                troggleZindexSortOrder();
                sortZindexs();
              }}
            >
              <SortArrowUpIcon
                className={classsames({
                  [styles.selectOrder]:
                    zindexSortorder === Enums.SortOrderType.Asc,
                })}
              />
              <SortArrowDownIcon
                className={classsames({
                  [styles.selectOrder]:
                    zindexSortorder === Enums.SortOrderType.Desc,
                })}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={classsames(styles.content, { [styles.visible]: visible })}>
      {renderMenu()}
    </div>
  );
};

export default connect((state: StoreState) => ({
  tabs: state.tabs,
}))(SortBar);
