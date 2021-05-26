import React from 'react';
import classnames from 'classnames';
import styles from './index.scss';

const wallets = new Array(40).fill('').map((_, index) => {
  const { ReactComponent } = require(`@/assets/icons/wallet/${index}.svg`);
  return ReactComponent;
});

const size = {
  width: 24,
  height: 24,
};

export interface WalletSelectionProps {
  index: number;
  onChange?: (index: number) => void;
}

export const WalletSelection: React.FC<WalletSelectionProps> = (props) => {
  const { index: walletIndex } = props;
  return (
    <div className={styles.content}>
      {wallets.map((Icon, index) => (
        <div
          key={index}
          className={classnames(
            styles.wallet,
            {
              [styles.selected]: index === walletIndex,
              selected: index === walletIndex,
            },
            'hoverable'
          )}
          onClick={() => props.onChange && props.onChange(index)}
        >
          <Icon {...size} />
        </div>
      ))}
    </div>
  );
};
export default WalletSelection;
