import React from 'react';
import classnames from 'classnames';
import styles from './index.scss';

const wallets = new Array(25).fill('').map((_, index) => {
  const { ReactComponent } = require(`@/assets/icons/wallet/${index}.svg`);
  return ReactComponent;
});

const size = {
  width: 24,
  height: 24,
};

export interface WalletCarouselProps {
  index: number;
  onChange?: (index: number) => void;
}

export const WalletCarousel: React.FC<WalletCarouselProps> = (props) => {
  const { index: walletIndex } = props;
  return (
    <div className={styles.content}>
      {wallets.map((Icon, index) => (
        <div
          key={index}
          className={classnames(styles.wallet, {
            [styles.selected]: index === walletIndex,
          })}
          onClick={() => props.onChange && props.onChange(index)}
        >
          <Icon {...size} />
        </div>
      ))}
    </div>
  );
};
export default WalletCarousel;
