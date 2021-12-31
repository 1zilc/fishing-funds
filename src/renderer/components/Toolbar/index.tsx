import React from 'react';
import { Badge } from 'antd';
import { useSelector } from 'react-redux';
import { useBoolean, useThrottleFn } from 'ahooks';

import MenuAddIcon from '@/static/icon/menu-add.svg';
import RefreshIcon from '@/static/icon/refresh.svg';
import SettingIcon from '@/static/icon/setting.svg';
import WalletIcon from '@/static/icon/wallet.svg';
import ChartBoxIcon from '@/static/icon/chart-box.svg';
import NewsIcon from '@/static/icon/news.svg';
import ExchangeIcon from '@/static/icon/exchange.svg';
import BubbleIcon from '@/static/icon/bubble.svg';
import OrderIcon from '@/static/icon/order.svg';
import PieIcon from '@/static/icon/pie.svg';
import CustomDrawer from '@/components/CustomDrawer';
import ManageFundContent from '@/components/Home/FundList/ManageFundContent';
import ManageWalletContent from '@/components/Wallet/ManageWalletContent';
import ManageStockContent from '@/components/Home/StockList/ManageStockContent';
import ManageCoinContent from '@/components/Home/CoinList/ManageCoinContent';
import SettingContent from '@/components/SettingContent';
import FundStatisticsContent from '@/components/Home/FundList/FundStatisticsContent';
import ManageZindexContent from '@/components/Home/ZindexList/ManageZindexContent';
import FundFlowContent from '@/components/Home/QuotationList/FundFlowContent';
import NewsContent from '@/components/Home/NewsList/NewsContent';
import ExchangeContent from '@/components/Home/ZindexList/ExchangeContent';
import QuoteCenterContent from '@/components/Home/QuotationList/QuoteCenterContent';
import HoldingContent from '@/components/Home/QuotationList/HoldingContent';
import { StoreState } from '@/reducers/types';
import { useScrollToTop, useFreshFunds } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

export interface ToolBarProps {}

const iconSize = { height: 18, width: 18 };

