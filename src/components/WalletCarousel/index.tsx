import React from 'react';
import classnames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';

import { StoreState } from '@/reducers/types';
import { changeWalletIndex } from '@/actions/wallet';
import styles from './index.scss';
export interface CoinsProps {
  num: number;
}
const wallets = new Array(25).fill('').map((_, index) => {
  const { ReactComponent } = require(`@/assets/icons/wallet/${index}.svg`);
  return ReactComponent;
});

const size = {
  width: 24,
  height: 24,
};

export const WalletCarousel = () => {
  const dispatch = useDispatch();
  const walletIndex = useSelector(
    (state: StoreState) => state.wallet.walletIndex
  );
  return (
    <div className={styles.content}>
      {wallets.map((Icon, index) => (
        <div
          key={index}
          className={classnames(styles.wallet, {
            [styles.selected]: index === walletIndex,
          })}
          onClick={() => dispatch(changeWalletIndex(index))}
        >
          <Icon {...size} />
        </div>
      ))}
    </div>
  );
};
export default WalletCarousel;
