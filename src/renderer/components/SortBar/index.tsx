import React, { useState, useMemo } from 'react';
import { useScroll, useDebounceFn, useBoolean } from 'ahooks';

import classsames from 'clsx';
import { Dropdown, Menu } from 'antd';

import SortArrowUpIcon from '@/static/icon/sort-arrow-up.svg';
import SortArrowDownIcon from '@/static/icon/sort-arrow-down.svg';
import ArrowDownIcon from '@/static/icon/arrow-down.svg';
import ArrowUpIcon from '@/static/icon/arrow-up.svg';
import LayoutListIcon from '@/static/icon/layout-list.svg';
import LayoutGridIcon from '@/static/icon/layout-grid.svg';

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
  setFundViewModeAction,
  setZindexViewModeAction,
  setQuotationViewModeAction,
  setStockViewModeAction,
  setCoinViewModeAction,
} from '@/actions/sort';
import CustomDrawer from '@/components/CustomDrawer';

import { toggleAllFundsCollapseAction } from '@/actions/fund';
import { toggleAllZindexsCollapseAction } from '@/actions/zindex';
import { toggleAllQuotationsCollapse } from '@/actions/quotation';
import { toggleAllStocksCollapseAction } from '@/actions/stock';
import { toggleAllCoinsCollapseAction } from '@/store/features/coin';
import {
  useScrollToTop,
  useFreshFunds,
  useFreshZindexs,
  useFreshQuotations,
  useFreshStocks,
  useFreshCoins,
  useCurrentWallet,
  useAppDispatch,
  useAppSelector,
} from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

const ManageFundContent = React.lazy(() => import('@/components/Home/FundView/ManageFundContent'));
const ManageStockContent = React.lazy(() => import('@/components/Home/StockView/ManageStockContent'));
const ManageCoinContent = React.lazy(() => import('@/components/Home/CoinView/ManageCoinContent'));
const ManageZindexContent = React.lazy(() => import('@/components/Home/ZindexView/ManageZindexContent'));
const FundFlowContent = React.lazy(() => import('@/components/Home/QuotationView/FundFlowContent'));

export interface SortBarProps {}

function FundsSortBar() {
  const dispatch = useAppDispatch();

  const {
    fundSortMode: { type: fundSortType, order: fundSortOrder },
  } = useAppSelector((state) => state.sort.sortMode);

  const {
    fundViewMode: { type: fundViewType },
  } = useAppSelector((state) => state.sort.viewMode);

  const { fundSortModeOptions, fundSortModeOptionsMap } = Helpers.Sort.GetSortConfig();

  const {
    currentWalletState: { funds },
  } = useCurrentWallet();

  const [showManageFundDrawer, { setTrue: openManageFundDrawer, setFalse: closeManageFundDrawer, toggle: ToggleManageFundDrawer }] =
    useBoolean(false);

  const [expandAllFunds, expandSomeFunds] = useMemo(() => {
    return [funds.every((_) => _.collapse), funds.some((_) => _.collapse)];
  }, [funds]);

  const freshFunds = useFreshFunds(CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY);

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
      <div className={styles.view}>
        {fundViewType === Enums.FundViewType.List && (
          <LayoutListIcon onClick={() => dispatch(setFundViewModeAction({ type: Enums.FundViewType.Grid }))} />
        )}
        {fundViewType === Enums.FundViewType.Grid && (
          <LayoutGridIcon onClick={() => dispatch(setFundViewModeAction({ type: Enums.FundViewType.List }))} />
        )}
      </div>
      <div className={styles.mode}>
        <Dropdown
          placement="bottomRight"
          overlay={
            <Menu
              selectedKeys={[String(fundSortModeOptionsMap[fundSortType].key)]}
              onClick={({ key }) => dispatch(setFundSortModeAction({ type: Number(key) as Enums.FundSortType }))}
              items={fundSortModeOptions}
            />
          }
        >
          <a>{fundSortModeOptionsMap[fundSortType].label}</a>
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
        <ManageFundContent
          onClose={closeManageFundDrawer}
          onEnter={() => {
            freshFunds();
            closeManageFundDrawer();
          }}
        />
      </CustomDrawer>
    </div>
  );
}

