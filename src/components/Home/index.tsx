import React, { useEffect, useState, createContext } from 'react';
import { Tabs } from 'antd';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useInterval, useRequest } from 'ahooks';

import FundRow from '../FundRow';
import ZindexRow from '../ZindexRow';
import Toolbar from '../Toolbar';
import Wallet from '../Wallet/index';
import LoadingBar from '../LoadingBar';
import Header from '../Header';
import Footer from '../Footer';
import SortBar from '../SortBar';
import TabsBar from '../TabsBar';

import {
  toggleToolbarDeleteStatus,
  changeToolbarDeleteStatus,
} from '../../actions/toolbar';
import { updateUpdateTime } from '../../actions/wallet';
import { getFunds, getFundConfig } from '../../actions/fund';
import { getZindexs } from '../../actions/zindex';
import { getSystemSetting } from '../../actions/setting';
import { getSortMode } from '../../actions/sort';
import { StoreState } from '../../reducers/types';
import { TabsState } from '../../reducers/tabs';
import { ToolbarState } from '../../reducers/toolbar';
import { calcFund } from '../../actions/fund';
import { getZindexConfig } from '../../actions/zindex';
import { getCurrentHours } from '../../actions/time';
import '../../utils/jsonpgz';
import * as Enums from '../../utils/enums';
import * as Utils from '../../utils';
import styles from './index.scss';

export interface HomeProps {
  tabs: TabsState;
  toolbar: ToolbarState;
  toggleToolbarDeleteStatus: () => void;
  updateUpdateTime: (time: string) => void;
}
export interface HomeContextType {
  funds: Fund.ResponseItem[];
  setFunds: (funds: Fund.ResponseItem[]) => void;
  freshFunds: () => Promise<void>;
  sortFunds: (responseFunds?: Fund.ResponseItem[]) => void;
  freshZindexs: () => Promise<void>;
  sortZindex: (esponseZindex?: Zindex.ResponseItem[]) => void;
}

export const HomeContext = createContext<HomeContextType>({
  funds: [],
  setFunds: () => {},
  freshFunds: async () => {},
  sortFunds: () => {},
  freshZindexs: async () => {},
  sortZindex: () => {},
});

