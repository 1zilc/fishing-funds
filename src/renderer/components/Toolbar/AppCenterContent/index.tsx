import React from 'react';
import ColorHash from 'color-hash';
import { useBoolean } from 'ahooks';

import MenuAddIcon from '@/static/icon/menu-add.svg';
import WalletIcon from '@/static/icon/wallet.svg';
import ChartBoxIcon from '@/static/icon/chart-box.svg';
import NewsIcon from '@/static/icon/news.svg';
import ExchangeIcon from '@/static/icon/exchange.svg';
import BubbleIcon from '@/static/icon/bubble.svg';
import OrderIcon from '@/static/icon/order.svg';
import PieIcon from '@/static/icon/pie.svg';

import CustomDrawer from '@/components/CustomDrawer';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import StandCard from '@/components/Card/StandCard';
import PureCard from '@/components/Card/PureCard';
import ManageFundContent from '@/components/Home/FundList/ManageFundContent';
import ManageWalletContent from '@/components/Wallet/ManageWalletContent';
import ManageStockContent from '@/components/Home/StockList/ManageStockContent';
import ManageCoinContent from '@/components/Home/CoinList/ManageCoinContent';
import FundStatisticsContent from '@/components/Home/FundList/FundStatisticsContent';
import ManageZindexContent from '@/components/Home/ZindexList/ManageZindexContent';
import FundFlowContent from '@/components/Home/QuotationList/FundFlowContent';
import NewsContent from '@/components/Home/NewsList/NewsContent';
import ExchangeContent from '@/components/Home/ZindexList/ExchangeContent';
import QuoteCenterContent from '@/components/Home/QuotationList/QuoteCenterContent';
import HoldingContent from '@/components/Home/QuotationList/HoldingContent';

import styles from './index.module.scss';

const iconSize = { height: 18, width: 18 };
const colorHash = new ColorHash();

interface AppCenterContentProps {
  onClose: () => void;
  onEnter: () => void;
}
interface AppConfig {
  name: string;
  click: () => void;
  icon: React.ReactElement;
}

function constructApps(appConfigs: AppConfig[]) {
  return (
    <div className={styles.apps}>
      {appConfigs.map((config, index) => {
        const color = colorHash.hex(config.name);
        return (
          <div className={styles.appContent} key={index}>
            <div className={styles.app} style={{ background: color, boxShadow: `0 2px 5px ${color}` }} onClick={config.click}>
              {config.icon}
            </div>
            <div className={styles.name}>{config.name}</div>
          </div>
        );
      })}
    </div>
  );
}

const AppCenterContent: React.FC<AppCenterContentProps> = (props) => {
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
    <CustomDrawerContent title="功能中心" enterText="确定" onEnter={props.onEnter} onClose={props.onClose}>
      <div className={styles.content}>
        <StandCard title="数据管理">
          {constructApps([
            {
              name: '基金管理',
              icon: <i style={{ ...iconSize }}>基</i>,
              click: openManageFundDrawer,
            },
            {
              name: '指数管理',
              icon: <i style={{ ...iconSize }}>指</i>,
              click: openManageZindexDrawer,
            },
            {
              name: '股票管理',
              icon: <i style={{ ...iconSize }}>股</i>,
              click: openManageStockDrawer,
            },
            {
              name: '货币管理',
              icon: <i style={{ ...iconSize }}>币</i>,
              click: openManageCoinDrawer,
            },
            {
              name: '钱包管理',
              icon: <WalletIcon style={{ ...iconSize }} />,
              click: openManageWalletDrawer,
            },
          ])}
        </StandCard>
        <StandCard title="特色功能">
          {constructApps([
            {
              name: '基金统计',
              icon: <PieIcon style={{ ...iconSize }} />,
              click: openFundStatisticsDrawer,
            },
          ])}
        </StandCard>
        <StandCard title="拓展功能">
          {constructApps([
            {
              name: '新闻动态',
              icon: <NewsIcon style={{ ...iconSize }} />,
              click: openNewsDrawer,
            },
            {
              name: '沪深港通',
              icon: <OrderIcon style={{ ...iconSize }} />,
              click: openHoldingDrawer,
            },
            {
              name: '板块资金',
              icon: <ChartBoxIcon style={{ ...iconSize }} />,
              click: openFundFlowDrawer,
            },
            {
              name: '外汇债券',
              icon: <ExchangeIcon style={{ ...iconSize }} />,
              click: openExchangeDrawer,
            },
            {
              name: '行情中心',
              icon: <BubbleIcon style={{ ...iconSize }} />,
              click: openQuoteCenterDrawer,
            },
          ])}
        </StandCard>
        <CustomDrawer show={showManageFundDrawer}>
          <ManageFundContent
            onClose={closeManageFundDrawer}
            onEnter={() => {
              // freshFunds();
              closeManageFundDrawer();
            }}
          />
        </CustomDrawer>
        <CustomDrawer show={showManageWalletDrawer}>
          <ManageWalletContent
            onClose={closeManageWalletDrawer}
            onEnter={() => {
              // freshFunds();
              closeManageWalletDrawer();
            }}
          />
        </CustomDrawer>
        <CustomDrawer show={showManageZindexDrawer}>
          <ManageZindexContent
            onClose={closeManageZindexDrawer}
            onEnter={() => {
              // freshZindexs();
              closeManageZindexDrawer();
            }}
          />
        </CustomDrawer>
        <CustomDrawer show={showManageStockDrawer}>
          <ManageStockContent
            onClose={closeManageStockDrawer}
            onEnter={() => {
              // freshStocks();
              closeManageStockDrawer();
            }}
          />
        </CustomDrawer>
        <CustomDrawer show={showManageCoinDrawer}>
          <ManageCoinContent
            onClose={closeManageCoinDrawer}
            onEnter={() => {
              // freshCoins();
              closeManageCoinDrawer();
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
      </div>
    </CustomDrawerContent>
  );
};

export default AppCenterContent;