const ToolBar: React.FC<ToolBarProps> = () => {
  const { lowKeySetting, baseFontSizeSetting } = useSelector((state: StoreState) => state.setting.systemSetting);
  const updateInfo = useSelector((state: StoreState) => state.updater.updateInfo);
  const tabsActiveKey = useSelector((state: StoreState) => state.tabs.activeKey);

  const { run: runLoadZindexs } = useThrottleFn(Helpers.Zindex.LoadZindexs, { wait: CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY });
  const { run: runLoadQuotations } = useThrottleFn(Helpers.Quotation.LoadQuotations, { wait: CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY });
  const { run: runLoadStocks } = useThrottleFn(Helpers.Stock.LoadStocks, { wait: CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY });
  const { run: runLoadCoins } = useThrottleFn(Helpers.Coin.LoadCoins, { wait: CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY });

  const freshFunds = useFreshFunds(CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY);
  const freshZindexs = useScrollToTop({ after: () => runLoadZindexs(true) });
  const freshQuotations = useScrollToTop({ after: () => runLoadQuotations(true) });
  const freshStocks = useScrollToTop({ after: () => runLoadStocks(true) });
  const freshCoins = useScrollToTop({ after: () => runLoadCoins(true) });

  const [showManageFundDrawer, { setTrue: openManageFundDrawer, setFalse: closeManageFundDrawer, toggle: ToggleManageFundDrawer }] =
    useBoolean(false);
  const [showManageWalletDrawer, { setTrue: openManageWalletDrawer, setFalse: closeManageWalletDrawer, toggle: ToggleManageWalletDrawer }] =
    useBoolean(false);
  const [showManageZindexDrawer, { setTrue: openManageZindexDrawer, setFalse: closeManageZindexDrawer, toggle: ToggleManageZindexDrawer }] =
    useBoolean(false);
  const [showManageStockDrawer, { setTrue: openManageStockDrawer, setFalse: closeManageStockDrawer, toggle: ToggleManageStockDrawer }] =
    useBoolean(false);
  const [showManageCoinDrawer, { setTrue: openManageCoinDrawer, setFalse: closeManageCoinDrawer, toggle: ToggleManageCoinDrawer }] =
    useBoolean(false);
  const [showSettingDrawer, { setTrue: openSettingDrawer, setFalse: closeSettingDrawer, toggle: ToggleSettingDrawer }] = useBoolean(false);
  const [
    showFundsStatisticsDrawer,
    { setTrue: openFundStatisticsDrawer, setFalse: closeFundStatisticsDrawer, toggle: ToggleFundStatisticsDrawer },
  ] = useBoolean(false);
  const [showFundFlowDrawer, { setTrue: openFundFlowDrawer, setFalse: closeFundFlowDrawer, toggle: ToggleFundFlowDrawer }] =
    useBoolean(false);
  const [showNewsDrawer, { setTrue: openNewsDrawer, setFalse: closeNewsDrawer, toggle: ToggleNewsDrawer }] = useBoolean(false);
  const [showExchangeDrawer, { setTrue: openExchangeDrawer, setFalse: closeExchangeDrawer, toggle: ToggleExchangeDrawer }] =
    useBoolean(false);
  const [showQuoteCenterDrawer, { setTrue: openQuoteCenterDrawer, setFalse: closeQuoteCenterDrawer, toggle: ToggleQuoteCenterDrawer }] =
    useBoolean(false);
  const [showHoldingDrawer, { setTrue: openHoldingDrawer, setFalse: closeHoldingDrawer, toggle: ToggleHoldingDrawer }] = useBoolean(false);

  return (
    <>
      <style>{` html { filter: ${lowKeySetting && 'grayscale(90%)'} }`}</style>
      <style>{` html { font-size: ${baseFontSizeSetting}px }`}</style>
      <div className={styles.bar}>
        {tabsActiveKey === Enums.TabKeyType.Funds && <MenuAddIcon style={{ ...iconSize }} onClick={openManageFundDrawer} />}
        {tabsActiveKey === Enums.TabKeyType.Funds && <WalletIcon style={{ ...iconSize }} onClick={openManageWalletDrawer} />}
        {tabsActiveKey === Enums.TabKeyType.Zindex && <MenuAddIcon style={{ ...iconSize }} onClick={openManageZindexDrawer} />}
        {tabsActiveKey === Enums.TabKeyType.Zindex && <NewsIcon style={{ ...iconSize }} onClick={openNewsDrawer} />}
        {tabsActiveKey === Enums.TabKeyType.Quotation && <OrderIcon style={{ ...iconSize }} onClick={openHoldingDrawer} />}
        {tabsActiveKey === Enums.TabKeyType.Quotation && <ChartBoxIcon style={{ ...iconSize }} onClick={openFundFlowDrawer} />}
        {tabsActiveKey === Enums.TabKeyType.Stock && <MenuAddIcon style={{ ...iconSize }} onClick={openManageStockDrawer} />}
        {tabsActiveKey === Enums.TabKeyType.Coin && <MenuAddIcon style={{ ...iconSize }} onClick={openManageCoinDrawer} />}
        {tabsActiveKey === Enums.TabKeyType.Funds && <RefreshIcon style={{ ...iconSize }} onClick={freshFunds} />}
        {tabsActiveKey === Enums.TabKeyType.Zindex && <RefreshIcon style={{ ...iconSize }} onClick={freshZindexs} />}
        {tabsActiveKey === Enums.TabKeyType.Quotation && <RefreshIcon style={{ ...iconSize }} onClick={freshQuotations} />}
        {tabsActiveKey === Enums.TabKeyType.Stock && <RefreshIcon style={{ ...iconSize }} onClick={freshStocks} />}
        {tabsActiveKey === Enums.TabKeyType.Coin && <RefreshIcon style={{ ...iconSize }} onClick={freshCoins} />}
        {tabsActiveKey === Enums.TabKeyType.Funds && <PieIcon style={{ ...iconSize }} onClick={openFundStatisticsDrawer} />}
        {tabsActiveKey === Enums.TabKeyType.Zindex && <ExchangeIcon style={{ ...iconSize }} onClick={openExchangeDrawer} />}
        {tabsActiveKey === Enums.TabKeyType.Quotation && <BubbleIcon style={{ ...iconSize }} onClick={openQuoteCenterDrawer} />}
        <Badge dot={!!updateInfo.version}>
          <SettingIcon style={{ ...iconSize }} onClick={openSettingDrawer} />
        </Badge>
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
      <CustomDrawer show={showManageWalletDrawer}>
        <ManageWalletContent
          onClose={closeManageWalletDrawer}
          onEnter={() => {
            freshFunds();
            closeManageWalletDrawer();
          }}
        />
      </CustomDrawer>
      <CustomDrawer show={showManageZindexDrawer}>
        <ManageZindexContent
          onClose={closeManageZindexDrawer}
          onEnter={() => {
            freshZindexs();
            closeManageZindexDrawer();
          }}
        />
      </CustomDrawer>
      <CustomDrawer show={showManageStockDrawer}>
        <ManageStockContent
          onClose={closeManageStockDrawer}
          onEnter={() => {
            freshStocks();
            closeManageStockDrawer();
          }}
        />
      </CustomDrawer>
      <CustomDrawer show={showManageCoinDrawer}>
        <ManageCoinContent
          onClose={closeManageCoinDrawer}
          onEnter={() => {
            freshCoins();
            closeManageCoinDrawer();
          }}
        />
      </CustomDrawer>
      <CustomDrawer show={showSettingDrawer}>
        <SettingContent
          onClose={closeSettingDrawer}
          onEnter={() => {
            freshFunds();
            freshZindexs();
            freshQuotations();
            freshCoins();
            closeSettingDrawer();
          }}
        />
      </CustomDrawer>
      <CustomDrawer show={showFundFlowDrawer}>
        <FundFlowContent onClose={closeFundFlowDrawer} onEnter={closeFundFlowDrawer} />
      </CustomDrawer>
      <CustomDrawer show={showFundsStatisticsDrawer}>
        <FundStatisticsContent onClose={closeFundStatisticsDrawer} onEnter={closeFundStatisticsDrawer} />
      </CustomDrawer>
      <CustomDrawer show={showNewsDrawer}>
        <NewsContent onClose={closeNewsDrawer} onEnter={closeNewsDrawer} />
      </CustomDrawer>
      <CustomDrawer show={showExchangeDrawer}>
        <ExchangeContent onClose={closeExchangeDrawer} onEnter={closeExchangeDrawer} />
      </CustomDrawer>
      <CustomDrawer show={showQuoteCenterDrawer}>
        <QuoteCenterContent onClose={closeQuoteCenterDrawer} onEnter={closeQuoteCenterDrawer} />
      </CustomDrawer>
      <CustomDrawer show={showHoldingDrawer}>
        <HoldingContent onClose={closeHoldingDrawer} onEnter={closeHoldingDrawer} />
      </CustomDrawer>
    </>
  );
};

export default ToolBar;
