import React, { useEffect, useState, useRef } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import got from 'got';
import { useInterval, useRequest } from 'ahooks';

import FundRow from '../FundRow';
import Toolbar from '../Toolbar';
import Wallet from '../Wallet';
import LoadingBar from '../LoadingBar';

import {
  toggleToolbarDeleteStatus,
  changeToolbarDeleteStatus
} from '../../actions/toolbar';
import { updateUpdateTime } from '../../actions/wallet';
import { getFund, getFundConfig } from '../../actions/fund';
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
  const { fundConfig } = getFundConfig();
  const [funds, setFunds] = useState<Fund.ResponseItem[]>([]);
  const { run, loading } = useRequest(
    async () => Promise.all(fundConfig.map(({ code }) => getFund(code))),
    {
      manual: true,
      // loadingDelay: 1000,
      throttleInterval: 1000 * 2, // 3秒请求一次
      onSuccess: result => {
        const now = new Date().toLocaleString();
        console.log(result);
        setFunds(result.filter<any>(_ => !!_));
        updateUpdateTime(now);
      }
    }
  );

  console.log(fundConfig);

  const fresh = async () => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0
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
    toolbar: state.toolbar
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        toggleToolbarDeleteStatus,
        changeToolbarDeleteStatus,
        updateUpdateTime
      },
      dispatch
    )
)(Home);
