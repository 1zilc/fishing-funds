import React from 'react';
import { useScroll } from 'ahooks';
import classnames from 'classnames';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ReactComponent as ConsumptionIcon } from '../../assets/icons/consumption.svg';
import { ReactComponent as WalletIcon } from '../../assets/icons/wallet.svg';
import { ReactComponent as EyeIcon } from '../../assets/icons/eye.svg';
import { ReactComponent as EyeCloseIcon } from '../../assets/icons/eye-close.svg';
import { StoreState } from '../../reducers/types';
import { toggleEyeStatus } from '../../actions/wallet';
import * as Enums from '../../utils/enums';
import * as Utils from '../../utils';
import { calcFunds } from '../../actions/fund';
import { WalletState } from '../../reducers/wallet';
import styles from './index.scss';

export interface WalletProps {
  funds: Fund.ResponseItem[];
  wallet: WalletState;
  toggleEyeStatus: () => void;
}
const Wallet: React.FC<WalletProps> = ({ funds, wallet, toggleEyeStatus }) => {
  const position = useScroll(document, (val) => val.top <= 400);
  const { zje, sygz } = calcFunds(funds);
  const eyeOpen = wallet.eyeStatus === Enums.EyeStatus.Open;

  const display_zje = eyeOpen ? zje.toFixed(2) : Utils.Encrypt(zje.toFixed(2));
  const display_sygz = eyeOpen
    ? sygz.toFixed(2)
    : Utils.Encrypt(sygz.toFixed(2));

  return (
    <div className={styles.layout}>
      <div
        className={classnames(styles.content, {
          [styles.minMode]: position.top > 40,
        })}
      >
        <WalletIcon />
        <div className={styles.info}>
          <div className={styles.timeBar}>
            <div className={styles.last}>刷新时间：{wallet.updateTime}</div>
          </div>
          <div className={styles.moneyBar}>
            <div>
              <ConsumptionIcon />
              <span>持有金额：</span>
              <span>{display_zje}</span>
            </div>
            <i></i>
            <div>
              <ConsumptionIcon />
              <span>收益估值：</span>
              <span>{display_sygz}</span>
            </div>
          </div>
        </div>
        <div className={styles.eye}>
          {wallet.eyeStatus === Enums.EyeStatus.Open ? (
            <EyeIcon onClick={toggleEyeStatus} />
          ) : (
            <EyeCloseIcon onClick={toggleEyeStatus} />
          )}
        </div>
      </div>
    </div>
  );
};

export default connect(
  (state: StoreState) => ({
    wallet: state.wallet,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        toggleEyeStatus,
      },
      dispatch
    )
)(Wallet);