const Home: React.FC<HomeProps> = ({ updateUpdateTime, tabs }) => {
  const { freshDelaySetting, autoFreshSetting } = getSystemSetting();
  const [funds, setFunds] = useState<Fund.ResponseItem[]>([]);
  const [zindexs, setZindexs] = useState<Zindex.ResponseItem[]>([]);

  const { run: runGetFunds, loading: fundsLoading } = useRequest(getFunds, {
    manual: true,
    // loadingDelay: 1000,
    throttleInterval: 1000 * 2, // 2秒请求一次
    onSuccess: (result) => {
      const now = new Date().toLocaleString();
      sortFunds(result.filter((_) => !!_) as Fund.ResponseItem[]);
      updateUpdateTime(now);
    },
  });

  const { run: runGetZindexs, loading: zindexsLoading } = useRequest(
    getZindexs,
    {
      manual: true,
      pollingInterval: 1000 * 60,
      pollingWhenHidden: false,
      onSuccess: (result) => {
        sortZindex(result.filter((_) => !!_) as Zindex.ResponseItem[]);
      },
    }
  );

  const freshFunds = async () => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    });
    runGetFunds();
  };

  const freshZindexs = async () => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    });
    runGetZindexs();
  };

  const sortFunds = (responseFunds?: Fund.ResponseItem[]) => {
    const {
      fundSortMode: { type: fundSortType, order: fundSortorder },
    } = getSortMode();
    const { codeMap } = getFundConfig();
    const sortFunds: Fund.ResponseItem[] = Utils.DeepCopy(
      responseFunds || funds
    );
    sortFunds.sort((a, b) => {
      const _a = calcFund(a);
      const _b = calcFund(b);
      const t = fundSortorder === Enums.SortOrderType.Asc ? 1 : -1;
      switch (fundSortType) {
        case Enums.FundSortType.Growth:
          return Number(_a.gszzl) > Number(_b.gszzl) ? 1 * t : -1 * t;
        case Enums.FundSortType.Block:
          return Number(_a.cyfe) > Number(_b.cyfe) ? 1 * t : -1 * t;
        case Enums.FundSortType.Money:
          return Number(_a.jrsygz) > Number(_b.jrsygz) ? 1 * t : -1 * t;
        case Enums.FundSortType.Estimate:
          return Number(_a.gszz) > Number(_b.gszz) ? 1 * t : -1 * t;
        case Enums.FundSortType.Default:
        default:
          return codeMap[a.fundcode]?.originSort >
            codeMap[b.fundcode]?.originSort
            ? -1 * t
            : 1 * t;
      }
    });
    setFunds(sortFunds);
  };

  const sortZindex = (responseZindexs?: Zindex.ResponseItem[]) => {
    const {
      zindexSortMode: { type: zindexSortType, order: zindexSortorder },
    } = getSortMode();
    const { codeMap } = getZindexConfig();
    const sortZindex: Zindex.ResponseItem[] = Utils.DeepCopy(
      responseZindexs || zindexs
    );
    sortZindex.sort((a, b) => {
      const t = zindexSortorder === Enums.SortOrderType.Asc ? 1 : -1;
      switch (zindexSortType) {
        case Enums.ZindexSortType.Zdd:
          return a.zdd > b.zdd ? 1 * t : -1 * t;
        case Enums.ZindexSortType.Zdf:
          return a.zdf > b.zdf ? 1 * t : -1 * t;
        case Enums.ZindexSortType.Zsz:
          return a.zsz > b.zsz ? 1 * t : -1 * t;
        case Enums.ZindexSortType.Custom:
        default:
          return codeMap[a.zindexCode]?.originSort >
            codeMap[b.zindexCode]?.originSort
            ? -1 * t
            : 1 * t;
      }
    });
    setZindexs(sortZindex);
  };

  useInterval(async () => {
    if (autoFreshSetting) {
      const timestamp = await getCurrentHours();
      const hours = new Date(Number(timestamp)).getHours();
      if (hours >= 9 && hours <= 15) {
        freshFunds();
      }
    }
  }, freshDelaySetting * 1000 * 60);

  useEffect(() => {
    freshFunds();
    runGetZindexs();
  }, []);

  return (
    <HomeContext.Provider
      value={{
        freshFunds,
        sortFunds,
        funds,
        setFunds,
        freshZindexs,
        sortZindex,
      }}
    >
      <div className={styles.layout}>
        <Header>
          <Wallet />
          <SortBar />
        </Header>
        <Tabs
          defaultActiveKey={String(tabs.activeKey)}
          renderTabBar={() => <></>}
          activeKey={String(tabs.activeKey)}
          animated={{ tabPane: true }}
        >
          <Tabs.TabPane key={Enums.TabKeyType.Funds} forceRender>
            <LoadingBar show={fundsLoading} />
            <div className={styles.container}>
              {funds.map((fund, index) => (
                <FundRow key={fund.fundcode} fund={fund} index={index} />
              ))}
              {!funds.length && (
                <div className={styles.empty}>暂无基金数据~</div>
              )}
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane key={Enums.TabKeyType.Zindex} forceRender>
            <LoadingBar show={zindexsLoading} />
            <div className={styles.container}>
              {zindexs.map((zindex, index) => (
                <ZindexRow
                  key={zindex.zindexCode}
                  zindex={zindex}
                  index={index}
                />
              ))}
              {!zindexs.length && (
                <div className={styles.empty}>暂无指数数据~</div>
              )}
            </div>
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

export default connect(
  (state: StoreState) => ({
    toolbar: state.toolbar,
    tabs: state.tabs,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        toggleToolbarDeleteStatus,
        changeToolbarDeleteStatus,
        updateUpdateTime,
      },
      dispatch
    )
)(Home);
