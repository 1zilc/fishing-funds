import React, { useState, useMemo } from 'react';
import { useScroll, useDebounceFn, useBoolean } from 'ahooks';
import { useSelector, useDispatch } from 'react-redux';
import classsames from 'classnames';
import { Dropdown, Menu } from 'antd';

import SortArrowUpIcon from '@/static/icon/sort-arrow-up.svg';
import SortArrowDownIcon from '@/static/icon/sort-arrow-down.svg';
import ArrowDownIcon from '@/static/icon/arrow-down.svg';
import ArrowUpIcon from '@/static/icon/arrow-up.svg';
import {
  setFundSortModeAction,
  troggleFundSortOrderAction,
  setZindexSortModeAction,
  troggleZindexSortOrderAction,
  setQuotationSortModeAction,
  troggleQuotationSortOrderAction,
  setStockSortModeAction,
  troggleStockSortOrderAction,
  setCoinSortModeAction,
  troggleCoinSortOrderAction,
} from '@/actions/sort';
import CustomDrawer from '@/components/CustomDrawer';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import StandCard from '@/components/Card/StandCard';
import ManageFundContent from '@/components/Home/FundList/ManageFundContent';
import ManageWalletContent from '@/components/Wallet/ManageWalletContent';
import ManageStockContent from '@/components/Home/StockList/ManageStockContent';
import ManageCoinContent from '@/components/Home/CoinList/ManageCoinContent';
import FundStatisticsContent from '@/components/Home/FundList/FundStatisticsContent';
import ManageZindexContent from '@/components/Home/ZindexList/ManageZindexContent';
import { StoreState } from '@/reducers/types';
import { toggleAllFundsCollapseAction } from '@/actions/fund';
import { toggleAllZindexsCollapseAction } from '@/actions/zindex';
import { toggleAllQuotationsCollapse } from '@/actions/quotation';
import { toggleAllStocksCollapseAction } from '@/actions/stock';
import { toggleAllCoinsCollapseAction } from '@/actions/coin';
import { useCurrentWallet } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

export interface SortBarProps {}

