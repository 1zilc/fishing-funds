import React from 'react';
import { Badge } from 'antd';
import { useSelector } from 'react-redux';
import { useBoolean, useThrottleFn } from 'ahooks';

import { ReactComponent as MenuAddIcon } from '@assets/icons/menu-add.svg';
import { ReactComponent as RefreshIcon } from '@assets/icons/refresh.svg';
import { ReactComponent as SettingIcon } from '@assets/icons/setting.svg';
import { ReactComponent as WalletIcon } from '@assets/icons/wallet.svg';
import { ReactComponent as ChartBoxIcon } from '@assets/icons/chart-box.svg';
import { ReactComponent as NewsIcon } from '@assets/icons/news.svg';
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
import { StoreState } from '@/reducers/types';
import { useScrollToTop, useFreshFunds } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';
import styles from './index.scss';

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

  return (
    <>
      <style>{` html { filter: ${lowKeySetting && 'grayscale(100%)'} }`}</style>
      <style>{` html { font-size: ${baseFontSizeSetting}px }`}</style>
      <div className={styles.bar}>
        {tabsActiveKey === Enums.TabKeyType.Funds && <MenuAddIcon style={{ ...iconSize }} onClick={openManageFundDrawer} />}
        {tabsActiveKey === Enums.TabKeyType.Funds && <WalletIcon style={{ ...iconSize }} onClick={openManageWalletDrawer} />}
        {tabsActiveKey === Enums.TabKeyType.Zindex && <MenuAddIcon style={{ ...iconSize }} onClick={openManageZindexDrawer} />}
        {tabsActiveKey === Enums.TabKeyType.Zindex && <NewsIcon style={{ ...iconSize }} onClick={openNewsDrawer} />}
        {tabsActiveKey === Enums.TabKeyType.Quotation && <ChartBoxIcon style={{ ...iconSize }} onClick={openFundFlowDrawer} />}
        {tabsActiveKey === Enums.TabKeyType.Stock && <MenuAddIcon style={{ ...iconSize }} onClick={openManageStockDrawer} />}
        {tabsActiveKey === Enums.TabKeyType.Coin && <MenuAddIcon style={{ ...iconSize }} onClick={openManageCoinDrawer} />}
        {tabsActiveKey === Enums.TabKeyType.Funds && <RefreshIcon style={{ ...iconSize }} onClick={freshFunds} />}
        {tabsActiveKey === Enums.TabKeyType.Zindex && <RefreshIcon style={{ ...iconSize }} onClick={freshZindexs} />}
        {tabsActiveKey === Enums.TabKeyType.Quotation && <RefreshIcon style={{ ...iconSize }} onClick={freshQuotations} />}
        {tabsActiveKey === Enums.TabKeyType.Stock && <RefreshIcon style={{ ...iconSize }} onClick={freshStocks} />}
        {tabsActiveKey === Enums.TabKeyType.Coin && <RefreshIcon style={{ ...iconSize }} onClick={freshCoins} />}
        {tabsActiveKey === Enums.TabKeyType.Funds && <ChartBoxIcon style={{ ...iconSize }} onClick={openFundStatisticsDrawer} />}
        {tabsActiveKey === Enums.TabKeyType.Zindex && <ChartBoxIcon style={{ ...iconSize }} onClick={openFundFlowDrawer} />}{' '}
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
    </>
  );
};

export default ToolBar;
