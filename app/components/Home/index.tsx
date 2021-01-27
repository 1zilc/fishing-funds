import React, { useEffect, useState } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useLocalStorageState } from 'ahooks';
import superagent from 'superagent';
import FundRow, { codes } from '../../components/FundRow';
import Toolbar from '../../components/Toolbar';

import {
  toggleToolbarDeleteStatus,
  changeToolbarDeleteStatus
} from '../../actions/toolbar';
import { StoreState } from '../../reducers/types';
import { ToolbarState } from '../../reducers/toolbar';

import styles from './index.scss';
import CONST_STORAGE from '../../constants/storage.json';

export const getFund = async (code: string) => {
  try {
    const { text } = await superagent.get(
      `http://fundgz.1234567.com.cn/js/${code}.js`
    );
    return eval(text);
  } catch {
    return null;
  }
};

export interface HomeProps {
  toolbar: ToolbarState;
  toggleToolbarDeleteStatus: () => void;
}

const Home: React.FC<HomeProps> = ({ toggleToolbarDeleteStatus }) => {
  const [funds, setFunds] = useState<Fund.ResponseItem[]>([]);

  const fresh = async () => {
    const fundSetting: Fund.SettingItem[] = JSON.parse(
      localStorage.getItem(CONST_STORAGE.FUND_SETTING)!
    );
    const result: Fund.ResponseItem[] = await Promise.all(
      fundSetting!.map(({ code }) => getFund(code))
    );
    setFunds(result);
    return result;
  };

  useEffect(() => {
    fresh();
  }, []);

  const a = [1, 23, 4];
  a.splice(1, 1);
  console.log(a);

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        {funds.map((fund, index) => {
          return (
            <FundRow key={index} fund={fund} index={index} onFresh={fresh} />
          );
        })}
      </div>
      <Toolbar onFresh={fresh} onDelete={toggleToolbarDeleteStatus} />
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
