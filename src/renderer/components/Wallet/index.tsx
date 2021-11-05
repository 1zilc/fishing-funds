import React, { useMemo } from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Menu } from 'antd';

import { ReactComponent as ConsumptionIcon } from '@/static/icon/consumption.svg';
import Eye from '@/components/Eye';
import { useHeaderContext } from '@/components/Header';
import { StoreState } from '@/reducers/types';
import { selectWalletAction, toggleEyeStatusAction } from '@/actions/wallet';
import { useCurrentWallet, useFreshFunds } from '@/utils/hooks';
import { walletIcons } from '@/helpers/wallet';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

export interface WalletProps {}

const Wallet: React.FC<WalletProps> = () => {
  const dispatch = useDispatch();
  const { miniMode } = useHeaderContext();
  const eyeStatus = useSelector((state: StoreState) => state.wallet.eyeStatus);
  const currentWalletCode = useSelector((state: StoreState) => state.wallet.currentWalletCode);
  const { walletConfig } = useSelector((state: StoreState) => state.wallet.config);
  const { currentWalletConfig, currentWalletState } = useCurrentWallet();
  const freshFunds = useFreshFunds(CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY);

  const { funds, updateTime } = currentWalletState;

  const { displayZje, displaySygz } = useMemo(() => {
    const { zje, sygz } = Helpers.Fund.CalcFunds(funds, currentWalletCode);
    const eyeOpen = eyeStatus === Enums.EyeStatus.Open;
    const displayZje = eyeOpen ? zje.toFixed(2) : Utils.Encrypt(zje.toFixed(2));
    const displaySygz = eyeOpen ? Utils.Yang(sygz.toFixed(2)) : Utils.Encrypt(Utils.Yang(sygz.toFixed(2)));
    return {
      displayZje,
      displaySygz,
    };
  }, [funds, eyeStatus, currentWalletCode]);

  async function onSelectWallet(wallet: Wallet.SettingItem) {
    const { code } = wallet;
    dispatch(selectWalletAction(code));
    freshFunds();
  }

  return (
    <div className={classnames(styles.content, { [styles.miniMode]: miniMode })}>
      <Dropdown
        placement="bottomRight"
        overlay={
          <Menu selectedKeys={[currentWalletCode]}>
            {walletConfig.map((wallet) => (
              <Menu.Item key={wallet.code} onClick={() => onSelectWallet(wallet)}>
                {wallet.name}
              </Menu.Item>
            ))}
          </Menu>
        }
      >
        <div className={styles.walletIcon}>
          <img src={walletIcons[currentWalletConfig.iconIndex || 0]} />
        </div>
      </Dropdown>
      <div className={styles.info}>
        <div className={styles.timeBar}>
          <div className={styles.last}>刷新时间：{updateTime || '还没有刷新过哦~'}</div>
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
      <Eye classNames={styles.eye} status={eyeStatus === Enums.EyeStatus.Open} onClick={() => dispatch(toggleEyeStatusAction())} />
    </div>
  );
};

export default Wallet;
