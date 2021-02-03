import React, { useEffect, useState, useRef } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useInterval, useRequest } from 'ahooks';

import FundRow from '../FundRow';
import Toolbar from '../Toolbar';
import Wallet from '../Wallet/index';
import LoadingBar from '../LoadingBar';
import SortBar from '../SortBar';

import {
  toggleToolbarDeleteStatus,
  changeToolbarDeleteStatus,
} from '../../actions/toolbar';
import { updateUpdateTime } from '../../actions/wallet';
import { getFunds, getFundConfig } from '../../actions/fund';
import { getSystemSetting } from '../../actions/setting';
import {
  getSortMode,
  setSortMode,
  getSortConfig,
  troggleSortOrder,
} from '../../actions/sort';
import { StoreState } from '../../reducers/types';
import { ToolbarState } from '../../reducers/toolbar';
import { calcFund } from '../../actions/fund';
import '../../utils/jsonpgz';
import * as Enums from '../../utils/enums';
import * as Utils from '../../utils';
import styles from './index.scss';

export interface HomeProps {
  toolbar: ToolbarState;
  toggleToolbarDeleteStatus: () => void;
  updateUpdateTime: (time: string) => void;
}

const Home: React.FC<HomeProps> = ({ updateUpdateTime }) => {
  const { freshDelaySetting, autoFreshSetting } = getSystemSetting();
  const [funds, setFunds] = useState<Fund.ResponseItem[]>([]);
  const { run, loading } = useRequest(getFunds, {
    manual: true,
    // loadingDelay: 1000,
    throttleInterval: 1000 * 2, // 2秒请求一次
    onSuccess: (result) => {
      const now = new Date().toLocaleString();
      sort(result.filter((_) => !!_) as Fund.ResponseItem[]);
      updateUpdateTime(now);
    },
  });

  const fresh = async () => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    });
    run();
  };

  const sort = (responseFunds?: Fund.ResponseItem[]) => {
    const { type, order } = getSortMode();
    const { codeMap } = getFundConfig();
    const sortFunds: Fund.ResponseItem[] = JSON.parse(
      JSON.stringify(responseFunds || funds)
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

  useInterval(() => {
    if (autoFreshSetting) {
      fresh();
    }
  }, freshDelaySetting * 1000 * 60);

  useEffect(() => {
    fresh();
  }, []);

  return (
    <div className={styles.layout}>
      <Wallet funds={funds} />
      <SortBar onSort={sort} />
      <LoadingBar show={loading} />
      <div className={styles.container}>
        {funds.map((fund, index) => (
          <FundRow
            key={fund.fundcode}
            fund={fund}
            index={index}
            onFresh={fresh}
          />
        ))}
        {funds.length === 0 && (
          <div className={styles.empty}>暂无基金数据~</div>
        )}
      </div>
      <Toolbar onFresh={fresh} />
    </div>
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
