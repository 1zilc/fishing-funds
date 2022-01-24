import React, { createContext, useContext, useState } from 'react';
import classnames from 'classnames';
import { Tabs } from 'antd';
import { useSelector } from 'react-redux';

import FundList from '@/components/Home/FundList';
import ZindexList from '@/components/Home/ZindexList';
import QuotationList from '@/components/Home/QuotationList';
import StockList from '@/components/Home/StockList';
import CoinList from '@/components/Home/CoinList';
import Toolbar from '@/components/Toolbar';
import Wallet from '@/components/Wallet/index';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SortBar from '@/components/SortBar';
import TabsBar from '@/components/TabsBar';
import Collect from '@/components/Collect';
import GroupTab from '@/components/GroupTab';
import GlobalStyles from '@/components/GlobalStyles';
import { stockTypesConfig } from '@/components/Home/StockList/AddStockContent';
import { StoreState } from '@/reducers/types';
import { useNativeThemeColor, useCurrentWallet } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

export interface HomeProps {}

// 由于 darkModeListener 花销过大，需使用全局单一监听即可

export const HomeContext = createContext<{
  varibleColors: any;
  darkMode: boolean;
}>({
  varibleColors: {},
  darkMode: false,
});

export function useHomeContext() {
  const context = useContext(HomeContext);
  return context;
}

const FundGroup = () => {
  const { currentWalletFundsCodeMap: fundCodeMap, currentWalletCode } = useCurrentWallet();

  return (
    <GroupTab tabKey={Enums.TabKeyType.Funds}>
      <Tabs.TabPane tab="全部" key={String(0)}>
        <FundList filter={() => true} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="持有" key={String(1)}>
        <FundList filter={(fund) => !!fundCodeMap[fund.fundcode!]?.cyfe} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="自选" key={String(2)}>
        <FundList filter={(fund) => !fundCodeMap[fund.fundcode!]?.cyfe} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="净值更新" key={String(3)}>
        <FundList filter={(fund) => !!Helpers.Fund.CalcFund(fund, currentWalletCode).isFix} />
      </Tabs.TabPane>
    </GroupTab>
  );
};

const ZindexGroup = () => {
  // const { codeMap: zindexCodeMap } = useSelector((state: StoreState) => state.zindex.config);

  return (
    <GroupTab tabKey={Enums.TabKeyType.Zindex}>
      <Tabs.TabPane tab="全部" key={String(0)}>
        <ZindexList filter={() => true} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="上涨" key={String(1)}>
        <ZindexList filter={(zindex) => zindex.zdd >= 0} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="下跌" key={String(2)}>
        <ZindexList filter={(zindex) => zindex.zdd < 0} />
      </Tabs.TabPane>
    </GroupTab>
  );
};

const QuotationGroup = () => {
  const favoriteQuotationMap = useSelector((state: StoreState) => state.quotation.favoriteQuotationMap);

  return (
    <GroupTab tabKey={Enums.TabKeyType.Quotation}>
      <Tabs.TabPane tab="行业" key={String(0)}>
        <QuotationList filter={(quotation) => quotation.type === Enums.QuotationType.Industry} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="概念" key={String(1)}>
        <QuotationList filter={(quotation) => quotation.type === Enums.QuotationType.Concept} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="地域" key={String(2)}>
        <QuotationList filter={(quotation) => quotation.type === Enums.QuotationType.Area} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="关注" key={String(3)}>
        <QuotationList filter={(quotaion) => favoriteQuotationMap[quotaion.code]} />
      </Tabs.TabPane>
    </GroupTab>
  );
};

const StockGroup = () => {
  const { codeMap: stockCodeMap } = useSelector((state: StoreState) => state.stock.config);

  return (
    <GroupTab tabKey={Enums.TabKeyType.Stock}>
      <Tabs.TabPane tab="全部" key={String(-1)}>
        <StockList filter={() => true} />
      </Tabs.TabPane>
      {stockTypesConfig.map((type) => (
        <Tabs.TabPane tab={type.name.slice(0, 2)} key={String(type.code)}>
          <StockList filter={(stock) => stockCodeMap[stock.secid].type === type.code} />
        </Tabs.TabPane>
      ))}
    </GroupTab>
  );
};

const CoinGroup = () => {
  return (
    <GroupTab tabKey={Enums.TabKeyType.Coin}>
      <Tabs.TabPane tab="全部" key={String(0)}>
        <CoinList filter={() => true} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="上涨" key={String(1)}>
        <CoinList filter={(coin) => Number(coin.change24h) >= 0} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="下跌" key={String(2)}>
        <CoinList filter={(coin) => Number(coin.change24h) < 0} />
      </Tabs.TabPane>
    </GroupTab>
  );
};

const Body = () => {
  const tabsActiveKey = useSelector((state: StoreState) => state.tabs.activeKey);

  return (
    <Tabs renderTabBar={() => <></>} activeKey={String(tabsActiveKey)} animated={{ tabPane: true, inkBar: false }} destroyInactiveTabPane>
      <Tabs.TabPane key={String(Enums.TabKeyType.Funds)}>
        <FundGroup />
      </Tabs.TabPane>
      <Tabs.TabPane key={String(Enums.TabKeyType.Zindex)}>
        <ZindexGroup />
      </Tabs.TabPane>
      <Tabs.TabPane key={String(Enums.TabKeyType.Quotation)}>
        <QuotationGroup />
      </Tabs.TabPane>
      <Tabs.TabPane key={String(Enums.TabKeyType.Stock)}>
        <StockGroup />
      </Tabs.TabPane>
      <Tabs.TabPane key={String(Enums.TabKeyType.Coin)}>
        <CoinGroup />
      </Tabs.TabPane>
    </Tabs>
  );
};

const Home: React.FC<HomeProps> = () => {
  const { colors: varibleColors, darkMode } = useNativeThemeColor(CONST.VARIBLES);

  return (
    <HomeContext.Provider value={{ darkMode, varibleColors }}>
      <div className={classnames(styles.layout)}>
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
        <Collect title="home" />
      </div>
    </HomeContext.Provider>
  );
};

export default Home;
