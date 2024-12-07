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
    const { zje, sygz, gssyl, cysy, cysyl, ...reset } = Helpers.Wallet.CalcWallet({
      code: currentWalletCode,
      walletConfig,
      wallets,
    });
    const displayZje = eyeStatus ? zje.toFixed(2) : Utils.Encrypt(zje.toFixed(2));
    const displaySygz = eyeStatus ? sygz.toFixed(2) : Utils.Encrypt(Utils.Yang(sygz.toFixed(2)));
    const displayGssyl = eyeStatus ? gssyl.toFixed(2) : Utils.Encrypt(Utils.Yang(gssyl.toFixed(2)));
    const displayCysy = eyeStatus ? cysy.toFixed(2) : Utils.Encrypt(Utils.Yang(cysy.toFixed(2)));
    const displayCysyl = eyeStatus ? cysyl.toFixed(2) : Utils.Encrypt(Utils.Yang(cysyl.toFixed(2)));

    return {
      displayZje,
      displaySygz,
      displayGssyl,
      displayCysy,
      displayCysyl,
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
            <img src={walletIcons[currentWalletConfig?.iconIndex || 0]} />
          </div>
        </Dropdown>
        <div className={styles.slogan}>
          <div className={styles.timeBar}>刷新时间：{updateTime || '还没有刷新过哦~'}</div>
          {eyeStatus && !miniMode && Number(calcResult.displayCysy) > 0 && (
            <div className={styles.pal}>
              已经盈利：
              <div className={clsx(Utils.GetValueColor(calcResult.displayCysy).textClass)}>{`${calcResult.displayCysyl}% `}</div>
            </div>
          )}
          {eyeStatus && !miniMode && Number(calcResult.displayCysy) < 0 && (
            <div className={styles.pal}>
              已经亏损：
              <div className={clsx(Utils.GetValueColor(calcResult.displayCysy).textClass)}>{`${calcResult.displayCysyl}% `}</div>
            </div>
          )}
        </div>
        <Eye classNames={styles.eye} status={eyeStatus} onClick={onToggleEye} />
      </div>
      <Dropdown
        placement="bottom"
        dropdownRender={() => (
          <div className={styles.detailBar}>
            <div>
              <div className={styles.sygz}>
                <div className={styles.tag}>基金:</div>
                <div className={clsx(Utils.GetValueColor(calcResult.calcFundResult.sygz).textClass)}>
                  {Utils.Yang(calcResult.calcFundResult.sygz.toFixed(2))}
                </div>
              </div>
              <div className={styles.numIndex}>
                <div className={clsx(Utils.GetValueColor(calcResult.calcFundResult.gssyl).textClass)}>
                  {calcResult.calcFundResult.gssyl.toFixed(2)}%
                </div>
                <div>{calcResult.calcFundResult.zje.toFixed(2)}</div>
              </div>
            </div>
            <div>
              <div className={styles.sygz}>
                <div className={styles.tag}>股票:</div>
                <div className={clsx(Utils.GetValueColor(calcResult.calcStockResult.sygz).textClass)}>
                  {Utils.Yang(calcResult.calcStockResult.sygz.toFixed(2))}
                </div>
              </div>
              <div className={styles.numIndex}>
                <div className={clsx(Utils.GetValueColor(calcResult.calcStockResult.gssyl).textClass)}>
                  {calcResult.calcStockResult.gssyl.toFixed(2)}%
                </div>
                <div>{calcResult.calcStockResult.zje.toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}
      >
        <div className={styles.numBar}>
          <div className={clsx(styles.sygz, styles.zsygz, Utils.GetValueColor(calcResult.displaySygz).textClass)}>
            {eyeStatus ? `¥ ${Utils.Yang(calcResult.displaySygz)}` : calcResult.displaySygz}
          </div>
          <div className={styles.numIndex}>
            <div>
              {!miniMode && <label>今日收益率</label>}
              <div className={clsx(Utils.GetValueColor(calcResult.displayGssyl).textClass)}>
                {eyeStatus ? `${Utils.Yang(calcResult.displayGssyl)}%` : calcResult.displayGssyl}
              </div>
            </div>
            <div>
              {!miniMode && <label>持有金额</label>}
              <div>{calcResult.displayZje}</div>
            </div>
          </div>
        </div>
      </Dropdown>

      <CustomDrawer show={showAddWalletDrawer}>
        <AddWalletContent onClose={closeAddWalletDrawer} onEnter={closeAddWalletDrawer} />
      </CustomDrawer>
    </div>
  );
};

export default Wallet;
