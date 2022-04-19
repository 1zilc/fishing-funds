import React, { useState, useMemo } from 'react';
import { useBoolean, useMemoizedFn } from 'ahooks';
import { Input } from 'antd';
import { useSelector } from 'react-redux';

import WalletIcon from '@/static/icon/wallet.svg';
import NewsIcon from '@/static/icon/news.svg';
import ExchangeIcon from '@/static/icon/exchange.svg';
import BubbleIcon from '@/static/icon/bubble.svg';
import OrderIcon from '@/static/icon/order.svg';
import PieIcon from '@/static/icon/pie.svg';
import FundsBoxIcon from '@/static/icon/funds-box.svg';
import BarChartIcon from '@/static/icon/bar-chart.svg';
import StockIcon from '@/static/icon/stock.svg';
import CoinIcon from '@/static/icon/coin.svg';
import CalendarCheckIcon from '@/static/icon/calendar-check.svg';
import LayoutIcon from '@/static/icon/layout.svg';
import FundsIcon from '@/static/icon/funds.svg';
import CalculatorIcon from '@/static/icon/calculator.svg';

import CustomDrawer from '@/components/CustomDrawer';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import StandCard from '@/components/Card/StandCard';
import QuickSearch from '@/components/Toolbar/AppCenterContent/QuickSearch';
import WebAppIcon from '@/components/Toolbar/AppCenterContent/WebAppIcon';
import SearchGroup from '@/components/Toolbar/AppCenterContent/SearchGroup';
import { StoreState } from '@/reducers/types';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import { useOpenWebView } from '@/utils/hooks';
import styles from './index.module.scss';

const ManageFundContent = React.lazy(() => import('@/components/Home/FundView/ManageFundContent'));
const ManageZindexContent = React.lazy(() => import('@/components/Home/ZindexView/ManageZindexContent'));
const ManageStockContent = React.lazy(() => import('@/components/Home/StockView/ManageStockContent'));
const ManageCoinContent = React.lazy(() => import('@/components/Home/CoinView/ManageCoinContent'));
const ManageWalletContent = React.lazy(() => import('@/components/Wallet/ManageWalletContent'));
const FundStatisticsContent = React.lazy(() => import('@/components/Home/FundView/FundStatisticsContent'));
const NewsContent = React.lazy(() => import('@/components/Home/NewsList/NewsContent'));
const HoldingContent = React.lazy(() => import('@/components/Home/QuotationView/HoldingContent'));
const FundFlowContent = React.lazy(() => import('@/components/Home/QuotationView/FundFlowContent'));
const ExchangeContent = React.lazy(() => import('@/components/Home/ZindexView/ExchangeContent'));
const QuoteCenterContent = React.lazy(() => import('@/components/Home/QuotationView/QuoteCenterContent'));
const EconomicDataContent = React.lazy(() => import('@/components/Home/ZindexView/EconomicDataContent'));
const FundRankingContent = React.lazy(() => import('@/components/Home/FundView/FundRankingContent'));
const StockRankingContent = React.lazy(() => import('@/components/Home/StockView/StockRankingContent'));
const CoinRankingContent = React.lazy(() => import('@/components/Home/CoinView/CoinRankingContent'));
const EconomicCalendarContent = React.lazy(() => import('@/components/Home/StockView/EconomicCalendarContent'));
const GoldMarketContent = React.lazy(() => import('@/components/Home/QuotationView/GoldMarketContent'));
const Calculator = React.lazy(() => import('@/components/Home/CoinView/Calculator'));

const { Search } = Input;
const iconSize = { height: 18, width: 18 };

interface AppCenterContentProps {
  onClose: () => void;
  onEnter: () => void;
}

interface AppConfig {
  title: string;
  click: () => void;
  iconType?: Enums.WebIconType;
  icon?: React.ReactElement;
  color?: string;
  favicon?: string;
  url?: string;
}

function constructApps(appConfigs: AppConfig[]) {
  return (
    <div className={styles.apps}>
      {appConfigs.map((config) => {
        return (
          <div className={styles.appContent} key={`${config.title}${config.url}`}>
            <WebAppIcon title={config.title} onClick={config.click} iconType={config.iconType} svg={config.icon} favicon={config.favicon} />
          </div>
        );
      })}
    </div>
  );
}

function renderApps(groups: { title: string; config: AppConfig[] }[], keyword: string) {
  return groups.map((group) => {
    const list = group.config.filter(({ title }) => title.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()));
    return list.length ? (
      <StandCard key={group.title} title={group.title}>
        {constructApps(list)}
      </StandCard>
    ) : (
      <></>
    );
  });
}

const searchPlaceholders = ['输入网站地址', '搜索股票、基金、板块名称或代码', '检索功能模块名称', '全网搜索一下,例如 "天天基金"'];

