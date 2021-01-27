import React, { useEffect, useState, useRef } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import request from 'request';
import FundRow from '../../components/FundRow';
import Toolbar from '../../components/Toolbar';
import Wallet from '../../components/Wallet';

import {
  toggleToolbarDeleteStatus,
  changeToolbarDeleteStatus
} from '../../actions/toolbar';
import { StoreState } from '../../reducers/types';
import { ToolbarState } from '../../reducers/toolbar';

import * as Utils from '../../utils';
import '../../utils/jsonpgz';

import styles from './index.scss';
import CONST_STORAGE from '../../constants/storage.json';

export const getFund: (
  code: string
) => Promise<Fund.ResponseItem> = async code => {
  return new Promise((resolve, reject) => {
    request.get(
      `http://fundgz.1234567.com.cn/js/${code}.js`,
      (error, response, body) => {
        if (!error) {
          resolve(eval(body));
        } else {
          reject({});
        }
      }
    );
  });
};

export interface HomeProps {
  toolbar: ToolbarState;
  toggleToolbarDeleteStatus: () => void;
}

const Home: React.FC<HomeProps> = ({ toggleToolbarDeleteStatus }) => {
  const [funds, setFunds] = useState<Fund.ResponseItem[]>([]);

  const fresh = async () => {
    const fundConfig: Fund.SettingItem[] = Utils.GetStorage(
      CONST_STORAGE.FUND_SETTING,
      []
    );

    const result: Fund.ResponseItem[] = await Promise.all(
      fundConfig.map(({ code }) => getFund(code))
    );

    setFunds(result);
    return result;
  };

  useEffect(() => {
    fresh();
  }, []);

  return (
    <div className={styles.layout}>
      <Wallet />
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
      { toggleToolbarDeleteStatus, changeToolbarDeleteStatus },
      dispatch
    )
)(Home);
