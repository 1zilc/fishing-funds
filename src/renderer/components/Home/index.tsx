import React from 'react';
import { useCreation } from 'ahooks';
import { Tabs } from 'antd';
import Toolbar from '@/components/Toolbar';
import Wallet from '@/components/Wallet/index';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SortBar from '@/components/SortBar';
import TabsBar from '@/components/TabsBar';
import Collect from '@/components/Collect';
import GroupTab from '@/components/GroupTab';
import WebViewerDrawer from '@/components/WebViewerDrawer';
import TranslateDrawer from '@/components/TranslateDrawer';
import ChatGPTDrawer from '@/components/ChatGPTDrawer';
import { stockTypesConfig } from '@/components/Toolbar/AppCenterContent/StockSearch';

import { useAppSelector } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as Helpers from '@/helpers';
import styles from './index.module.css';

const FundView = React.lazy(() => import('@/components/Home/FundView'));
const ZindexView = React.lazy(() => import('@/components/Home/ZindexView'));
const QuotationView = React.lazy(() => import('@/components/Home/QuotationView'));
const StockView = React.lazy(() => import('@/components/Home/StockView'));
const CoinView = React.lazy(() => import('@/components/Home/CoinView'));

const tabsKeyMap = {
  [Enums.TabKeyType.Fund]: FundGroup,
  [Enums.TabKeyType.Zindex]: ZindexGroup,
  [Enums.TabKeyType.Quotation]: QuotationGroup,
  [Enums.TabKeyType.Stock]: StockGroup,
  [Enums.TabKeyType.Coin]: CoinGroup,
};

export interface HomeProps {}

function FundGroup() {
  const codeMap = useAppSelector((state) => state.wallet.fundConfigCodeMap);

  return (
    <GroupTab
      tabKey={Enums.TabKeyType.Fund}
      items={[
        {
          key: String(0),
          label: '全部',
          children: <FundView filter={() => true} />,
        },
        {
          key: String(1),
          label: '持有',
          children: <FundView filter={(fund) => !!codeMap[fund.fundcode!]?.cyfe} />,
        },
        {
          key: String(2),
          label: '自选',
          children: <FundView filter={(fund) => !codeMap[fund.fundcode!]?.cyfe} />,
        },
        {
          key: String(3),
          label: '含成本价',
          children: <FundView filter={(fund) => !!codeMap[fund.fundcode!]?.cbj} />,
        },
        {
          key: String(4),
          label: '净值更新',
          children: <FundView filter={(fund) => !!Helpers.Fund.CalcFund(fund, codeMap).isFix} />,
        },
      ]}
    />
  );
}

function ZindexGroup() {
  // const { codeMap: zindexCodeMap } = useAppSelector((state) => state.zindex.config);

  return (
    <GroupTab
      tabKey={Enums.TabKeyType.Zindex}
      items={[
        {
          key: String(0),
          label: '全部',
          children: <ZindexView filter={() => true} />,
        },
        {
          key: String(1),
          label: '上涨',
          children: <ZindexView filter={(zindex) => zindex.zdd >= 0} />,
        },
        {
          key: String(2),
          label: '下跌',
          children: <ZindexView filter={(zindex) => zindex.zdd < 0} />,
        },
      ]}
    />
  );
}

function QuotationGroup() {
  const favoriteQuotationMap = useAppSelector((state) => state.quotation.favoriteQuotationMap);

  return (
    <GroupTab
      tabKey={Enums.TabKeyType.Quotation}
      items={[
        {
          key: String(0),
          label: '行业',
          children: <QuotationView filter={(quotation) => quotation.type === Enums.QuotationType.Industry} />,
        },
        {
          key: String(1),
          label: '概念',
          children: <QuotationView filter={(quotation) => quotation.type === Enums.QuotationType.Concept} />,
        },
        {
          key: String(2),
          label: '地域',
          children: <QuotationView filter={(quotation) => quotation.type === Enums.QuotationType.Area} />,
        },
        {
          key: String(3),
          label: '关注',
          children: <QuotationView filter={(quotaion) => favoriteQuotationMap[quotaion.code]} />,
        },
      ]}
    />
  );
}

function StockGroup() {
  const codeMap = useAppSelector((state) => state.wallet.stockConfigCodeMap);

  return (
    <GroupTab
      tabKey={Enums.TabKeyType.Stock}
      items={[
        {
          key: String(-1),
          label: '全部',
          children: <StockView filter={() => true} />,
        },
        {
          key: String(-2),
          label: '持有',
          children: <StockView filter={(stock) => !!codeMap[stock.secid]?.cyfe} />,
        },
        ...stockTypesConfig.map((type) => ({
          key: String(type.code),
          label: type.name,
          children: <StockView filter={(stock) => codeMap[stock.secid].type === type.code} />,
        })),
      ]}
    />
  );
}

function CoinGroup() {
  return (
    <GroupTab
      tabKey={Enums.TabKeyType.Coin}
      items={[
        {
          key: String(0),
          label: '全部',
          children: <CoinView filter={() => true} />,
        },
        {
          key: String(1),
          label: '上涨',
          children: <CoinView filter={(coin) => Number(coin.change24h) >= 0} />,
        },
        {
          key: String(2),
          label: '下跌',
          children: <CoinView filter={(coin) => Number(coin.change24h) < 0} />,
        },
      ]}
    />
  );
}

const Body = () => {
  const tabsActiveKey = useAppSelector((state) => state.tabs.activeKey);
  const bottomTabsSetting = useAppSelector((state) => state.setting.systemSetting.bottomTabsSetting);

  const items = useCreation(
    () =>
      bottomTabsSetting.map((tab) => {
        const Component = tabsKeyMap[tab.key];
        return {
          label: tab.key,
          key: String(tab.key),
          children: <Component />,
        };
      }),
    [bottomTabsSetting]
  );

  return (
    <Tabs renderTabBar={() => <></>} activeKey={String(tabsActiveKey)} animated={true} destroyInactiveTabPane items={items} />
  );
};

const Home: React.FC<HomeProps> = () => {
  return (
    <div className={styles.layout}>
      <Header>
        <Wallet />
        <SortBar />
      </Header>
      <Body />
      <Footer>
        <Toolbar />
        <TabsBar />
      </Footer>
      <WebViewerDrawer />
      <ChatGPTDrawer />
      <TranslateDrawer />
      <Collect title="home" />
    </div>
  );
};

export default Home;