function ZindexSortBar() {
  const dispatch = useAppDispatch();

  const {
    zindexSortMode: { type: zindexSortType, order: zindexSortOrder },
  } = useAppSelector((state) => state.sort.sortMode);

  const {
    zindexViewMode: { type: zindexViewType },
  } = useAppSelector((state) => state.sort.viewMode);

  const { zindexSortModeOptions, zindexSortModeOptionsMap } = Helpers.Sort.GetSortConfig();

  const zindexs = useAppSelector((state) => state.zindex.zindexs);

  const [showManageZindexDrawer, { setTrue: openManageZindexDrawer, setFalse: closeManageZindexDrawer, toggle: ToggleManageZindexDrawer }] =
    useBoolean(false);

  const [expandAllZindexs, expandSomeZindexs] = useMemo(() => {
    return [zindexs.every((_) => _.collapse), zindexs.some((_) => _.collapse)];
  }, [zindexs]);

  const freshZindexs = useFreshZindexs(CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY);

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
      <div className={styles.view}>
        {zindexViewType === Enums.ZindexViewType.List && (
          <LayoutListIcon onClick={() => dispatch(setZindexViewModeAction({ type: Enums.ZindexViewType.Grid }))} />
        )}
        {zindexViewType === Enums.ZindexViewType.Grid && (
          <LayoutGridIcon onClick={() => dispatch(setZindexViewModeAction({ type: Enums.ZindexViewType.List }))} />
        )}
      </div>
      <div className={styles.mode}>
        <Dropdown
          placement="bottomRight"
          overlay={
            <Menu
              selectedKeys={[String(zindexSortModeOptionsMap[zindexSortType].key)]}
              onClick={({ key }) => dispatch(setZindexSortModeAction({ type: Number(key) as Enums.ZindexSortType }))}
              items={zindexSortModeOptions}
            />
          }
        >
          <a>{zindexSortModeOptionsMap[zindexSortType].label}</a>
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
        <ManageZindexContent
          onClose={closeManageZindexDrawer}
          onEnter={() => {
            freshZindexs();
            closeManageZindexDrawer();
          }}
        />
      </CustomDrawer>
    </div>
  );
}

function QuotationSortBar() {
  const dispatch = useAppDispatch();

  const {
    quotationSortMode: { type: quotationSortType, order: quotationSortOrder },
  } = useAppSelector((state) => state.sort.sortMode);

  const {
    quotationViewMode: { type: quotationViewType },
  } = useAppSelector((state) => state.sort.viewMode);

  const [showFundFlowDrawer, { setTrue: openFundFlowDrawer, setFalse: closeFundFlowDrawer }] = useBoolean(false);

  const { quotationSortModeOptions, quotationSortModeOptionsMap } = Helpers.Sort.GetSortConfig();

  const quotations = useAppSelector((state) => state.quotation.quotations);

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
        <a
          onClick={(e) => {
            openFundFlowDrawer();
            e.stopPropagation();
          }}
        >
          详情
        </a>
      </div>
      <div className={styles.view}>
        {quotationViewType === Enums.QuotationViewType.List && (
          <LayoutListIcon onClick={() => dispatch(setQuotationViewModeAction({ type: Enums.QuotationViewType.Grid }))} />
        )}
        {quotationViewType === Enums.QuotationViewType.Grid && (
          <LayoutGridIcon onClick={() => dispatch(setQuotationViewModeAction({ type: Enums.QuotationViewType.List }))} />
        )}
      </div>
      <div className={styles.mode}>
        <Dropdown
          placement="bottomRight"
          overlay={
            <Menu
              selectedKeys={[String(quotationSortModeOptionsMap[quotationSortType].key)]}
              onClick={({ key }) => dispatch(setQuotationSortModeAction({ type: Number(key) as Enums.QuotationSortType }))}
              items={quotationSortModeOptions}
            />
          }
        >
          <a>{quotationSortModeOptionsMap[quotationSortType].label}</a>
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
      <CustomDrawer show={showFundFlowDrawer}>
        <FundFlowContent onClose={closeFundFlowDrawer} onEnter={closeFundFlowDrawer} />
      </CustomDrawer>
    </div>
  );
}

