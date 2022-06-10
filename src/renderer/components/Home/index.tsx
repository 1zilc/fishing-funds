import React from 'react';
import clsx from 'clsx';
import { Tabs } from 'antd';
import Toolbar from '@/components/Toolbar';
import Wallet from '@/components/Wallet/index';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SortBar from '@/components/SortBar';
import TabsBar from '@/components/TabsBar';
import Collect from '@/components/Collect';
import GroupTab from '@/components/GroupTab';
import GlobalStyles from '@/components/GlobalStyles';
import WebViewer from '@/components/WebViewer';
import { stockTypesConfig } from '@/components/Toolbar/AppCenterContent/StockSearch';

import { useAppSelector } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

const FundView = React.lazy(() => import('@/components/Home/FundView'));
const ZindexView = React.lazy(() => import('@/components/Home/ZindexView'));
const QuotationView = React.lazy(() => import('@/components/Home/QuotationView'));
const StockView = React.lazy(() => import('@/components/Home/StockView'));
const CoinView = React.lazy(() => import('@/components/Home/CoinView'));

const tabsKeyMap = {
  [Enums.TabKeyType.Funds]: FundGroup,
  [Enums.TabKeyType.Zindex]: ZindexGroup,
  [Enums.TabKeyType.Quotation]: QuotationGroup,
  [Enums.TabKeyType.Stock]: StockGroup,
  [Enums.TabKeyType.Coin]: CoinGroup,
};

export interface HomeProps {}

function FundGroup() {
  const codeMap = useAppSelector((state) => state.wallet.fundConfigCodeMap);

  return (
    <GroupTab tabKey={Enums.TabKeyType.Funds}>
      <Tabs.TabPane tab="全部" key={String(0)}>
        <FundView filter={() => true} />
      </Tabs.TabPane>
      <GroupTab.TabPane tab="持有" key={String(1)}>
        <FundView filter={(fund) => !!codeMap[fund.fundcode!]?.cyfe} />
      </GroupTab.TabPane>
      <GroupTab.TabPane tab="自选" key={String(2)}>
        <FundView filter={(fund) => !codeMap[fund.fundcode!]?.cyfe} />
      </GroupTab.TabPane>
      <GroupTab.TabPane tab="净值更新" key={String(3)}>
        <FundView filter={(fund) => !!Helpers.Fund.CalcFund(fund, codeMap).isFix} />
      </GroupTab.TabPane>
    </GroupTab>
  );
}

function ZindexGroup() {
  // const { codeMap: zindexCodeMap } = useAppSelector((state) => state.zindex.config);

  return (
    <GroupTab tabKey={Enums.TabKeyType.Zindex}>
      <GroupTab.TabPane tab="全部" key={String(0)}>
        <ZindexView filter={() => true} />
      </GroupTab.TabPane>
      <GroupTab.TabPane tab="上涨" key={String(1)}>
        <ZindexView filter={(zindex) => zindex.zdd >= 0} />
      </GroupTab.TabPane>
      <GroupTab.TabPane tab="下跌" key={String(2)}>
        <ZindexView filter={(zindex) => zindex.zdd < 0} />
      </GroupTab.TabPane>
    </GroupTab>
  );
}

function QuotationGroup() {
  const favoriteQuotationMap = useAppSelector((state) => state.quotation.favoriteQuotationMap);

  return (
    <GroupTab tabKey={Enums.TabKeyType.Quotation}>
      <GroupTab.TabPane tab="行业" key={String(0)}>
        <QuotationView filter={(quotation) => quotation.type === Enums.QuotationType.Industry} />
      </GroupTab.TabPane>
      <GroupTab.TabPane tab="概念" key={String(1)}>
        <QuotationView filter={(quotation) => quotation.type === Enums.QuotationType.Concept} />
      </GroupTab.TabPane>
      <GroupTab.TabPane tab="地域" key={String(2)}>
        <QuotationView filter={(quotation) => quotation.type === Enums.QuotationType.Area} />
      </GroupTab.TabPane>
      <GroupTab.TabPane tab="关注" key={String(3)}>
        <QuotationView filter={(quotaion) => favoriteQuotationMap[quotaion.code]} />
      </GroupTab.TabPane>
    </GroupTab>
  );
}

function StockGroup() {
  const { codeMap: stockCodeMap } = useAppSelector((state) => state.stock.config);

  return (
    <GroupTab tabKey={Enums.TabKeyType.Stock}>
      <GroupTab.TabPane tab="全部" key={String(-1)}>
        <StockView filter={() => true} />
      </GroupTab.TabPane>
      {stockTypesConfig.map((type) => (
        <GroupTab.TabPane tab={type.name.slice(0, 2)} key={String(type.code)}>
          <StockView filter={(stock) => stockCodeMap[stock.secid].type === type.code} />
        </GroupTab.TabPane>
      ))}
    </GroupTab>
  );
}

function CoinGroup() {
  return (
    <GroupTab tabKey={Enums.TabKeyType.Coin}>
      <GroupTab.TabPane tab="全部" key={String(0)}>
        <CoinView filter={() => true} />
      </GroupTab.TabPane>
      <GroupTab.TabPane tab="上涨" key={String(1)}>
        <CoinView filter={(coin) => Number(coin.change24h) >= 0} />
      </GroupTab.TabPane>
      <GroupTab.TabPane tab="下跌" key={String(2)}>
        <CoinView filter={(coin) => Number(coin.change24h) < 0} />
      </GroupTab.TabPane>
    </GroupTab>
  );
}

const Body = () => {
  const tabsActiveKey = useAppSelector((state) => state.tabs.activeKey);
  const bottomTabsSetting = useAppSelector((state) => state.setting.systemSetting.bottomTabsSetting);

  return (
    <Tabs renderTabBar={() => <></>} activeKey={String(tabsActiveKey)} animated={{ tabPane: true, inkBar: false }} destroyInactiveTabPane>
      {bottomTabsSetting.map((tab) => {
        const Component = tabsKeyMap[tab.key];
        return (
          <Tabs.TabPane key={tab.key}>
            <Component />
          </Tabs.TabPane>
        );
      })}
    </Tabs>
  );
};

const Home: React.FC<HomeProps> = () => {
  return (
    <div className={clsx(styles.layout)}>
      <GlobalStyles />
      <Header>
        <Wallet />
        <SortBar />
      </Header>
      <Body />
      <Footer>
        <Toolbar />
        <TabsBar />
      </Footer>
      <WebViewer />
      <Collect title="home" />
    </div>
  );
};

export default Home;
