import React, { createContext } from 'react';
import classnames from 'classnames';
import { Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRequest } from 'ahooks';

import FundList from '@/components/Home/FundList';
import ZindexList from '@/components/Home/ZindexList';
import QuotationList from '@/components/Home/QuotationList';
import Toolbar from '@/components/Toolbar';
import Wallet from '@/components/Wallet/index';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SortBar from '@/components/SortBar';
import TabsBar from '@/components/TabsBar';
import { SET_REMOTE_FUNDS, loadFunds } from '@/actions/fund';
import {
  getZindexs,
  SORT_ZINDEXS_WITH_COLLAPSE_CHACHED,
} from '@/actions/zindex';
import {
  getQuotations,
  SORT_QUOTATIONS_WITH_COLLAPSE_CHACHED,
} from '@/actions/quotation';
import { getSystemSetting } from '@/actions/setting';
import { StoreState } from '@/reducers/types';
import { useActions } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as Services from '@/services';

import styles from './index.scss';

export interface HomeProps {}

export interface HomeContextType {
  runGetFunds: () => void;
  runGetZindexs: () => void;
  runGetQuotations: () => void;
}

export const HomeContext = createContext<HomeContextType>({
  runGetFunds: () => {},
  runGetZindexs: () => {},
  runGetQuotations: () => {},
});

const Home: React.FC<HomeProps> = () => {
  const dispatch = useDispatch();
  const { lowKeySetting } = getSystemSetting();
  const tabsActiveKey = useSelector(
    (state: StoreState) => state.tabs.activeKey
  );

  useRequest(Services.Fund.GetRemoteFundsFromEastmoney, {
    pollingInterval: 1000 * 60 * 60 * 24,
    throwOnError: true,
    onSuccess: (result) => {
      dispatch({
        type: SET_REMOTE_FUNDS,
        payload: result,
      });
    },
  });

  return (
    <div className={classnames(styles.layout)}>
      {lowKeySetting && <style>{`html { filter: grayscale(95%) }`}</style>}
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
        <Tabs.TabPane key={Enums.TabKeyType.Funds} forceRender>
          <FundList />
        </Tabs.TabPane>
        <Tabs.TabPane key={Enums.TabKeyType.Zindex} forceRender>
          <ZindexList />
        </Tabs.TabPane>
        <Tabs.TabPane key={Enums.TabKeyType.Quotation} forceRender>
          <QuotationList />
        </Tabs.TabPane>
      </Tabs>
      <Footer>
        <Toolbar />
        <TabsBar />
      </Footer>
    </div>
  );
};

export default Home;
