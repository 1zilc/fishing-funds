import React from 'react';
import { useScroll } from 'ahooks';
import classnames from 'classnames';
import { ReactComponent as ConsumptionIcon } from 'assets/icons/consumption.svg';
import { ReactComponent as WalletIcon } from 'assets/icons/wallet.svg';

import styles from './index.scss';

const Wallet = () => {
  const position = useScroll(document, val => val.top <= 400);
  const now = new Date().toLocaleString();
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
            <div className={styles.last}>刷新时间：{now}</div>
            <div></div>
          </div>
          <div className={styles.moneyBar}>
            <div>总金额：20000</div>
            <i></i>
            <div>收益估值：388</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Wallet;
