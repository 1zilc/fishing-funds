import React from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import StandCard from '@/components/Card/StandCard';
import { ReactComponent as RemoveIcon } from '@/assets/icons/remove.svg';
import { ReactComponent as CheckboxIcon } from '@/assets/icons/checkbox.svg';
import { ReactComponent as EditIcon } from '@/assets/icons/edit.svg';
import { deleteWallet, getWalletConfig } from '@/actions/wallet';
import { calcFunds } from '@/actions/fund';
import { StoreState } from '@/reducers/types';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';
import styles from './index.scss';

export interface WalletRowProps {
  wallet: Wallet.SettingItem;
  readonly?: boolean;
  selected?: boolean;
  onClick?: (wallet: Wallet.SettingItem) => void;
  onDoubleClick?: (wallet: Wallet.SettingItem) => void;
  onEdit?: (wallet: Wallet.SettingItem) => void;
  onDelete?: (wallet: Wallet.SettingItem) => void;
}

const WalletIcons = new Array(40)
  .fill('')
  .map((_, index) => require(`@/assets/icons/wallet/${index}.svg`).default);

const { dialog } = window.contextModules.electron;

const WalletRow: React.FC<WalletRowProps> = (props) => {
  const { wallet, selected, readonly } = props;
  const dispatch = useDispatch();
  const walletsMap = useSelector(
    (state: StoreState) => state.wallet.walletsMap
  );
  const eyeStatus = useSelector((state: StoreState) => state.wallet.eyeStatus);

  const onRemoveClick = async (wallet: Wallet.SettingItem) => {
    const { walletConfig } = getWalletConfig();
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
      dispatch(deleteWallet(wallet.code));
    }
  };

  const onEditClick = () => {
    props.onEdit && props.onEdit(wallet);
  };

  const walletState: Wallet.StateItem = walletsMap[wallet.code] || {
    funds: [],
    updateTime: '还没有刷新过哦~',
  };
  const { funds, updateTime } = walletState;

  const { zje, sygz, gssyl } = calcFunds(funds, wallet.code);
  const eyeOpen = eyeStatus === Enums.EyeStatus.Open;
  const display_zje = eyeOpen ? zje.toFixed(2) : Utils.Encrypt(zje.toFixed(2));
  const display_sygz = eyeOpen
    ? Utils.Yang(sygz.toFixed(2))
    : Utils.Encrypt(Utils.Yang(sygz.toFixed(2)));
  const display_gssyl = eyeOpen
    ? gssyl.toFixed(2)
    : Utils.Encrypt(gssyl.toFixed(2));

  return (
    <StandCard
      icon={
        <img
          className={classnames(styles.icon, {
            [styles.readonly]: readonly,
          })}
          src={WalletIcons[wallet.iconIndex]}
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
            <i></i>
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
        selected: selected,
        hoverable: !readonly,
      })}
      onClick={() => !readonly && props.onClick && props.onClick(wallet)}
      onDoubleClick={() =>
        !readonly && props.onDoubleClick && props.onDoubleClick(wallet)
      }
    >
      <div
        className={classnames(
          styles.row,
          { [styles.readonly]: readonly },
          'card-body'
        )}
      >
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
              {display_zje}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-around',
              textAlign: 'center',
            }}
          >
            <div>收益：{display_sygz}</div>
            <div>
              收益率： {display_gssyl}
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
