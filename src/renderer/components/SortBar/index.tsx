import React, { useState, useMemo } from 'react';
import { useScroll, useDebounceFn, useBoolean } from 'ahooks';
import classsames from 'clsx';
import { Dropdown, Menu } from 'antd';
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiArrowDownSFill,
  RiArrowUpSFill,
  RiListUnordered,
  RiDashboardLine,
  RiLayout4Line,
  RiLineChartLine,
  RiSearchLine,
} from 'react-icons/ri';

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
} from '@/store/features/sort';
import CustomDrawer from '@/components/CustomDrawer';
import { toggleAllZindexsCollapseAction } from '@/store/features/zindex';
import { toggleAllQuotationsCollapseAction } from '@/store/features/quotation';
import { toggleAllStocksCollapseAction } from '@/store/features/stock';
import { toggleAllCoinsCollapseAction } from '@/store/features/coin';
import { toggleAllFundsCollapseAction } from '@/store/features/wallet';
import {
  useFreshFunds,
  useFreshZindexs,
  useFreshStocks,
  useFreshCoins,
  useAppDispatch,
  useAppSelector,
} from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

const ManageFundContent = React.lazy(() => import('@/components/Home/FundView/ManageFundContent'));
const AddFundContent = React.lazy(() => import('@/components/Home/FundView/AddFundContent'));
const ManageStockContent = React.lazy(() => import('@/components/Home/StockView/ManageStockContent'));
const FundStatisticsContent = React.lazy(() => import('@/components/Home/FundView/FundStatisticsContent'));
const AddStockContent = React.lazy(() => import('@/components/Home/StockView/AddStockContent'));
const ManageCoinContent = React.lazy(() => import('@/components/Home/CoinView/ManageCoinContent'));
const AddCoinContent = React.lazy(() => import('@/components/Home/CoinView/AddCoinContent'));
const ManageZindexContent = React.lazy(() => import('@/components/Home/ZindexView/ManageZindexContent'));
const AddZindexContent = React.lazy(() => import('@/components/Home/ZindexView/AddZindexContent'));
const FundFlowContent = React.lazy(() => import('@/components/Home/QuotationView/FundFlowContent'));
const NewsContent = React.lazy(() => import('@/components/Home/NewsList/NewsContent'));
const StockRankingContent = React.lazy(() => import('@/components/Home/StockView/StockRankingContent'));
const CoinRankingContent = React.lazy(() => import('@/components/Home/CoinView/CoinRankingContent'));
const FundRankingContent = React.lazy(() => import('@/components/Home/FundView/FundRankingContent'));

export interface SortBarProps {}

