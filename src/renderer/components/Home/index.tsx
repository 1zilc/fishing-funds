import React, { createContext, useContext } from 'react';
import classnames from 'classnames';
import { Tabs } from 'antd';
import { useSelector } from 'react-redux';

import LoadingScreen from '@/components/LoadingScreen';
import FundList from '@/components/Home/FundList';
import ZindexList from '@/components/Home/ZindexList';
import QuotationList from '@/components/Home/QuotationList';
import StockList from '@/components/Home/StockList';
import Toolbar from '@/components/Toolbar';
import Wallet from '@/components/Wallet/index';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SortBar from '@/components/SortBar';
import TabsBar from '@/components/TabsBar';
import Collect from '@/components/Collect';
import GroupTab from '@/components/GroupTab';
import { marketsConfig } from '@/components/Home/ZindexList/ManageZindexContent';
import { stockTypesConfig } from '@/components/Home/StockList/AddStockContent';
import { StoreState } from '@/reducers/types';
import { useNativeThemeColor, useCurrentWallet } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';
import styles from './index.scss';

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
  const { currentWalletFundsCodeMap: fundCodeMap } = useCurrentWallet();
  return (
    <GroupTab>
      <Tabs.TabPane tab="全部" key={String(0)}>
        <FundList filter={() => true} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="持有" key={String(1)}>
        <FundList filter={(fund) => !!fundCodeMap[fund.fundcode!].cyfe} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="自选" key={String(2)}>
        <FundList filter={(fund) => !fundCodeMap[fund.fundcode!].cyfe} />
      </Tabs.TabPane>
    </GroupTab>
  );
};

const ZindexGroup = () => {
  const { codeMap: zindexCodeMap } = useSelector((state: StoreState) => state.zindex.config);

  return (
    <GroupTab>
      <Tabs.TabPane tab="全部" key={String(-1)}>
        <ZindexList filter={() => true} />
      </Tabs.TabPane>
      {marketsConfig.map((market) => (
        <Tabs.TabPane tab={market.name.slice(0, 2)} key={String(market.code)}>
          <ZindexList filter={(zindex) => zindexCodeMap[zindex.code!].type === market.code} />
        </Tabs.TabPane>
      ))}
    </GroupTab>
  );
};

const QuotationGroup = () => {
  const favoriteQuotationMap = useSelector((state: StoreState) => state.quotation.favoriteQuotationMap);

  return (
    <GroupTab>
      <Tabs.TabPane tab="全部" key={String(0)}>
        <QuotationList filter={() => true} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="关注" key={String(1)}>
        <QuotationList filter={(quotaion) => favoriteQuotationMap[quotaion.code]} />
      </Tabs.TabPane>
    </GroupTab>
  );
};

const StockGroup = () => {
  const { codeMap: stockCodeMap } = useSelector((state: StoreState) => state.stock.config);

  return (
    <GroupTab>
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

const Home: React.FC<HomeProps> = () => {
  const tabsActiveKey = useSelector((state: StoreState) => state.tabs.activeKey);

  const { colors: varibleColors, darkMode } = useNativeThemeColor(CONST.VARIBLES);

  return (
    <HomeContext.Provider value={{ darkMode, varibleColors }}>
      <div className={classnames(styles.layout)}>
        <LoadingScreen />
        <Header>
          <Wallet />
          <SortBar />
        </Header>
        <Tabs renderTabBar={() => <></>} activeKey={String(tabsActiveKey)} animated={{ tabPane: true, inkBar: false }}>
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
        </Tabs>
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
