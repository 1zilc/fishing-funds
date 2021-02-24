import React, { createContext } from 'react';
import { Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRequest } from 'ahooks';
import dayjs from 'dayjs';

import FundList from '@/components/Home/FundList';
import ZindexList from '@/components/Home/ZindexList';
import Toolbar from '@/components/Toolbar';
import Wallet from '@/components/Wallet/index';
import LoadingBar from '@/components/LoadingBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SortBar from '@/components/SortBar';
import TabsBar from '@/components/TabsBar';

import { updateUpdateTime } from '@/actions/wallet';
import { getFunds } from '@/actions/fund';
import { getZindexs } from '@/actions/zindex';
import {
  SORT_FUNDS_WITH_COLLAPSE_CHACHED,
  SET_REMOTE_FUNDS,
} from '@/actions/fund';
import { SORT_ZINDEXS_WITH_COLLAPSE_CHACHED } from '@/actions/zindex';
import { StoreState } from '@/reducers/types';
import * as Enums from '@/utils/enums';
import * as Services from '@/services';
import styles from './index.scss';

export interface HomeProps {}

export interface HomeContextType {
  runGetFunds: () => void;
  runGetZindexs: () => void;
}

export const HomeContext = createContext<HomeContextType>({
  runGetFunds: () => {},
  runGetZindexs: () => {},
});

const Home: React.FC<HomeProps> = () => {
  const dispatch = useDispatch();
  const tabsActiveKey = useSelector(
    (state: StoreState) => state.tabs.activeKey
  );

  useRequest(Services.Fund.GetRemoteFundsFromEastmoney, {
    // pollingInterval: 1000 * 60 * 60 * 24,
    throwOnError: true,
    onSuccess: (result) => {
      dispatch({
        type: SET_REMOTE_FUNDS,
        payload: result,
      });
    },
  });

  const { run: runGetFunds, loading: fundsLoading } = useRequest(getFunds, {
    manual: true,
    throwOnError: true,
    throttleInterval: 1000 * 3, // 3秒内请求一次
    onSuccess: (result) => {
      const now = dayjs().format('YYYY/MM/DD HH:mm:ss');
      dispatch(updateUpdateTime(now));
      dispatch({
        type: SORT_FUNDS_WITH_COLLAPSE_CHACHED,
        payload: result,
      });
    },
  });

  const { run: runGetZindexs, loading: zindexsLoading } = useRequest(
    getZindexs,
    {
      manual: true,
      throwOnError: true,
      onSuccess: (result) => {
        dispatch({
          type: SORT_ZINDEXS_WITH_COLLAPSE_CHACHED,
          payload: result,
        });
      },
    }
  );

  return (
    <HomeContext.Provider
      value={{
        runGetFunds,
        runGetZindexs,
      }}
    >
      <div className={styles.layout}>
        <Header>
          <Wallet />
          <SortBar />
        </Header>
        <Tabs
          defaultActiveKey={String(tabsActiveKey)}
          renderTabBar={() => <></>}
          activeKey={String(tabsActiveKey)}
          animated={{ tabPane: true }}
        >
          <Tabs.TabPane key={Enums.TabKeyType.Funds} forceRender>
            <LoadingBar show={fundsLoading} />
            <FundList />
          </Tabs.TabPane>
          <Tabs.TabPane key={Enums.TabKeyType.Zindex} forceRender>
            <LoadingBar show={zindexsLoading} />
            <ZindexList />
          </Tabs.TabPane>
        </Tabs>
        <Footer>
          <Toolbar />
          <TabsBar />
        </Footer>
      </div>
    </HomeContext.Provider>
  );
};

export default Home;
