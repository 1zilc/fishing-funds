import React from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import StandCard from '@/components/Card/StandCard';
import RemoveIcon from '@/static/icon/remove.svg';
import CheckboxIcon from '@/static/icon/checkbox.svg';
import EditIcon from '@/static/icon/edit.svg';
import { deleteWalletConfigAction } from '@/actions/wallet';
import { walletIcons } from '@/helpers/wallet';
import { StoreState } from '@/reducers/types';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

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
  const dispatch = useDispatch();
  const wallets = useSelector((state: StoreState) => state.wallet.wallets);
  const { walletConfig } = useSelector((state: StoreState) => state.wallet.config);
  const eyeStatus = useSelector((state: StoreState) => state.wallet.eyeStatus);

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
    updateTime: '还没有刷新过哦~',
  };
  const { funds, updateTime } = walletState;

  const { zje, sygz, gssyl, cysy, cysyl } = Helpers.Fund.CalcFunds(funds, wallet.code);
  const eyeOpen = eyeStatus === Enums.EyeStatus.Open;
  const displayZje = eyeOpen ? zje.toFixed(2) : Utils.Encrypt(zje.toFixed(2));
  const displaySygz = eyeOpen ? Utils.Yang(sygz.toFixed(2)) : Utils.Encrypt(Utils.Yang(sygz.toFixed(2)));
  const displayGssyl = eyeOpen ? gssyl.toFixed(2) : Utils.Encrypt(gssyl.toFixed(2));
  const displayCysy = eyeOpen ? cysy.toFixed(2) : Utils.Encrypt(cysy.toFixed(2));
  const displayCysyl = eyeOpen ? cysyl.toFixed(2) : Utils.Encrypt(cysyl.toFixed(2));

  return (
    <StandCard
      icon={
        <img
          className={classnames(styles.icon, {
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
            <EditIcon
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
      className={classnames({
        selected,
        hoverable: !readonly,
      })}
      onClick={() => !readonly && props.onClick && props.onClick(wallet)}
      onDoubleClick={() => !readonly && props.onDoubleClick && props.onDoubleClick(wallet)}
    >
      <div className={classnames(styles.row, { [styles.readonly]: readonly }, 'card-body')}>
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
              {eyeOpen ? '￥' : ''}
              {displayZje}
            </div>
          </div>
          <div className={styles.infoRow}>
            <div>收益(今)：{displaySygz}</div>
            <div>
              收益率(今)： {displayGssyl}
              {eyeOpen ? '%' : ''}
            </div>
          </div>
          <div className={styles.infoRow}>
            <div>持有收益：{displayCysy}</div>
            <div>
              持有收益率： {displayCysyl}
              {eyeOpen ? '%' : ''}
            </div>
          </div>
        </div>
        {!readonly && selected && <CheckboxIcon className={styles.checkbox} />}
        {!readonly && !selected && (
          <RemoveIcon
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