function FundsSortBar() {
  const dispatch = useDispatch();

  const {
    fundSortMode: { type: fundSortType, order: fundSortOrder },
  } = useSelector((state: StoreState) => state.sort.sortMode);

  const { fundSortModeOptions, fundSortModeOptionsMap } = Helpers.Sort.GetSortConfig();

  const {
    currentWalletState: { funds },
  } = useCurrentWallet();

  const [showManageFundDrawer, { setTrue: openManageFundDrawer, setFalse: closeManageFundDrawer, toggle: ToggleManageFundDrawer }] =
    useBoolean(false);

  const [expandAllFunds, expandSomeFunds] = useMemo(() => {
    return [funds.every((_) => _.collapse), funds.some((_) => _.collapse)];
  }, [funds]);

  const toggleFundsCollapse = () => dispatch(toggleAllFundsCollapseAction());

  return (
    <div className={styles.bar}>
      <div className={styles.arrow} onClick={toggleFundsCollapse}>
        {expandAllFunds ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </div>
      <div className={styles.name} onClick={toggleFundsCollapse}>
        基金名称
        <a
          onClick={(e) => {
            openManageFundDrawer();
            e.stopPropagation();
          }}
        >
          管理
        </a>
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
      <CustomDrawer show={showManageFundDrawer}>
        <ManageFundContent onClose={closeManageFundDrawer} onEnter={closeManageFundDrawer} />
      </CustomDrawer>
    </div>
  );
}

function ZindexSortBar() {
  const dispatch = useDispatch();

  const {
    zindexSortMode: { type: zindexSortType, order: zindexSortOrder },
  } = useSelector((state: StoreState) => state.sort.sortMode);

  const { zindexSortModeOptions, zindexSortModeOptionsMap } = Helpers.Sort.GetSortConfig();

  const zindexs = useSelector((state: StoreState) => state.zindex.zindexs);

  const [showManageZindexDrawer, { setTrue: openManageZindexDrawer, setFalse: closeManageZindexDrawer, toggle: ToggleManageZindexDrawer }] =
    useBoolean(false);

  const [expandAllZindexs, expandSomeZindexs] = useMemo(() => {
    return [zindexs.every((_) => _.collapse), zindexs.some((_) => _.collapse)];
  }, [zindexs]);

  const toggleZindexsCollapse = () => dispatch(toggleAllZindexsCollapseAction());

  return (
    <div className={styles.bar}>
      <div className={styles.arrow} onClick={toggleZindexsCollapse}>
        {expandAllZindexs ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </div>
      <div className={styles.name} onClick={toggleZindexsCollapse}>
        指数名称
        <a
          onClick={(e) => {
            openManageZindexDrawer();
            e.stopPropagation();
          }}
        >
          管理
        </a>
      </div>
      <div className={styles.mode}>
        <Dropdown
          placement="bottomRight"
          overlay={
            <Menu selectedKeys={[String(zindexSortModeOptionsMap[zindexSortType].key)]}>
              {zindexSortModeOptions.map(({ key, value }) => (
                <Menu.Item key={String(key)} onClick={() => dispatch(setZindexSortModeAction({ type: key }))}>
                  {value}
                </Menu.Item>
              ))}
            </Menu>
          }
        >
          <a>{zindexSortModeOptionsMap[zindexSortType].value}</a>
        </Dropdown>
      </div>
      <div className={styles.sort} onClick={() => dispatch(troggleZindexSortOrderAction())}>
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
      <CustomDrawer show={showManageZindexDrawer}>
        <ManageZindexContent onClose={closeManageZindexDrawer} onEnter={closeManageZindexDrawer} />
      </CustomDrawer>
    </div>
  );
}

function QuotationSortBar() {
  const dispatch = useDispatch();

  const {
    quotationSortMode: { type: quotationSortType, order: quotationSortOrder },
  } = useSelector((state: StoreState) => state.sort.sortMode);

  const { quotationSortModeOptions, quotationSortModeOptionsMap } = Helpers.Sort.GetSortConfig();

  const quotations = useSelector((state: StoreState) => state.quotation.quotations);

  const [expandAllQuotations, expandSomeQuotations] = useMemo(() => {
    return [quotations.every((_) => _.collapse), quotations.some((_) => _.collapse)];
  }, [quotations]);

  const toggleQuotationsCollapse = () => dispatch(toggleAllQuotationsCollapse());

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
                <Menu.Item key={String(key)} onClick={() => dispatch(setQuotationSortModeAction({ type: key }))}>
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
}

function StockSortBar() {
  const dispatch = useDispatch();

  const {
    stockSortMode: { type: stockSortType, order: stockSortOrder },
  } = useSelector((state: StoreState) => state.sort.sortMode);

  const { stockSortModeOptions, stockSortModeOptionsMap } = Helpers.Sort.GetSortConfig();

  const stocks = useSelector((state: StoreState) => state.stock.stocks);

  const [showManageStockDrawer, { setTrue: openManageStockDrawer, setFalse: closeManageStockDrawer, toggle: ToggleManageStockDrawer }] =
    useBoolean(false);

  const [expandAllStocks, expandSomeStocks] = useMemo(() => {
    return [stocks.every((_) => _.collapse), stocks.some((_) => _.collapse)];
  }, [stocks]);

  const toggleStocksCollapse = () => dispatch(toggleAllStocksCollapseAction());

  return (
    <div className={styles.bar}>
      <div className={styles.arrow} onClick={toggleStocksCollapse}>
        {expandAllStocks ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </div>
      <div className={styles.name} onClick={toggleStocksCollapse}>
        股票名称
        <a
          onClick={(e) => {
            openManageStockDrawer();
            e.stopPropagation();
          }}
        >
          管理
        </a>
      </div>
      <div className={styles.mode}>
        <Dropdown
          placement="bottomRight"
          overlay={
            <Menu selectedKeys={[String(stockSortModeOptionsMap[stockSortType].key)]}>
              {stockSortModeOptions.map(({ key, value }) => (
                <Menu.Item key={String(key)} onClick={() => dispatch(setStockSortModeAction({ type: key }))}>
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
      <CustomDrawer show={showManageStockDrawer}>
        <ManageStockContent onClose={closeManageStockDrawer} onEnter={closeManageStockDrawer} />
      </CustomDrawer>
    </div>
  );
}

function CoinSortBar() {
  const dispatch = useDispatch();

  const {
    coinSortMode: { type: coinSortType, order: coinSortOrder },
  } = useSelector((state: StoreState) => state.sort.sortMode);

  const { coinSortModeOptions, coinSortModeOptionsMap } = Helpers.Sort.GetSortConfig();

  const coins = useSelector((state: StoreState) => state.coin.coins);

  const [showManageCoinDrawer, { setTrue: openManageCoinDrawer, setFalse: closeManageCoinDrawer, toggle: ToggleManageCoinDrawer }] =
    useBoolean(false);

  const [expandAllCoins, expandSomeCoins] = useMemo(() => {
    return [coins.every((_) => _.collapse), coins.some((_) => _.collapse)];
  }, [coins]);

  const toggleCoinsCollapse = () => dispatch(toggleAllCoinsCollapseAction());
  return (
    <div className={styles.bar}>
      <div className={styles.arrow} onClick={toggleCoinsCollapse}>
        {expandAllCoins ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </div>
      <div className={styles.name} onClick={toggleCoinsCollapse}>
        货币名称
        <a
          onClick={(e) => {
            openManageCoinDrawer();
            e.stopPropagation();
          }}
        >
          管理
        </a>
      </div>
      <div className={styles.mode}>
        <Dropdown
          placement="bottomRight"
          overlay={
            <Menu selectedKeys={[String(coinSortModeOptionsMap[coinSortType].key)]}>
              {coinSortModeOptions.map(({ key, value }) => (
                <Menu.Item key={String(key)} onClick={() => dispatch(setCoinSortModeAction({ type: key }))}>
                  {value}
                </Menu.Item>
              ))}
            </Menu>
          }
        >
          <a>{coinSortModeOptionsMap[coinSortType].value}</a>
        </Dropdown>
      </div>
      <div className={styles.sort} onClick={() => dispatch(troggleCoinSortOrderAction())}>
        <SortArrowUpIcon
          className={classsames({
            [styles.selectOrder]: coinSortOrder === Enums.SortOrderType.Asc,
          })}
        />
        <SortArrowDownIcon
          className={classsames({
            [styles.selectOrder]: coinSortOrder === Enums.SortOrderType.Desc,
          })}
        />
      </div>
      <CustomDrawer show={showManageCoinDrawer}>
        <ManageCoinContent onClose={closeManageCoinDrawer} onEnter={closeManageCoinDrawer} />
      </CustomDrawer>
    </div>
  );
}

const SortBar: React.FC<SortBarProps> = () => {
  const [visible, setVisible] = useState(true);
  const { run: debounceSetVisible } = useDebounceFn(() => setVisible(true), {
    wait: 200,
  });
  const tabsActiveKey = useSelector((state: StoreState) => state.tabs.activeKey);

  useScroll(document, () => {
    setVisible(false);
    debounceSetVisible();
    return true;
  });

  const renderSortBar = useMemo(() => {
    switch (tabsActiveKey) {
      case Enums.TabKeyType.Funds:
        return <FundsSortBar />;
      case Enums.TabKeyType.Zindex:
        return <ZindexSortBar />;
      case Enums.TabKeyType.Quotation:
        return <QuotationSortBar />;
      case Enums.TabKeyType.Stock:
        return <StockSortBar />;
      case Enums.TabKeyType.Coin:
        return <CoinSortBar />;
      default:
        return <></>;
    }
  }, [tabsActiveKey]);

  return <div className={classsames(styles.content, { [styles.visible]: visible })}>{renderSortBar}</div>;
};

export default SortBar;
