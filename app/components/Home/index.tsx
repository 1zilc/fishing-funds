import React, { useEffect, useState } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import superagent from 'superagent';
import FundRow, { Fund, codes } from '../../components/FundRow';
import Toolbar from '../../components/Toolbar';

import {
  toggleToolbarDeleteStatus,
  changeToolbarDeleteStatus
} from '../../actions/toolbar';
import { StoreState } from '../../reducers/types';
import { ToolbarState } from '../../reducers/toolbar';

import styles from './index.scss';

export const getFund = async (code: string) => {
  const { text } = await superagent.get(
    `http://fundgz.1234567.com.cn/js/${code}.js`
  );
  return eval(text);
};

export interface HomeProps {
  toolbar: ToolbarState;
  toggleToolbarDeleteStatus: () => void;
}

const Home: React.FC<HomeProps> = ({ toolbar, toggleToolbarDeleteStatus }) => {
  const [funds, setFunds] = useState<Fund[]>([]);
  const fresh = async () => {
    const result: Fund[] = await Promise.all(
      codes.map(({ code }) => getFund(code))
    );
    setFunds(result);
    return result;
  };
  useEffect(() => {
    fresh();
  }, []);

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        {funds.map((fund, index) => {
          return <FundRow key={index} fund={fund} index={index} />;
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
