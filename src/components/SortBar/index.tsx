import React, { useState, useMemo } from 'react';
import { useScroll, useDebounceFn } from 'ahooks';
import { useSelector, useDispatch } from 'react-redux';
import classsames from 'classnames';
import { Dropdown, Menu } from 'antd';

import { ReactComponent as SortArrowUpIcon } from '@/assets/icons/sort-arrow-up.svg';
import { ReactComponent as SortArrowDownIcon } from '@/assets/icons/sort-arrow-down.svg';
import { ReactComponent as ArrowDownIcon } from '@/assets/icons/arrow-down.svg';
import { ReactComponent as ArrowUpIcon } from '@/assets/icons/arrow-up.svg';
import {
  getSortMode,
  getSortConfig,
  setFundSortMode,
  troggleFundSortOrder,
  setZindexSortMode,
  troggleZindexSortOrder,
  setQuotationSortMode,
  troggleQuotationSortOrder,
} from '@/actions/sort';
import { StoreState } from '@/reducers/types';
import { SORT_FUNDS, TOGGLE_FUNDS_COLLAPSE } from '@/actions/fund';
import { SORT_ZINDEXS, TOGGLE_ZINDEXS_COLLAPSE } from '@/actions/zindex';
import {
  SORT_QUOTATIONS,
  TOGGLE_QUOTATIONS_COLLAPSE,
} from '@/actions/quotation';
import * as Enums from '@/utils/enums';
import styles from './index.scss';

export interface SortBarProps {}

