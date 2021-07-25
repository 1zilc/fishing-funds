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
  setFundSortModeAction,
  troggleFundSortOrderAction,
  setZindexSortModeAction,
  troggleZindexSortOrderAction,
  setQuotationSortModeAction,
  troggleQuotationSortOrderAction,
  setStockSortModeAction,
  troggleStockSortOrderAction,
} from '@/actions/sort';
import { StoreState } from '@/reducers/types';
import { toggleAllFundsCollapseAction } from '@/actions/fund';
import { SORT_ZINDEXS, TOGGLE_ZINDEXS_COLLAPSE } from '@/actions/zindex';
import { SORT_QUOTATIONS, TOGGLE_QUOTATIONS_COLLAPSE } from '@/actions/quotation';
import { SORT_STOCKS, TOGGLE_STOCKS_COLLAPSE } from '@/actions/stock';
import { useCurrentWallet } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as Helpers from '@/helpers';
import styles from './index.scss';

export interface SortBarProps {}

const SortBar: React.FC<SortBarProps> = () => {
  const dispatch = useDispatch();

  const {
    fundSortMode: { type: fundSortType, order: fundSortOrder },
    zindexSortMode: { type: zindexSortType, order: zindexSortOrder },
    quotationSortMode: { type: quotationSortType, order: quotationSortOrder },
    stockSortMode: { type: stockSortType, order: stockSortOrder },
  } = useSelector((state: StoreState) => state.sort.sortMode);

  const {
    fundSortModeOptions,
    fundSortModeOptionsMap,
    zindexSortModeOptions,
    zindexSortModeOptionsMap,
    quotationSortModeOptions,
    quotationSortModeOptionsMap,
    stockSortModeOptions,
    stockSortModeOptionsMap,
  } = Helpers.Sort.GetSortConfig();

  const [visible, setVisible] = useState(true);
  const { run: debounceSetVisible } = useDebounceFn(() => setVisible(true), {
    wait: 200,
  });
  const tabsActiveKey = useSelector((state: StoreState) => state.tabs.activeKey);
  const {
    currentWalletState: { funds },
  } = useCurrentWallet();
  const zindexs = useSelector((state: StoreState) => state.zindex.zindexs);
  const quotations = useSelector((state: StoreState) => state.quotation.quotations);
  const stocks = useSelector((state: StoreState) => state.stock.stocks);

  const [expandAllFunds, expandSomeFunds] = useMemo(() => {
    return [funds.every((_) => _.collapse), funds.some((_) => _.collapse)];
  }, [funds]);

  const [expandAllZindexs, expandSomeZindexs] = useMemo(() => {
    return [zindexs.every((_) => _.collapse), zindexs.some((_) => _.collapse)];
  }, [zindexs]);

  const [expandAllQuotations, expandSomeQuotations] = useMemo(() => {
    return [quotations.every((_) => _.collapse), quotations.some((_) => _.collapse)];
  }, [quotations]);

  const [expandAllStocks, expandSomeStocks] = useMemo(() => {
    return [stocks.every((_) => _.collapse), stocks.some((_) => _.collapse)];
  }, [stocks]);

  const toggleZindexsCollapse = () => {
    dispatch({ type: TOGGLE_ZINDEXS_COLLAPSE });
  };

  const toggleQuotationsCollapse = () => {
    dispatch({ type: TOGGLE_QUOTATIONS_COLLAPSE });
  };

  const toggleStocksCollapse = () => {
    dispatch({ type: TOGGLE_STOCKS_COLLAPSE });
  };

  useScroll(document, () => {
    setVisible(false);
    debounceSetVisible();
    return true;
  });

  function renderMenu() {
    switch (tabsActiveKey) {
      case Enums.TabKeyType.Funds:
        return (
          <div className={styles.bar}>
            <div className={styles.arrow} onClick={() => dispatch(toggleAllFundsCollapseAction())}>
              {expandAllFunds ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </div>
            <div className={styles.name} onClick={() => dispatch(toggleAllFundsCollapseAction())}>
              基金名称
            </div>
            <div className={styles.mode}>
              <Dropdown
                placement="bottomRight"
                overlay={
                  <Menu selectedKeys={[String(fundSortModeOptionsMap[fundSortType].key)]}>
                    {fundSortModeOptions.map(({ key, value }) => (
                      <Menu.Item key={String(key)} onClick={() => dispatch(setFundSortModeAction({ type: key }))}>
                        {value}
                      </Menu.Item>
                    ))}
                  </Menu>
                }
              >
                <a>{fundSortModeOptionsMap[fundSortType].value}</a>
              </Dropdown>
            </div>
            <div className={styles.sort} onClick={() => dispatch(troggleFundSortOrderAction())}>
              <SortArrowUpIcon
                className={classsames({
                  [styles.selectOrder]: fundSortOrder === Enums.SortOrderType.Asc,
                })}
              />
              <SortArrowDownIcon
                className={classsames({
                  [styles.selectOrder]: fundSortOrder === Enums.SortOrderType.Desc,
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
                  <Menu selectedKeys={[String(zindexSortModeOptionsMap[zindexSortType].key)]}>
                    {zindexSortModeOptions.map(({ key, value }) => (
                      <Menu.Item
                        key={String(key)}
                        onClick={() =>
                          dispatch(
                            setZindexSortModeAction({
                              type: key,
                            })
                          )
                        }
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
            <div className={styles.sort} onClick={() => troggleZindexSortOrderAction()}>
              <SortArrowUpIcon
                className={classsames({
                  [styles.selectOrder]: zindexSortOrder === Enums.SortOrderType.Asc,
                })}
              />
              <SortArrowDownIcon
                className={classsames({
                  [styles.selectOrder]: zindexSortOrder === Enums.SortOrderType.Desc,
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
                  <Menu selectedKeys={[String(quotationSortModeOptionsMap[quotationSortType].key)]}>
                    {quotationSortModeOptions.map(({ key, value }) => (
                      <Menu.Item key={String(key)} onClick={() => setQuotationSortModeAction({ type: key })}>
                        {value}
                      </Menu.Item>
                    ))}
                  </Menu>
                }
              >
                <a>{quotationSortModeOptionsMap[quotationSortType].value}</a>
              </Dropdown>
            </div>
            <div className={styles.sort} onClick={() => dispatch(troggleQuotationSortOrderAction())}>
              <SortArrowUpIcon
                className={classsames({
                  [styles.selectOrder]: quotationSortOrder === Enums.SortOrderType.Asc,
                })}
              />
              <SortArrowDownIcon
                className={classsames({
                  [styles.selectOrder]: quotationSortOrder === Enums.SortOrderType.Desc,
                })}
              />
            </div>
          </div>
        );
      case Enums.TabKeyType.Stock:
        return (
          <div className={styles.bar}>
            <div className={styles.arrow} onClick={toggleStocksCollapse}>
              {expandAllStocks ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </div>
            <div className={styles.name} onClick={toggleStocksCollapse}>
              股票名称
            </div>
            <div className={styles.mode}>
              <Dropdown
                placement="bottomRight"
                overlay={
                  <Menu selectedKeys={[String(stockSortModeOptionsMap[stockSortType].key)]}>
                    {stockSortModeOptions.map(({ key, value }) => (
                      <Menu.Item
                        key={String(key)}
                        onClick={() =>
                          dispatch(
                            setStockSortModeAction({
                              type: key,
                            })
                          )
                        }
                      >
                        {value}
                      </Menu.Item>
                    ))}
                  </Menu>
                }
              >
                <a>{stockSortModeOptionsMap[stockSortType].value}</a>
              </Dropdown>
            </div>
            <div className={styles.sort} onClick={() => dispatch(troggleStockSortOrderAction())}>
              <SortArrowUpIcon
                className={classsames({
                  [styles.selectOrder]: stockSortOrder === Enums.SortOrderType.Asc,
                })}
              />
              <SortArrowDownIcon
                className={classsames({
                  [styles.selectOrder]: stockSortOrder === Enums.SortOrderType.Desc,
                })}
              />
            </div>
          </div>
        );
      default:
        return <></>;
    }
  }

  return <div className={classsames(styles.content, { [styles.visible]: visible })}>{renderMenu()}</div>;
};

export default SortBar;
