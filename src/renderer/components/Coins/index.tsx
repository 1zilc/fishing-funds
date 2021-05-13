import React, { useMemo } from 'react';
import { ReactComponent as CoinIcon } from '../../assets/icons/coin.svg';
import styles from './index.scss';

export interface CoinsProps {
  num: number;
}

export const Coins = ({ num = 1 }) => {
  const memoCoins = useMemo(
    () =>
      new Array(num).fill('').map(() => {
        return {
          top: `${(Math.random() * 30 + 60).toFixed(0)}%`,
          left: `${(Math.random() * 90 + 0).toFixed(0)}%`,
          transform: `rotateY(${Math.random() > 0.5 ? 180 : 0}deg)`,
        };
      }),
    []
  );

  return (
    <>
      {memoCoins.map(({ top, left, transform }, index) => {
        return (
          <CoinIcon
            key={index}
            className={styles.coin}
            style={{ top, left, transform }}
          />
        );
      })}
    </>
  );
};
export default Coins;
