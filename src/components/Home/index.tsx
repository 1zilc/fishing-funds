import React, { useEffect, useState, useRef } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useInterval, useRequest } from 'ahooks';

import FundRow from '../FundRow';
import Toolbar from '../Toolbar';
import Wallet from '../Wallet/index';
import LoadingBar from '../LoadingBar';

import {
  toggleToolbarDeleteStatus,
  changeToolbarDeleteStatus,
} from '../../actions/toolbar';
import { updateUpdateTime } from '../../actions/wallet';
import { getFunds, getFundConfig } from '../../actions/fund';
import { getSystemSetting } from '../../actions/setting';
import { StoreState } from '../../reducers/types';
import { ToolbarState } from '../../reducers/toolbar';
import '../../utils/jsonpgz';

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
      setFunds(result.filter((_) => !!_) as Fund.ResponseItem[]);
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
      <LoadingBar show={loading} />
      <div className={styles.container}>
        {funds.map((fund, index) => {
          return (
            <FundRow
              key={fund.fundcode}
              fund={fund}
              index={index}
              onFresh={fresh}
            />
          );
        })}
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