const AppCenterContent: React.FC<AppCenterContentProps> = (props) => {
  const [keyword, setKeyword] = useState('');
  const { webConfig } = useSelector((state: StoreState) => state.web.config);
  const [showManageFundDrawer, { setTrue: openManageFundDrawer, setFalse: closeManageFundDrawer }] = useBoolean(false);
  const [showManageWalletDrawer, { setTrue: openManageWalletDrawer, setFalse: closeManageWalletDrawer }] = useBoolean(false);
  const [showManageZindexDrawer, { setTrue: openManageZindexDrawer, setFalse: closeManageZindexDrawer }] = useBoolean(false);
  const [showManageStockDrawer, { setTrue: openManageStockDrawer, setFalse: closeManageStockDrawer }] = useBoolean(false);
  const [showManageCoinDrawer, { setTrue: openManageCoinDrawer, setFalse: closeManageCoinDrawer }] = useBoolean(false);
  const [showFundsStatisticsDrawer, { setTrue: openFundStatisticsDrawer, setFalse: closeFundStatisticsDrawer }] = useBoolean(false);
  const [showNewsDrawer, { setTrue: openNewsDrawer, setFalse: closeNewsDrawer }] = useBoolean(false);
  const [showHoldingDrawer, { setTrue: openHoldingDrawer, setFalse: closeHoldingDrawer }] = useBoolean(false);
  const [showFundFlowDrawer, { setTrue: openFundFlowDrawer, setFalse: closeFundFlowDrawer }] = useBoolean(false);
  const [showExchangeDrawer, { setTrue: openExchangeDrawer, setFalse: closeExchangeDrawer }] = useBoolean(false);
  const [showQuoteCenterDrawer, { setTrue: openQuoteCenterDrawer, setFalse: closeQuoteCenterDrawer }] = useBoolean(false);
  const [showEconomicDataDrawer, { setTrue: openEconomicDataDrawer, setFalse: closeEconomicDataDrawer }] = useBoolean(false);
  const [showFundRankingDrawer, { setTrue: openFundRankingDrawer, setFalse: closeFundRankingDrawer }] = useBoolean(false);
  const [showStockRankingDrawer, { setTrue: openStockRankingDrawer, setFalse: closeStockRankingDrawer }] = useBoolean(false);
  const [showCoinRankingDrawer, { setTrue: openCoinRankingDrawer, setFalse: closeCoinRankingDrawer }] = useBoolean(false);
  const [showEconomicCalendarDrawer, { setTrue: openEconomicCalendarDrawer, setFalse: closeEconomicCalendarDrawer }] = useBoolean(false);
  const [showGoldMarketDrawer, { setTrue: openGoldMarketDrawer, setFalse: closeGoldMarketDrawer }] = useBoolean(false);
  const [showCalculatorDrawer, { setTrue: openCalculatorDrawer, setFalse: closeCalculatorDrawer }] = useBoolean(false);

  const openWebView = useOpenWebView();

  const onSearch = useMemoizedFn((value: string) => {
    const { valid, url } = Utils.CheckUrlValid(value);
    if (valid) {
      openWebView({ title: '', url });
    }
  });

  const apps = useMemo(
    () =>
      renderApps(
        [
          {
            title: '数据管理',
            config: [
              {
                title: '基金管理',
                iconType: Enums.WebIconType.First,
                click: openManageFundDrawer,
              },
              {
                title: '指数管理',
                iconType: Enums.WebIconType.First,
                click: openManageZindexDrawer,
              },
              {
                title: '股票管理',
                iconType: Enums.WebIconType.First,
                click: openManageStockDrawer,
              },
              {
                title: '货币管理',
                iconType: Enums.WebIconType.First,
                click: openManageCoinDrawer,
              },
              {
                title: '钱包管理',
                iconType: Enums.WebIconType.Svg,
                icon: <WalletIcon style={{ ...iconSize }} />,
                click: openManageWalletDrawer,
              },
            ],
          },
          {
            title: '特色功能',
            config: [
              {
                title: '基金统计',
                iconType: Enums.WebIconType.Svg,
                icon: <PieIcon style={{ ...iconSize }} />,
                click: openFundStatisticsDrawer,
              },
              {
                title: '货币计算器',
                iconType: Enums.WebIconType.Svg,
                icon: <CalculatorIcon style={{ ...iconSize }} />,
                click: openCalculatorDrawer,
              },
            ],
          },
          {
            title: '拓展功能',
            config: [
              {
                title: '新闻动态',
                iconType: Enums.WebIconType.Svg,
                icon: <NewsIcon style={{ ...iconSize }} />,
                click: openNewsDrawer,
              },
              {
                title: '沪深港通股',
                iconType: Enums.WebIconType.Svg,
                icon: <FundsIcon style={{ ...iconSize }} />,
                click: openHoldingDrawer,
              },
              {
                title: '板块资金流',
                iconType: Enums.WebIconType.Svg,
                icon: <LayoutIcon style={{ ...iconSize }} />,
                click: openFundFlowDrawer,
              },
              {
                title: '外汇债券',
                iconType: Enums.WebIconType.Svg,
                icon: <ExchangeIcon style={{ ...iconSize }} />,
                click: openExchangeDrawer,
              },
              {
                title: '行情中心',
                iconType: Enums.WebIconType.Svg,
                icon: <BubbleIcon style={{ ...iconSize }} />,
                click: openQuoteCenterDrawer,
              },
              {
                title: '经济数据',
                iconType: Enums.WebIconType.Svg,
                icon: <BarChartIcon style={{ ...iconSize }} />,
                click: openEconomicDataDrawer,
              },
              {
                title: '基金榜',
                iconType: Enums.WebIconType.Svg,
                icon: <FundsBoxIcon style={{ ...iconSize }} />,
                click: openFundRankingDrawer,
              },
              {
                title: '股票榜',
                iconType: Enums.WebIconType.Svg,
                icon: <StockIcon style={{ ...iconSize }} />,
                click: openStockRankingDrawer,
              },
              {
                title: '货币榜',
                iconType: Enums.WebIconType.Svg,
                icon: <OrderIcon style={{ ...iconSize }} />,
                click: openCoinRankingDrawer,
              },
              {
                title: '财经日历',
                iconType: Enums.WebIconType.Svg,
                icon: <CalendarCheckIcon style={{ ...iconSize }} />,
                click: openEconomicCalendarDrawer,
              },
              {
                title: '黄金市场',
                iconType: Enums.WebIconType.Svg,
                icon: <CoinIcon style={{ ...iconSize }} />,
                click: openGoldMarketDrawer,
              },
            ],
          },
        ],
        keyword
      ),
    [keyword]
  );

  const h5s = useMemo(
    () =>
      renderApps(
        [
          {
            title: 'H5专区',
            config: webConfig.map((web) => ({
              title: web.title,
              favicon: web.icon,
              color: web.color,
              iconType: web.iconType,
              url: web.url,
              click: () => openWebView({ title: web.title, url: web.url }),
            })),
          },
        ],
        keyword
      ),
    [keyword, webConfig]
  );

  return (
    <CustomDrawerContent title="功能中心" enterText="确定" onEnter={props.onEnter} onClose={props.onClose}>
      <div className={styles.content}>
        <div className={styles.search}>
          <Search
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            type="text"
            placeholder={searchPlaceholders[Math.floor(Math.random() * searchPlaceholders.length)]}
            size="small"
            onSearch={onSearch}
            enterButton
            allowClear
          />
        </div>
        <QuickSearch value={keyword} />
        {apps}
        {h5s}
        <SearchGroup keyword={keyword} />
        <CustomDrawer show={showManageFundDrawer}>
          <ManageFundContent onClose={closeManageFundDrawer} onEnter={closeManageFundDrawer} />
        </CustomDrawer>
        <CustomDrawer show={showManageWalletDrawer}>
          <ManageWalletContent onClose={closeManageWalletDrawer} onEnter={closeManageWalletDrawer} />
        </CustomDrawer>
        <CustomDrawer show={showManageZindexDrawer}>
          <ManageZindexContent onClose={closeManageZindexDrawer} onEnter={closeManageZindexDrawer} />
        </CustomDrawer>
        <CustomDrawer show={showManageStockDrawer}>
          <ManageStockContent onClose={closeManageStockDrawer} onEnter={closeManageStockDrawer} />
        </CustomDrawer>
        <CustomDrawer show={showManageCoinDrawer}>
          <ManageCoinContent onClose={closeManageCoinDrawer} onEnter={closeManageCoinDrawer} />
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
        <CustomDrawer show={showEconomicDataDrawer}>
          <EconomicDataContent onClose={closeEconomicDataDrawer} onEnter={closeEconomicDataDrawer} />
        </CustomDrawer>
        <CustomDrawer show={showFundRankingDrawer}>
          <FundRankingContent onClose={closeFundRankingDrawer} onEnter={closeFundRankingDrawer} />
        </CustomDrawer>
        <CustomDrawer show={showStockRankingDrawer}>
          <StockRankingContent onClose={closeStockRankingDrawer} onEnter={closeStockRankingDrawer} />
        </CustomDrawer>
        <CustomDrawer show={showCoinRankingDrawer}>
          <CoinRankingContent onClose={closeCoinRankingDrawer} onEnter={closeCoinRankingDrawer} />
        </CustomDrawer>
        <CustomDrawer show={showEconomicCalendarDrawer}>
          <EconomicCalendarContent onClose={closeEconomicCalendarDrawer} onEnter={closeEconomicCalendarDrawer} />
        </CustomDrawer>
        <CustomDrawer show={showGoldMarketDrawer}>
          <GoldMarketContent onClose={closeGoldMarketDrawer} onEnter={closeGoldMarketDrawer} />
        </CustomDrawer>
        <CustomDrawer show={showCalculatorDrawer}>
          <Calculator onClose={closeCalculatorDrawer} onEnter={closeCalculatorDrawer} />
        </CustomDrawer>
      </div>
    </CustomDrawerContent>
  );
};

export default AppCenterContent;
