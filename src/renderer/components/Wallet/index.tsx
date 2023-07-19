import React, { useMemo } from 'react';
import clsx from 'clsx';
import { Dropdown, Menu } from 'antd';
import { RiAddFill, RiMoneyCnyCircleLine } from 'react-icons/ri';
import Eye from '@/components/Eye';
import CustomDrawer from '@/components/CustomDrawer';
import { useHeaderContext } from '@/components/Header';
import { changeCurrentWalletCodeAction, toggleEyeStatusAction } from '@/store/features/wallet';
import { useAppDispatch, useAppSelector, useDrawer } from '@/utils/hooks';
import { walletIcons } from '@/helpers/wallet';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';
import { useMemoizedFn } from 'ahooks';

const AddWalletContent = React.lazy(() => import('@/components/Wallet/AddWalletContent'));

export interface WalletProps {}

const Wallet: React.FC<WalletProps> = () => {
  const dispatch = useAppDispatch();
  const { miniMode } = useHeaderContext();

  const updateTime = useAppSelector((state) => state.wallet.currentWallet.updateTime);
  const eyeStatus = useAppSelector((state) => state.wallet.eyeStatus);
  const wallets = useAppSelector((state) => state.wallet.wallets);
  const walletConfig = useAppSelector((state) => state.wallet.config.walletConfig);
  const currentWalletCode = useAppSelector((state) => state.wallet.currentWalletCode);
  const walletConfigCodeMap = useAppSelector((state) => state.wallet.config.codeMap);
  const currentWalletConfig = walletConfigCodeMap[currentWalletCode];

  const calcResult = useMemo(() => {
    const { zje, sygz, gssyl, ...reset } = Helpers.Wallet.CalcWallet({
      code: currentWalletCode,
      walletConfig,
      wallets,
    });
    const displayZje = eyeStatus ? zje.toFixed(2) : Utils.Encrypt(zje.toFixed(2));
    const displaySygz = eyeStatus ? Utils.Yang(sygz.toFixed(2)) : Utils.Encrypt(Utils.Yang(sygz.toFixed(2)));
    const displayGssyl = eyeStatus ? Utils.Yang(gssyl.toFixed(2)) : Utils.Encrypt(Utils.Yang(gssyl.toFixed(2)));
    return {
      displayZje,
      displaySygz,
      displayGssyl,
      ...reset,
    };
  }, [wallets, eyeStatus, walletConfig, currentWalletCode]);

  const walletMenuItems = useMemo(
    () =>
      walletConfig
        .map((config) => ({
          key: config.code,
          label: config.name,
          icon: <img className={styles.menuIcon} src={walletIcons[config.iconIndex || 0]} />,
        }))
        .concat({
          key: '',
          label: '添加',
          icon: <RiAddFill className={styles.addIcon} />,
        }),
    [walletConfig]
  );

  const { show: showAddWalletDrawer, open: openAddWalletDrawer, close: closeAddWalletDrawer } = useDrawer('');

  const onSelectWallet = useMemoizedFn((code: string) => {
    dispatch(changeCurrentWalletCodeAction(code));
  });

  const onToggleEye = useMemoizedFn(() => dispatch(toggleEyeStatusAction()));

  return (
    <div className={clsx(styles.content, { [styles.miniMode]: miniMode })}>
      <div className={styles.topBar}>
        <Dropdown
          placement="bottomRight"
          dropdownRender={() => (
            <Menu
              selectedKeys={[currentWalletCode]}
              items={walletMenuItems}
              onClick={({ key }) => {
                if (key) {
                  onSelectWallet(key);
                } else {
                  openAddWalletDrawer();
                }
              }}
            />
          )}
        >
          <div className={styles.walletIcon}>
            <img src={walletIcons[currentWalletConfig.iconIndex || 0]} />
          </div>
        </Dropdown>
        <div className={styles.timeBar}>刷新时间：{updateTime || '还没有刷新过哦~'}</div>
        <Eye classNames={styles.eye} status={eyeStatus} onClick={onToggleEye} />
      </div>
      <div className={styles.numBar}>
        <div className={clsx(styles.sygz, styles.zsygz, Utils.GetValueColor(calcResult.displaySygz).textClass)}>
          ¥ {Utils.Yang(calcResult.displaySygz)}
        </div>
        <div className={styles.numIndex}>
          <div>
            {!miniMode && <label>今日收益率</label>}
            <div className={clsx(Utils.GetValueColor(calcResult.displayGssyl).textClass)}>
              {calcResult.displayGssyl}%
            </div>
          </div>
          <div>
            {!miniMode && <label>持有金额</label>}
            <div>{calcResult.displayZje}</div>
          </div>
        </div>
      </div>
      <CustomDrawer show={showAddWalletDrawer}>
        <AddWalletContent onClose={closeAddWalletDrawer} onEnter={closeAddWalletDrawer} />
      </CustomDrawer>
    </div>
  );
};

export default Wallet;