function FundsSortBar() {
  const dispatch = useAppDispatch();

  const {
    fundSortMode: { type: fundSortType, order: fundSortOrder },
  } = useAppSelector((state) => state.sort.sortMode);

  const {
    fundViewMode: { type: fundViewType },
  } = useAppSelector((state) => state.sort.viewMode);

  const { funds } = useAppSelector((state) => state.wallet.currentWallet);

  const { fundSortModeOptions, fundSortModeOptionsMap } = Helpers.Sort.GetSortConfig();

  const [
    showManageFundDrawer,
    { setTrue: openManageFundDrawer, setFalse: closeManageFundDrawer, toggle: ToggleManageFundDrawer },
  ] = useBoolean(false);
  const [showAddFundDrawer, { setTrue: openAddFundDrawer, setFalse: closeAddFundDrawer, toggle: ToggleAddFundDrawer }] =
    useBoolean(false);
  const [showFundRankingDrawer, { setTrue: openFundRankingDrawer, setFalse: closeFundRankingDrawer }] =
    useBoolean(false);

  const [expandAllFunds, expandSomeFunds] = useMemo(() => {
    return [funds.every((_) => _.collapse), funds.some((_) => _.collapse)];
  }, [funds]);

  const freshFunds = useFreshFunds(CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY);

  const toggleFundsCollapse = () => dispatch(toggleAllFundsCollapseAction());

  return (
    <div className={styles.bar}>
      <div className={styles.arrow} onClick={toggleFundsCollapse}>
        {expandAllFunds ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
      </div>
      <div className={styles.name} onClick={toggleFundsCollapse}>
        <span>基金名称</span>
        <a
          onClick={(e) => {
            openManageFundDrawer();
            e.stopPropagation();
          }}
        >
          管理
        </a>
        <a
          onClick={(e) => {
            openFundRankingDrawer();
            e.stopPropagation();
          }}
        >
          榜单
        </a>
        <div className={styles.view}>
          <RiSearchLine
            onClick={(e) => {
              openAddFundDrawer();
              e.stopPropagation();
            }}
          />
        </div>
      </div>
      <div className={styles.view}>
        {fundViewType === Enums.FundViewType.List && (
          <RiListUnordered onClick={() => dispatch(setFundViewModeAction({ type: Enums.FundViewType.Grid }))} />
        )}
        {fundViewType === Enums.FundViewType.Grid && (
          <RiDashboardLine onClick={() => dispatch(setFundViewModeAction({ type: Enums.FundViewType.List }))} />
        )}
      </div>
      <div className={styles.mode}>
        <Dropdown
          placement="bottomRight"
          dropdownRender={() => (
            <Menu
              selectedKeys={[String(fundSortModeOptionsMap[fundSortType].key)]}
              onClick={({ key }) => dispatch(setFundSortModeAction({ type: Number(key) as Enums.FundSortType }))}
              items={fundSortModeOptions}
            />
          )}
        >
          <a>{fundSortModeOptionsMap[fundSortType].label}</a>
        </Dropdown>
      </div>
      <div className={styles.sort} onClick={() => dispatch(troggleFundSortOrderAction())}>
        <RiArrowUpSFill
          className={classsames({
            [styles.selectOrder]: fundSortOrder === Enums.SortOrderType.Asc,
          })}
        />
        <RiArrowDownSFill
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
      <CustomDrawer show={showAddFundDrawer}>
        <AddFundContent
          onClose={closeAddFundDrawer}
          onEnter={() => {
            freshFunds();
            closeAddFundDrawer();
          }}
        />
      </CustomDrawer>
      <CustomDrawer show={showFundRankingDrawer}>
        <FundRankingContent onClose={closeFundRankingDrawer} onEnter={closeFundRankingDrawer} />
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

  const [
    showManageZindexDrawer,
    { setTrue: openManageZindexDrawer, setFalse: closeManageZindexDrawer, toggle: ToggleManageZindexDrawer },
  ] = useBoolean(false);
  const [
    showAddZindexDrawer,
    { setTrue: openAddZindexDrawer, setFalse: closeAddZindexDrawer, toggle: ToggleAddZindexDrawer },
  ] = useBoolean(false);
  const [showNewsDrawer, { setTrue: openNewsDrawer, setFalse: closeNewsDrawer }] = useBoolean(false);

  const [expandAllZindexs, expandSomeZindexs] = useMemo(() => {
    return [zindexs.every((_) => _.collapse), zindexs.some((_) => _.collapse)];
  }, [zindexs]);

  const freshZindexs = useFreshZindexs(CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY);

  const toggleZindexsCollapse = () => dispatch(toggleAllZindexsCollapseAction());

  return (
    <div className={styles.bar}>
      <div className={styles.arrow} onClick={toggleZindexsCollapse}>
        {expandAllZindexs ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
      </div>
      <div className={styles.name} onClick={toggleZindexsCollapse}>
        <span>指数名称</span>
        <a
          onClick={(e) => {
            openManageZindexDrawer();
            e.stopPropagation();
          }}
        >
          管理
        </a>
        <a
          onClick={(e) => {
            openNewsDrawer();
            e.stopPropagation();
          }}
        >
          新闻
        </a>
        <div className={styles.view}>
          <RiSearchLine
            onClick={(e) => {
              openAddZindexDrawer();
              e.stopPropagation();
            }}
          />
        </div>
      </div>
      <div className={styles.view}>
        {zindexViewType === Enums.ZindexViewType.List && (
          <RiListUnordered onClick={() => dispatch(setZindexViewModeAction({ type: Enums.ZindexViewType.Grid }))} />
        )}
        {zindexViewType === Enums.ZindexViewType.Grid && (
          <RiDashboardLine onClick={() => dispatch(setZindexViewModeAction({ type: Enums.ZindexViewType.Chart }))} />
        )}
        {zindexViewType === Enums.ZindexViewType.Chart && (
          <RiLineChartLine onClick={() => dispatch(setZindexViewModeAction({ type: Enums.ZindexViewType.List }))} />
        )}
      </div>
      <div className={styles.mode}>
        <Dropdown
          placement="bottomRight"
          dropdownRender={() => (
            <Menu
              selectedKeys={[String(zindexSortModeOptionsMap[zindexSortType].key)]}
              onClick={({ key }) => dispatch(setZindexSortModeAction({ type: Number(key) as Enums.ZindexSortType }))}
              items={zindexSortModeOptions}
            />
          )}
        >
          <a>{zindexSortModeOptionsMap[zindexSortType].label}</a>
        </Dropdown>
      </div>
      <div className={styles.sort} onClick={() => dispatch(troggleZindexSortOrderAction())}>
        <RiArrowUpSFill
          className={classsames({
            [styles.selectOrder]: zindexSortOrder === Enums.SortOrderType.Asc,
          })}
        />
        <RiArrowDownSFill
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
      <CustomDrawer show={showAddZindexDrawer}>
        <AddZindexContent
          onClose={closeAddZindexDrawer}
          onEnter={() => {
            freshZindexs();
            closeAddZindexDrawer();
          }}
        />
      </CustomDrawer>
      <CustomDrawer show={showNewsDrawer}>
        <NewsContent onClose={closeNewsDrawer} onEnter={closeNewsDrawer} />
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
  const [showFundsStatisticsDrawer, { setTrue: openFundStatisticsDrawer, setFalse: closeFundStatisticsDrawer }] =
    useBoolean(false);

  const { quotationSortModeOptions, quotationSortModeOptionsMap } = Helpers.Sort.GetSortConfig();

  const quotations = useAppSelector((state) => state.quotation.quotations);

  const [expandAllQuotations, expandSomeQuotations] = useMemo(() => {
    return [quotations.every((_) => _.collapse), quotations.some((_) => _.collapse)];
  }, [quotations]);

  const toggleQuotationsCollapse = () => dispatch(toggleAllQuotationsCollapseAction());

  return (
    <div className={styles.bar}>
      <div className={styles.arrow} onClick={toggleQuotationsCollapse}>
        {expandAllQuotations ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
      </div>
      <div className={styles.name} onClick={toggleQuotationsCollapse}>
        <span>板块名称</span>
        <a
          onClick={(e) => {
            openFundFlowDrawer();
            e.stopPropagation();
          }}
        >
          资金流
        </a>
        <a
          onClick={(e) => {
            openFundStatisticsDrawer();
            e.stopPropagation();
          }}
        >
          统计
        </a>
      </div>
      <div className={styles.view}>
        {quotationViewType === Enums.QuotationViewType.List && (
          <RiListUnordered
            onClick={() => dispatch(setQuotationViewModeAction({ type: Enums.QuotationViewType.Grid }))}
          />
        )}
        {quotationViewType === Enums.QuotationViewType.Grid && (
          <RiDashboardLine
            onClick={() => dispatch(setQuotationViewModeAction({ type: Enums.QuotationViewType.Flow }))}
          />
        )}
        {quotationViewType === Enums.QuotationViewType.Flow && (
          <RiLayout4Line onClick={() => dispatch(setQuotationViewModeAction({ type: Enums.QuotationViewType.List }))} />
        )}
      </div>
      <div className={styles.mode}>
        <Dropdown
          placement="bottomRight"
          dropdownRender={() => (
            <Menu
              selectedKeys={[String(quotationSortModeOptionsMap[quotationSortType].key)]}
              onClick={({ key }) =>
                dispatch(setQuotationSortModeAction({ type: Number(key) as Enums.QuotationSortType }))
              }
              items={quotationSortModeOptions}
            />
          )}
        >
          <a>{quotationSortModeOptionsMap[quotationSortType].label}</a>
        </Dropdown>
      </div>
      <div className={styles.sort} onClick={() => dispatch(troggleQuotationSortOrderAction())}>
        <RiArrowUpSFill
          className={classsames({
            [styles.selectOrder]: quotationSortOrder === Enums.SortOrderType.Asc,
          })}
        />
        <RiArrowDownSFill
          className={classsames({
            [styles.selectOrder]: quotationSortOrder === Enums.SortOrderType.Desc,
          })}
        />
      </div>
      <CustomDrawer show={showFundFlowDrawer}>
        <FundFlowContent onClose={closeFundFlowDrawer} onEnter={closeFundFlowDrawer} />
      </CustomDrawer>
      <CustomDrawer show={showFundsStatisticsDrawer}>
        <FundStatisticsContent onClose={closeFundStatisticsDrawer} onEnter={closeFundStatisticsDrawer} />
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

  const [
    showManageStockDrawer,
    { setTrue: openManageStockDrawer, setFalse: closeManageStockDrawer, toggle: ToggleManageStockDrawer },
  ] = useBoolean(false);
  const [
    showAddStockDrawer,
    { setTrue: openAddStockDrawer, setFalse: closeAddStockDrawer, toggle: ToggleAddStockDrawer },
  ] = useBoolean(false);
  const [showStockRankingDrawer, { setTrue: openStockRankingDrawer, setFalse: closeStockRankingDrawer }] =
    useBoolean(false);

  const [expandAllStocks, expandSomeStocks] = useMemo(() => {
    return [stocks.every((_) => _.collapse), stocks.some((_) => _.collapse)];
  }, [stocks]);

  const freshStocks = useFreshStocks(CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY);

  const toggleStocksCollapse = () => dispatch(toggleAllStocksCollapseAction());

  return (
    <div className={styles.bar}>
      <div className={styles.arrow} onClick={toggleStocksCollapse}>
        {expandAllStocks ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
      </div>
      <div className={styles.name} onClick={toggleStocksCollapse}>
        <span>股票名称</span>
        <a
          onClick={(e) => {
            openManageStockDrawer();
            e.stopPropagation();
          }}
        >
          管理
        </a>
        <a
          onClick={(e) => {
            openStockRankingDrawer();
            e.stopPropagation();
          }}
        >
          榜单
        </a>
        <div className={styles.view}>
          <RiSearchLine
            onClick={(e) => {
              openAddStockDrawer();
              e.stopPropagation();
            }}
          />
        </div>
      </div>
      <div className={styles.view}>
        {stockViewType === Enums.StockViewType.List && (
          <RiListUnordered onClick={() => dispatch(setStockViewModeAction({ type: Enums.StockViewType.Grid }))} />
        )}
        {stockViewType === Enums.StockViewType.Grid && (
          <RiDashboardLine onClick={() => dispatch(setStockViewModeAction({ type: Enums.StockViewType.Chart }))} />
        )}
        {stockViewType === Enums.StockViewType.Chart && (
          <RiLineChartLine onClick={() => dispatch(setStockViewModeAction({ type: Enums.StockViewType.List }))} />
        )}
      </div>
      <div className={styles.mode}>
        <Dropdown
          placement="bottomRight"
          dropdownRender={() => (
            <Menu
              selectedKeys={[String(stockSortModeOptionsMap[stockSortType].key)]}
              onClick={({ key }) => dispatch(setStockSortModeAction({ type: Number(key) as Enums.StockSortType }))}
              items={stockSortModeOptions}
            />
          )}
        >
          <a>{stockSortModeOptionsMap[stockSortType].label}</a>
        </Dropdown>
      </div>
      <div className={styles.sort} onClick={() => dispatch(troggleStockSortOrderAction())}>
        <RiArrowUpSFill
          className={classsames({
            [styles.selectOrder]: stockSortOrder === Enums.SortOrderType.Asc,
          })}
        />
        <RiArrowDownSFill
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
      <CustomDrawer show={showAddStockDrawer}>
        <AddStockContent
          onClose={closeAddStockDrawer}
          onEnter={() => {
            freshStocks();
            closeAddStockDrawer();
          }}
        />
      </CustomDrawer>
      <CustomDrawer show={showStockRankingDrawer}>
        <StockRankingContent onClose={closeStockRankingDrawer} onEnter={closeStockRankingDrawer} />
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

  const [
    showManageCoinDrawer,
    { setTrue: openManageCoinDrawer, setFalse: closeManageCoinDrawer, toggle: ToggleManageCoinDrawer },
  ] = useBoolean(false);
  const [showAddCoinDrawer, { setTrue: openAddCoinDrawer, setFalse: closeAddCoinDrawer, toggle: ToggleAddCoinDrawer }] =
    useBoolean(false);
  const [showCoinRankingDrawer, { setTrue: openCoinRankingDrawer, setFalse: closeCoinRankingDrawer }] =
    useBoolean(false);

  const [expandAllCoins, expandSomeCoins] = useMemo(() => {
    return [coins.every((_) => _.collapse), coins.some((_) => _.collapse)];
  }, [coins]);

  const freshCoins = useFreshCoins(CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY);

  const toggleCoinsCollapse = () => dispatch(toggleAllCoinsCollapseAction());

  return (
    <div className={styles.bar}>
      <div className={styles.arrow} onClick={toggleCoinsCollapse}>
        {expandAllCoins ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
      </div>
      <div className={styles.name} onClick={toggleCoinsCollapse}>
        <span>货币名称</span>
        <a
          onClick={(e) => {
            openManageCoinDrawer();
            e.stopPropagation();
          }}
        >
          管理
        </a>
        <a
          onClick={(e) => {
            openCoinRankingDrawer();
            e.stopPropagation();
          }}
        >
          榜单
        </a>
        <div className={styles.view}>
          <RiSearchLine
            onClick={(e) => {
              openAddCoinDrawer();
              e.stopPropagation();
            }}
          />
        </div>
      </div>
      <div className={styles.view}>
        {coinViewType === Enums.CoinViewType.List && (
          <RiListUnordered onClick={() => dispatch(setCoinViewModeAction({ type: Enums.CoinViewType.Grid }))} />
        )}
        {coinViewType === Enums.CoinViewType.Grid && (
          <RiDashboardLine onClick={() => dispatch(setCoinViewModeAction({ type: Enums.CoinViewType.List }))} />
        )}
      </div>
      <div className={styles.mode}>
        <Dropdown
          placement="bottomRight"
          dropdownRender={() => (
            <Menu
              selectedKeys={[String(coinSortModeOptionsMap[coinSortType].key)]}
              onClick={({ key }) => dispatch(setCoinSortModeAction({ type: Number(key) as Enums.CoinSortType }))}
              items={coinSortModeOptions}
            />
          )}
        >
          <a>{coinSortModeOptionsMap[coinSortType].label}</a>
        </Dropdown>
      </div>
      <div className={styles.sort} onClick={() => dispatch(troggleCoinSortOrderAction())}>
        <RiArrowUpSFill
          className={classsames({
            [styles.selectOrder]: coinSortOrder === Enums.SortOrderType.Asc,
          })}
        />
        <RiArrowDownSFill
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
      <CustomDrawer show={showAddCoinDrawer}>
        <AddCoinContent
          onClose={closeAddCoinDrawer}
          onEnter={() => {
            freshCoins();
            closeAddCoinDrawer();
          }}
        />
      </CustomDrawer>
      <CustomDrawer show={showCoinRankingDrawer}>
        <CoinRankingContent onClose={closeCoinRankingDrawer} onEnter={closeCoinRankingDrawer} />
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
      case Enums.TabKeyType.Fund:
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
