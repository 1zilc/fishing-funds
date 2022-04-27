import React, { useMemo } from 'react';
import clsx from 'clsx';
import { Dropdown, Menu } from 'antd';

import ConsumptionIcon from '@/static/icon/consumption.svg';
import Eye from '@/components/Eye';
import { useHeaderContext } from '@/components/Header';
import { selectWalletAction, toggleEyeStatusAction } from '@/store/features/wallet';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { walletIcons } from '@/helpers/wallet';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

export interface WalletProps {}

const Wallet: React.FC<WalletProps> = () => {
  const dispatch = useAppDispatch();
  const { miniMode } = useHeaderContext();
  const eyeStatus = useAppSelector((state) => state.wallet.eyeStatus);
  const fundConfigCodeMap = useAppSelector((state) => state.wallet.fundConfigCodeMap);
  const { walletConfig } = useAppSelector((state) => state.wallet.config);
  const currentWalletCode = useAppSelector((state) => state.wallet.currentWalletCode);
  const { funds, updateTime } = useAppSelector((state) => state.wallet.currentWallet);
  const walletConfigCodeMap = useAppSelector((state) => state.wallet.config.codeMap);
  const currentWalletConfig = walletConfigCodeMap[currentWalletCode];

  const { displayZje, displaySygz } = useMemo(() => {
    const { zje, sygz } = Helpers.Fund.CalcFunds(funds, fundConfigCodeMap);
    const eyeOpen = eyeStatus === Enums.EyeStatus.Open;
    const displayZje = eyeOpen ? zje.toFixed(2) : Utils.Encrypt(zje.toFixed(2));
    const displaySygz = eyeOpen ? Utils.Yang(sygz.toFixed(2)) : Utils.Encrypt(Utils.Yang(sygz.toFixed(2)));
    return {
      displayZje,
      displaySygz,
    };
  }, [funds, eyeStatus, fundConfigCodeMap]);

  const walletMenuItems = useMemo(
    () =>
      walletConfig.map((config) => ({
        key: config.code,
        label: config.name,
        icon: <img className={styles.menuIcon} src={walletIcons[config.iconIndex] || 0} />,
      })),
    [walletConfig]
  );

  return (
    <div className={clsx(styles.content, { [styles.miniMode]: miniMode })}>
      <Dropdown
        placement="bottomRight"
        overlay={
          <Menu selectedKeys={[currentWalletCode]} items={walletMenuItems} onClick={({ key }) => dispatch(selectWalletAction(key))} />
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
