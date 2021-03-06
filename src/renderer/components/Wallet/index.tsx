import React, { useMemo } from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Menu } from 'antd';

import { ReactComponent as ConsumptionIcon } from '@/assets/icons/consumption.svg';
import Eye from '@/components/Eye';
import { useHeaderContext } from '@/components/Header';
import { StoreState } from '@/reducers/types';
import { selectWallet, toggleEyeStatus } from '@/actions/wallet';
import { calcFunds } from '@/actions/fund';
import { useCurrentWallet, useFreshFunds } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import styles from './index.scss';

export interface WalletProps {}

const Wallet: React.FC<WalletProps> = () => {
  const dispatch = useDispatch();
  const { miniMode } = useHeaderContext();
  const eyeStatus = useSelector((state: StoreState) => state.wallet.eyeStatus);
  const wallets = useSelector((state: StoreState) => state.wallet.wallets);
  const currentWalletCode = useSelector(
    (state: StoreState) => state.wallet.currentWalletCode
  );
  const { currentWallet, currentWalletState } = useCurrentWallet();
  const freshFunds = useFreshFunds(CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY);
  const WalletIcon = useMemo(() => {
    const { ReactComponent } = require(`@/assets/icons/wallet/${
      currentWallet.iconIndex || 0
    }.svg`);
    return ReactComponent;
  }, [currentWallet]);

  const { funds, updateTime } = currentWalletState;

  const { displayZje, displaySygz } = useMemo(() => {
    const { zje, sygz } = calcFunds(funds);
    const eyeOpen = eyeStatus === Enums.EyeStatus.Open;
    const displayZje = eyeOpen ? zje.toFixed(2) : Utils.Encrypt(zje.toFixed(2));
    const displaySygz = eyeOpen
      ? Utils.Yang(sygz.toFixed(2))
      : Utils.Encrypt(Utils.Yang(sygz.toFixed(2)));
    return {
      displayZje,
      displaySygz,
    };
  }, [funds, eyeStatus]);

  async function onSelectWallet(wallet: Wallet.SettingItem) {
    const { code } = wallet;
    dispatch(selectWallet(code));
    freshFunds();
  }

  return (
    <div
      className={classnames(styles.content, { [styles.miniMode]: miniMode })}
    >
      <Dropdown
        placement="bottomRight"
        overlay={
          <Menu selectedKeys={[currentWalletCode]}>
            {wallets.map((wallet) => (
              <Menu.Item
                key={wallet.code}
                onClick={() => onSelectWallet(wallet)}
              >
                {wallet.name}
              </Menu.Item>
            ))}
          </Menu>
        }
      >
        <WalletIcon className={styles.walletIcon} />
      </Dropdown>
      <div className={styles.info}>
        <div className={styles.timeBar}>
          <div className={styles.last}>
            刷新时间：{updateTime || '还没有刷新过哦~'}
          </div>
        </div>
        <div className={styles.moneyBar}>
          <div>
            <ConsumptionIcon />
            <span>持有金额：</span>
            <span>{displayZje}</span>
          </div>
          <i />
          <div>
            <ConsumptionIcon />
            <span>收益估值：</span>
            <span>{displaySygz}</span>
          </div>
        </div>
      </div>
      <Eye
        classNames={styles.eye}
        status={eyeStatus === Enums.EyeStatus.Open}
        onClick={() => dispatch(toggleEyeStatus())}
      />
    </div>
  );
};

export default Wallet;
