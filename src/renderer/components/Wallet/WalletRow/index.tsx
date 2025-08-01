import React from 'react';
import clsx from 'clsx';
import { RiIndeterminateCircleFill, RiEditFill, RiCheckboxCircleFill } from 'react-icons/ri';
import StandCard from '@/components/Card/StandCard';
import { deleteWalletConfigAction } from '@/store/features/wallet';
import { walletIcons } from '@/helpers/wallet';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';
import styles from './index.module.css';

export interface WalletRowProps {
  wallet: Wallet.SettingItem;
  readonly?: boolean;
  selected?: boolean;
  onClick?: (wallet: Wallet.SettingItem) => void;
  onDoubleClick?: (wallet: Wallet.SettingItem) => void;
  onEdit?: (wallet: Wallet.SettingItem) => void;
  onDelete?: (wallet: Wallet.SettingItem) => void;
}

const { dialog } = window.contextModules.electron;

const WalletRow: React.FC<WalletRowProps> = (props) => {
  const { wallet, selected, readonly } = props;
  const dispatch = useAppDispatch();
  const wallets = useAppSelector((state) => state.wallet.wallets);
  const { walletConfig } = useAppSelector((state) => state.wallet.config);
  const eyeStatus = useAppSelector((state) => state.wallet.eyeStatus);
  const walletsConfig = useAppSelector((state) => state.wallet.config.walletConfig);

  const onRemoveClick = async (wallet: Wallet.SettingItem) => {
    if (walletConfig.length === 1) {
      dialog.showMessageBox({
        title: '删除失败',
        type: 'error',
        message: `只剩最后一个钱包了~`,
        buttons: ['确定'],
      });
      return;
    }
    const { response } = await dialog.showMessageBox({
      title: '删除钱包',
      type: 'info',
      message: `确认删除 ${wallet.name || ''}`,
      buttons: ['确定', '取消'],
    });
    if (response === 0) {
      dispatch(deleteWalletConfigAction(wallet.code));
    }
  };

  const onEditClick = () => {
    if (props.onEdit) {
      props.onEdit(wallet);
    }
  };

  const walletState: Wallet.StateItem = wallets.find(({ code }) => code === wallet.code) || {
    code: wallet.code,
    funds: [],
    stocks: [],
    updateTime: '还没有刷新过哦~',
  };
  const { funds, updateTime } = walletState;
  const { codeMap } = Helpers.Fund.GetFundConfig(wallet.code, walletsConfig);
  const { zje, sygz, gssyl, cysy, cysyl } = Helpers.Fund.CalcFunds(funds, codeMap);
  const displayZje = eyeStatus ? zje.toFixed(2) : Utils.Encrypt(zje.toFixed(2));
  const displaySygz = eyeStatus ? Utils.Yang(sygz.toFixed(2)) : Utils.Encrypt(Utils.Yang(sygz.toFixed(2)));
  const displayGssyl = eyeStatus ? gssyl.toFixed(2) : Utils.Encrypt(gssyl.toFixed(2));
  const displayCysy = eyeStatus ? cysy.toFixed(2) : Utils.Encrypt(cysy.toFixed(2));
  const displayCysyl = eyeStatus ? cysyl.toFixed(2) : Utils.Encrypt(cysyl.toFixed(2));

  return (
    <StandCard
      icon={
        <img
          className={clsx(styles.icon, {
            [styles.readonly]: readonly,
          })}
          src={walletIcons[wallet.iconIndex]}
          draggable={false}
          onClick={(e) => {
            if (!readonly) {
              onEditClick();
              e.stopPropagation();
            }
          }}
        />
      }
      title={wallet.name}
      extra={
        <div className={styles.extra}>
          {readonly ? (
            <i />
          ) : (
            <RiEditFill
              className={styles.editor}
              onClick={(e) => {
                onEditClick();
                e.stopPropagation();
              }}
            />
          )}
          <div className={styles.time}>{updateTime}</div>
        </div>
      }
      className={clsx({
        selected,
        hoverable: !readonly,
      })}
      onClick={() => !readonly && props.onClick && props.onClick(wallet)}
      onDoubleClick={() => !readonly && props.onDoubleClick && props.onDoubleClick(wallet)}
    >
      <div className={clsx(styles.row, { [styles.readonly]: readonly }, 'card-body')}>
        <div className={styles.rowInfo}>
          <div style={{ textAlign: 'center' }}>
            <div>持有金额</div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 500,
                lineHeight: '24px',
                marginBottom: 10,
              }}
            >
              {eyeStatus ? '￥' : ''}
              {displayZje}
            </div>
          </div>
          <div className={styles.infoRow}>
            <div>收益(今)：{displaySygz}</div>
            <div>
              收益率(今)： {displayGssyl}
              {eyeStatus ? '%' : ''}
            </div>
          </div>
          <div className={styles.infoRow}>
            <div>持有收益：{displayCysy}</div>
            <div>
              持有收益率： {displayCysyl}
              {eyeStatus ? '%' : ''}
            </div>
          </div>
        </div>
        {!readonly && selected && <RiCheckboxCircleFill className={styles.checkbox} />}
        {!readonly && !selected && (
          <RiIndeterminateCircleFill
            className={styles.remove}
            onClick={(e) => {
              onRemoveClick(wallet);
              e.stopPropagation();
            }}
          />
        )}
      </div>
    </StandCard>
  );
};

export default WalletRow;
