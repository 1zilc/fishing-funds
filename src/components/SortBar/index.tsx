import React, { useState, useContext } from 'react';
import { useScroll, useDebounceFn } from 'ahooks';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import classsames from 'classnames';
import { Dropdown, Menu } from 'antd';
import { StoreState } from '../../reducers/types';
import { ReactComponent as SortArrowUpIcon } from '../../assets/icons/sort-arrow-up.svg';
import { ReactComponent as SortArrowDownIcon } from '../../assets/icons/sort-arrow-down.svg';
import {
  getSortMode,
  setFundSortMode,
  getSortConfig,
  troggleFundSortOrder,
  setZindexSortMode,
  troggleZindexSortOrder,
} from '../../actions/sort';
import { TabsState } from '../../reducers/tabs';
import { HomeContext } from '../Home';
import * as Enums from '../../utils/enums';
import styles from './index.scss';

export interface SortBarProps {
  tabs: TabsState;
}

const SortBar: React.FC<SortBarProps> = ({ tabs }) => {
  const { sortFunds, sortZindex } = useContext(HomeContext);
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
            <div className={styles.name}>基金名称</div>
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
            <div className={styles.name}>指数名称</div>
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
                          sortZindex();
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
                sortZindex();
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