function StockSortBar() {
  const dispatch = useAppDispatch();

  const {
    stockSortMode: { type: stockSortType, order: stockSortOrder },
  } = useAppSelector((state) => state.sort.sortMode);

  const {
    stockViewMode: { type: stockViewType },
  } = useAppSelector((state) => state.sort.viewMode);

  const { stockSortModeOptions, stockSortModeOptionsMap } = Helpers.Sort.GetSortConfig();

  const stocks = useAppSelector((state) => state.stock.stocks);

  const [showManageStockDrawer, { setTrue: openManageStockDrawer, setFalse: closeManageStockDrawer, toggle: ToggleManageStockDrawer }] =
    useBoolean(false);

  const [expandAllStocks, expandSomeStocks] = useMemo(() => {
    return [stocks.every((_) => _.collapse), stocks.some((_) => _.collapse)];
  }, [stocks]);

  const freshStocks = useFreshStocks(CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY);

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
      <div className={styles.view}>
        {stockViewType === Enums.StockViewType.List && (
          <LayoutListIcon onClick={() => dispatch(setStockViewModeAction({ type: Enums.StockViewType.Grid }))} />
        )}
        {stockViewType === Enums.StockViewType.Grid && (
          <LayoutGridIcon onClick={() => dispatch(setStockViewModeAction({ type: Enums.StockViewType.List }))} />
        )}
      </div>
      <div className={styles.mode}>
        <Dropdown
          placement="bottomRight"
          overlay={
            <Menu
              selectedKeys={[String(stockSortModeOptionsMap[stockSortType].key)]}
              onClick={({ key }) => dispatch(setStockSortModeAction({ type: Number(key) as Enums.StockSortType }))}
              items={stockSortModeOptions}
            />
          }
        >
          <a>{stockSortModeOptionsMap[stockSortType].label}</a>
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
        <ManageStockContent
          onClose={closeManageStockDrawer}
          onEnter={() => {
            freshStocks();
            closeManageStockDrawer();
          }}
        />
      </CustomDrawer>
    </div>
  );
}

function CoinSortBar() {
  const dispatch = useAppDispatch();

  const {
    coinSortMode: { type: coinSortType, order: coinSortOrder },
  } = useAppSelector((state) => state.sort.sortMode);

  const {
    coinViewMode: { type: coinViewType },
  } = useAppSelector((state) => state.sort.viewMode);

  const { coinSortModeOptions, coinSortModeOptionsMap } = Helpers.Sort.GetSortConfig();

  const coins = useAppSelector((state) => state.coin.coins);

  const [showManageCoinDrawer, { setTrue: openManageCoinDrawer, setFalse: closeManageCoinDrawer, toggle: ToggleManageCoinDrawer }] =
    useBoolean(false);

  const [expandAllCoins, expandSomeCoins] = useMemo(() => {
    return [coins.every((_) => _.collapse), coins.some((_) => _.collapse)];
  }, [coins]);

  const freshCoins = useFreshCoins(CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY);

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
      <div className={styles.view}>
        {coinViewType === Enums.CoinViewType.List && (
          <LayoutListIcon onClick={() => dispatch(setCoinViewModeAction({ type: Enums.CoinViewType.Grid }))} />
        )}
        {coinViewType === Enums.CoinViewType.Grid && (
          <LayoutGridIcon onClick={() => dispatch(setCoinViewModeAction({ type: Enums.CoinViewType.List }))} />
        )}
      </div>
      <div className={styles.mode}>
        <Dropdown
          placement="bottomRight"
          overlay={
            <Menu
              selectedKeys={[String(coinSortModeOptionsMap[coinSortType].key)]}
              onClick={({ key }) => dispatch(setCoinSortModeAction({ type: Number(key) as Enums.CoinSortType }))}
              items={coinSortModeOptions}
            />
          }
        >
          <a>{coinSortModeOptionsMap[coinSortType].label}</a>
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
        <ManageCoinContent
          onClose={closeManageCoinDrawer}
          onEnter={() => {
            freshCoins();
            closeManageCoinDrawer();
          }}
        />
      </CustomDrawer>
    </div>
  );
}

const SortBar: React.FC<SortBarProps> = () => {
  const [visible, setVisible] = useState(true);
  const { run: debounceSetVisible } = useDebounceFn(() => setVisible(true), {
    wait: 200,
  });
  const tabsActiveKey = useAppSelector((state) => state.tabs.activeKey);

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