const SortBar: React.FC<SortBarProps> = () => {
  const dispatch = useDispatch();

  const {
    fundSortMode: { type: fundSortType, order: fundSortOrder },
    zindexSortMode: { type: zindexSortType, order: zindexSortOrder },
    quotationSortMode: { type: quotationSortType, order: quotationSortOrder },
  } = getSortMode();
  const {
    fundSortModeOptions,
    fundSortModeOptionsMap,
    zindexSortModeOptions,
    zindexSortModeOptionsMap,
    quotationSortModeOptions,
    quotationSortModeOptionsMap,
  } = getSortConfig();

  const [visible, setVisible] = useState(true);
  const { run: debounceSetVisible } = useDebounceFn(() => setVisible(true), {
    wait: 200,
  });
  const tabsActiveKey = useSelector(
    (state: StoreState) => state.tabs.activeKey
  );
  const funds = useSelector((state: StoreState) => state.fund.funds);
  const zindexs = useSelector((state: StoreState) => state.zindex.zindexs);
  const quotations = useSelector(
    (state: StoreState) => state.quotation.quotations
  );

  const [expandAllFunds, expandSomeFunds] = useMemo(() => {
    return [funds.every((_) => _.collapse), funds.some((_) => _.collapse)];
  }, [funds]);

  const [expandAllZindexs, expandSomwZindexs] = useMemo(() => {
    return [zindexs.every((_) => _.collapse), zindexs.some((_) => _.collapse)];
  }, [zindexs]);

  const [expandAllQuotations, expandSomwQuotations] = useMemo(() => {
    return [zindexs.every((_) => _.collapse), zindexs.some((_) => _.collapse)];
  }, [quotations]);

  const toggleFundsCollapse = () => {
    dispatch({
      type: TOGGLE_FUNDS_COLLAPSE,
    });
  };

  const toggleZindexsCollapse = () => {
    dispatch({
      type: TOGGLE_ZINDEXS_COLLAPSE,
    });
  };

  const toggleQuotationsCollapse = () => {
    dispatch({
      type: TOGGLE_QUOTATIONS_COLLAPSE,
    });
  };

  useScroll(document, () => {
    setVisible(false);
    debounceSetVisible();
    return true;
  });

  const renderMenu = () => {
    switch (tabsActiveKey) {
      case Enums.TabKeyType.Funds:
        return (
          <div className={styles.bar}>
            <div className={styles.arrow} onClick={toggleFundsCollapse}>
              {expandAllFunds ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </div>
            <div className={styles.name} onClick={toggleFundsCollapse}>
              基金名称
            </div>
            <div className={styles.mode}>
              <Dropdown
                placement="bottomRight"
                overlay={
                  <Menu
                    selectedKeys={[
                      String(fundSortModeOptionsMap[fundSortType].key),
                    ]}
                  >
                    {fundSortModeOptions.map(({ key, value }) => (
                      <Menu.Item
                        key={String(key)}
                        onClick={() => {
                          setFundSortMode({ type: key });
                          dispatch({ type: SORT_FUNDS });
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
                dispatch({ type: SORT_FUNDS });
              }}
            >
              <SortArrowUpIcon
                className={classsames({
                  [styles.selectOrder]:
                    fundSortOrder === Enums.SortOrderType.Asc,
                })}
              />
              <SortArrowDownIcon
                className={classsames({
                  [styles.selectOrder]:
                    fundSortOrder === Enums.SortOrderType.Desc,
                })}
              />
            </div>
          </div>
        );
      case Enums.TabKeyType.Zindex:
        return (
          <div className={styles.bar}>
            <div className={styles.arrow} onClick={toggleZindexsCollapse}>
              {expandAllZindexs ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </div>
            <div className={styles.name} onClick={toggleZindexsCollapse}>
              指数名称
            </div>
            <div className={styles.mode}>
              <Dropdown
                placement="bottomRight"
                overlay={
                  <Menu
                    selectedKeys={[
                      String(zindexSortModeOptionsMap[zindexSortType].key),
                    ]}
                  >
                    {zindexSortModeOptions.map(({ key, value }) => (
                      <Menu.Item
                        key={String(key)}
                        onClick={() => {
                          setZindexSortMode({
                            type: key,
                          });
                          dispatch({ type: SORT_ZINDEXS });
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
                dispatch({ type: SORT_ZINDEXS });
              }}
            >
              <SortArrowUpIcon
                className={classsames({
                  [styles.selectOrder]:
                    zindexSortOrder === Enums.SortOrderType.Asc,
                })}
              />
              <SortArrowDownIcon
                className={classsames({
                  [styles.selectOrder]:
                    zindexSortOrder === Enums.SortOrderType.Desc,
                })}
              />
            </div>
          </div>
        );
      case Enums.TabKeyType.Quotation:
        return (
          <div className={styles.bar}>
            <div className={styles.arrow} onClick={toggleQuotationsCollapse}>
              {expandAllQuotations ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </div>
            <div className={styles.name} onClick={toggleQuotationsCollapse}>
              板块名称
            </div>
            <div className={styles.mode}>
              <Dropdown
                placement="bottomRight"
                overlay={
                  <Menu
                    selectedKeys={[
                      String(
                        quotationSortModeOptionsMap[quotationSortType].key
                      ),
                    ]}
                  >
                    {quotationSortModeOptions.map(({ key, value }) => (
                      <Menu.Item
                        key={String(key)}
                        onClick={() => {
                          setQuotationSortMode({
                            type: key,
                          });
                          dispatch({ type: SORT_QUOTATIONS });
                        }}
                      >
                        {value}
                      </Menu.Item>
                    ))}
                  </Menu>
                }
              >
                <a>{quotationSortModeOptionsMap[quotationSortType].value}</a>
              </Dropdown>
            </div>
            <div
              className={styles.sort}
              onClick={() => {
                troggleQuotationSortOrder();
                dispatch({ type: SORT_QUOTATIONS });
              }}
            >
              <SortArrowUpIcon
                className={classsames({
                  [styles.selectOrder]:
                    quotationSortOrder === Enums.SortOrderType.Asc,
                })}
              />
              <SortArrowDownIcon
                className={classsames({
                  [styles.selectOrder]:
                    quotationSortOrder === Enums.SortOrderType.Desc,
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

export default SortBar;
