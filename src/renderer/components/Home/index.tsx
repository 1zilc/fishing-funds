import React, { createContext, useContext } from 'react';
import classnames from 'classnames';
import { Tabs } from 'antd';
import { useSelector } from 'react-redux';

import LoadingScreen from '@/components/LoadingScreen';
import FundList from '@/components/Home/FundList';
import ZindexList from '@/components/Home/ZindexList';
import QuotationList from '@/components/Home/QuotationList';
import Toolbar from '@/components/Toolbar';
import Wallet from '@/components/Wallet/index';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SortBar from '@/components/SortBar';
import TabsBar from '@/components/TabsBar';
import Collect from '@/components/Collect';
import { StoreState } from '@/reducers/types';
import { useNativeThemeColor } from '@/utils/hooks';
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

const Home: React.FC<HomeProps> = () => {
  const tabsActiveKey = useSelector(
    (state: StoreState) => state.tabs.activeKey
  );

  const { colors: varibleColors, darkMode } = useNativeThemeColor(
    CONST.VARIBLES
  );

  return (
    <HomeContext.Provider value={{ darkMode, varibleColors }}>
      <div className={classnames(styles.layout)}>
        <LoadingScreen />
        <Header>
          <Wallet />
          <SortBar />
        </Header>
        <Tabs
          defaultActiveKey={String(tabsActiveKey)}
          renderTabBar={() => <></>}
          activeKey={String(tabsActiveKey)}
          animated={{ tabPane: true, inkBar: false }}
        >
          <Tabs.TabPane key={String(Enums.TabKeyType.Funds)} forceRender>
            <FundList />
          </Tabs.TabPane>
          <Tabs.TabPane key={String(Enums.TabKeyType.Zindex)} forceRender>
            <ZindexList />
          </Tabs.TabPane>
          <Tabs.TabPane key={String(Enums.TabKeyType.Quotation)} forceRender>
            <QuotationList />
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
