import React from 'react';
import classnames from 'classnames';
import { walletIcons } from '@/helpers/wallet';
import styles from './index.scss';

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
      {walletIcons.map((iconUrl, index) => (
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
          <img src={iconUrl} {...size} />
        </div>
      ))}
    </div>
  );
};
export default WalletSelection;
