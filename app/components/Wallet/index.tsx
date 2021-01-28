import React from 'react';
import { useScroll } from 'ahooks';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { ReactComponent as ConsumptionIcon } from 'assets/icons/consumption.svg';
import { ReactComponent as WalletIcon } from 'assets/icons/wallet.svg';
import { StoreState } from '../../reducers/types';
import * as Utils from '../../utils';
import { calcFunds } from '../../actions/storage';
import { WalletState } from '../../reducers/wallet';
import styles from './index.scss';

export interface WalletProps {
  funds: Fund.ResponseItem[];
  wallet: WalletState;
}
const Wallet: React.FC<WalletProps> = ({ funds, wallet }) => {
  const position = useScroll(document, val => val.top <= 400);
  const { zje, sygz } = calcFunds(funds);

  return (
    <div className={styles.layout}>
      <div
        className={classnames(styles.content, {
          [styles.minMode]: position.top > 40
        })}
      >
        <WalletIcon />
        <div className={styles.info}>
          <div>
            <div className={styles.last}>刷新时间：{wallet.updateTime}</div>
            <div></div>
          </div>
          <div className={styles.moneyBar}>
            <div>
              <ConsumptionIcon />
              持有金额：{zje.toFixed(2)}
            </div>
            <i></i>
            <div>
              <ConsumptionIcon />
              收益估值：{sygz.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default connect((state: StoreState) => ({
  wallet: state.wallet
}))(Wallet);
