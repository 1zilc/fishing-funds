import React, { useEffect, useState, useRef } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import FundRow from '../../components/FundRow';
import Toolbar from '../../components/Toolbar';
import Wallet from '../../components/Wallet';

import {
  toggleToolbarDeleteStatus,
  changeToolbarDeleteStatus
} from '../../actions/toolbar';
import { updateUpdateTime } from '../../actions/wallet';
import { getFund } from '../../actions/fund';
import { StoreState } from '../../reducers/types';
import { ToolbarState } from '../../reducers/toolbar';

import * as Utils from '../../utils';
import '../../utils/jsonpgz';

import styles from './index.scss';
import CONST_STORAGE from '../../constants/storage.json';

export interface HomeProps {
  toolbar: ToolbarState;
  toggleToolbarDeleteStatus: () => void;
  updateUpdateTime: (time: string) => void;
}

const Home: React.FC<HomeProps> = ({ updateUpdateTime }) => {
  const [funds, setFunds] = useState<Fund.ResponseItem[]>([]);

  const fresh = async () => {
    const fundConfig: Fund.SettingItem[] = Utils.GetStorage(
      CONST_STORAGE.FUND_SETTING,
      []
    );

    const result: Fund.ResponseItem[] = await Promise.all(
      fundConfig.map(({ code }) => getFund(code))
    );

    const now = new Date().toLocaleString();

    setFunds(result);
    updateUpdateTime(now);
    return result;
  };

  useEffect(() => {
    fresh();
  }, []);

  return (
    <div className={styles.layout}>
      <Wallet funds={funds} />
      <div className={styles.container}>
        {funds.map((fund, index) => {
          return (
            <FundRow key={index} fund={fund} index={index} onFresh={fresh} />
          );
        })}
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
