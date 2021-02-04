import React, { useEffect, useState, createContext } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useInterval, useRequest } from 'ahooks';

import FundRow from '../FundRow';
import Toolbar from '../Toolbar';
import Wallet from '../Wallet/index';
import LoadingBar from '../LoadingBar';
import Header from '../Header';
import SortBar from '../SortBar';

import {
  toggleToolbarDeleteStatus,
  changeToolbarDeleteStatus,
} from '../../actions/toolbar';
import { updateUpdateTime } from '../../actions/wallet';
import { getFunds, getFundConfig } from '../../actions/fund';
import { getSystemSetting } from '../../actions/setting';
import { getSortMode } from '../../actions/sort';
import { StoreState } from '../../reducers/types';
import { ToolbarState } from '../../reducers/toolbar';
import { calcFund } from '../../actions/fund';
import { getCurrentHours } from '../../actions/time';
import '../../utils/jsonpgz';
import * as Enums from '../../utils/enums';
import * as Utils from '../../utils';
import styles from './index.scss';
import { time } from 'console';

export interface HomeProps {
  toolbar: ToolbarState;
  toggleToolbarDeleteStatus: () => void;
  updateUpdateTime: (time: string) => void;
}
export interface HomeContextType {
  funds: Fund.ResponseItem[];
  setFunds: (funds: Fund.ResponseItem[]) => void;
  freshFunds: () => Promise<void>;
  sortFunds: (esponseFunds?: Fund.ResponseItem[]) => void;
}

export const HomeContext = createContext<HomeContextType>({
  funds: [],
  setFunds: () => {},
  freshFunds: async () => {},
  sortFunds: () => {},
});

const Home: React.FC<HomeProps> = ({ updateUpdateTime }) => {
  const { freshDelaySetting, autoFreshSetting } = getSystemSetting();
  const [funds, setFunds] = useState<Fund.ResponseItem[]>([]);
  const { run: runGetFunds, loading } = useRequest(getFunds, {
    manual: true,
    // loadingDelay: 1000,
    throttleInterval: 1000 * 2, // 2秒请求一次
    onSuccess: (result) => {
      const now = new Date().toLocaleString();
      sortFunds(result.filter((_) => !!_) as Fund.ResponseItem[]);
      updateUpdateTime(now);
    },
  });

  const freshFunds = async () => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    });
    runGetFunds();
  };

  const sortFunds = (responseFunds?: Fund.ResponseItem[]) => {
    const { type, order } = getSortMode();
    const { codeMap } = getFundConfig();
    const sortFunds: Fund.ResponseItem[] = Utils.DeepCopy(
      responseFunds || funds
    );

    sortFunds.sort((a, b) => {
      const _a = calcFund(a);
      const _b = calcFund(b);
      const t = order === Enums.SortOrderType.Asc ? 1 : -1;
      switch (type) {
        case Enums.SortType.Growth:
          return Number(_a.gszzl) > Number(_b.gszzl) ? 1 * t : -1 * t;
        case Enums.SortType.Block:
          return Number(_a.cyfe) > Number(_b.cyfe) ? 1 * t : -1 * t;
        case Enums.SortType.Money:
          return Number(_a.jrsygz) > Number(_b.jrsygz) ? 1 * t : -1 * t;
        case Enums.SortType.Estimate:
          return Number(_a.gszz) > Number(_b.gszz) ? 1 * t : -1 * t;
        case Enums.SortType.Default:
        default:
          return codeMap[a.fundcode]?.originSort >
            codeMap[b.fundcode]?.originSort
            ? -1 * t
            : 1 * t;
      }
    });
    setFunds(sortFunds);
  };

  useInterval(async () => {
    if (autoFreshSetting) {
      const timestamp = await getCurrentHours();
      console.log(timestamp);
      const hours = new Date(Number(timestamp)).getHours();
      if (hours >= 9 && hours <= 15) {
        freshFunds();
      }
    }
  }, freshDelaySetting * 1000 * 60);

  useEffect(() => {
    freshFunds();
  }, []);

  return (
    <HomeContext.Provider value={{ freshFunds, sortFunds, funds, setFunds }}>
      <div className={styles.layout}>
        <Header>
          <Wallet />
          <SortBar />
        </Header>
        <LoadingBar show={loading} />
        <div className={styles.container}>
          {funds.map((fund, index) => (
            <FundRow key={fund.fundcode} fund={fund} index={index} />
          ))}
          {!funds.length && <div className={styles.empty}>暂无基金数据~</div>}
        </div>
        <Toolbar />
      </div>
    </HomeContext.Provider>
  );
};

export default connect(
  (state: StoreState) => ({
    toolbar: state.toolbar,
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
