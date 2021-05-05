import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { useBoolean } from 'ahooks';
import { useSelector, useDispatch } from 'react-redux';
import { ReactSortable } from 'react-sortablejs';
import { remote } from 'electron';

import { ReactComponent as AddIcon } from '@/assets/icons/add.svg';
import { ReactComponent as RemoveIcon } from '@/assets/icons/remove.svg';
import { ReactComponent as CheckboxIcon } from '@/assets/icons/checkbox.svg';
import { ReactComponent as EditIcon } from '@/assets/icons/edit.svg';
import Empty from '@/components/Empty';
import CustomDrawer from '@/components/CustomDrawer';
import AddWalletContent from '@/components/Wallet/AddWalletContent';
import EditWalletContent from '@/components/Wallet/EditWalletContent';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import { StoreState } from '@/reducers/types';
import {
  deleteWallet,
  getWalletConfig,
  setWalletConfig,
  defaultWallet,
  selectWallet,
} from '@/actions/wallet';
import * as Utils from '@/utils';
import * as CONST from '@/constants';

import styles from './index.scss';
import classNames from 'classnames';

export interface ManageWalletContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const WalletIcons = new Array(25)
  .fill('')
  .map((_, index) => require(`@/assets/icons/wallet/${index}.svg`).default);

const { dialog } = remote;

const ManageWalletContent: React.FC<ManageWalletContentProps> = (props) => {
  const dispatch = useDispatch();
  const currentWalletCode = useSelector(
    (state: StoreState) => state.wallet.currentWalletCode
  );
  const [sortWalletConfig, setSortWalletConfig] = useState<
    (Wallet.SettingItem & Wallet.SortRow)[]
  >([]);
  const [editWallet, setEditWallet] = useState<Wallet.SettingItem>({
    name: '',
    code: '',
    iconIndex: 0,
    funds: [],
  });
  const [selectedCode, setSelectedCode] = useState(currentWalletCode);

  const [
    showAddWalletDrawer,
    {
      setTrue: openAddWalletDrawer,
      setFalse: closeAddWalletDrawer,
      toggle: ToggleAddWalletDrawer,
    },
  ] = useBoolean(false);

  const [
    showEditWalletDrawer,
    {
      setTrue: openEditWalletDrawer,
      setFalse: closeEditWalletDrawer,
      toggle: toggleEditWalletDrawer,
    },
  ] = useBoolean(false);

  const onRemoveWallet = async (wallet: Wallet.SettingItem) => {
    const { walletConfig } = getWalletConfig();
    if (walletConfig.length === 1) {
      dialog.showMessageBox({
        title: '删除失败',
        type: 'error',
        message: `只剩最后一个钱包了～`,
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
      deleteWallet(wallet.code);
      updateSortWalletConfig();
    }
  };

  const onSelectWallet = async (wallet: Wallet.SettingItem) => {
    const { code } = wallet;
    setSelectedCode(code);
    onSave();
  };

  const updateSortWalletConfig = () => {
    const { walletConfig } = getWalletConfig();
    setSortWalletConfig(walletConfig.map((_) => ({ ..._, id: _.code })));
  };

  const onSortWalletConfig = (sortList: Wallet.SettingItem[]) => {
    const { codeMap } = getWalletConfig();
    const walletConfig = sortList.map((item) => codeMap[item.code]);
    setWalletConfig(walletConfig);
    updateSortWalletConfig();
  };

  const onSave = () => {
    dispatch(selectWallet(selectedCode));
    props.onEnter();
  };

  useEffect(updateSortWalletConfig, []);

  console.log(selectedCode, currentWalletCode);

  return (
    <CustomDrawerContent
      title="管理钱包"
      enterText="确定"
      onEnter={onSave}
      onClose={props.onClose}
    >
      <div className={styles.content}>
        {sortWalletConfig.length ? (
          <ReactSortable
            animation={200}
            delay={2}
            list={sortWalletConfig}
            setList={onSortWalletConfig}
            swap
          >
            {sortWalletConfig.map((wallet) => (
              <div
                key={wallet.code}
                className={classnames(styles.row, {
                  [styles.selected]: selectedCode === wallet.code,
                })}
                onClick={() => setSelectedCode(wallet.code)}
                onDoubleClick={() => onSelectWallet(wallet)}
              >
                <img
                  className={styles.rowBg}
                  src={WalletIcons[wallet.iconIndex]}
                  draggable={false}
                />
                <div className={styles.cover}></div>
                <img
                  className={styles.icon}
                  src={WalletIcons[wallet.iconIndex]}
                  draggable={false}
                />
                <div className={styles.rowInfo}>
                  <div className={styles.time}>更新时间：2020-12-12 12:31</div>
                  <div className={styles.name}>
                    {wallet.name}
                    <EditIcon
                      className={styles.editor}
                      onClick={(e) => {
                        setEditWallet(wallet);
                        openEditWalletDrawer();
                        e.stopPropagation();
                      }}
                    />
                  </div>
                  <div>收益估值：+20</div>
                  <div>持有金额：20000</div>
                </div>
                {selectedCode === wallet.code ? (
                  <CheckboxIcon className={styles.checkbox} />
                ) : (
                  <RemoveIcon
                    className={styles.remove}
                    onClick={(e) => {
                      onRemoveWallet(wallet);
                      e.stopPropagation();
                    }}
                  />
                )}
              </div>
            ))}
          </ReactSortable>
        ) : (
          <Empty text="暂无钱包..." />
        )}
      </div>
      <div
        className={styles.add}
        onClick={(e) => {
          openAddWalletDrawer();
          e.stopPropagation();
        }}
      >
        <AddIcon />
      </div>
      <CustomDrawer show={showAddWalletDrawer}>
        <AddWalletContent
          onClose={closeAddWalletDrawer}
          onEnter={() => {
            updateSortWalletConfig();
            closeAddWalletDrawer();
          }}
        />
      </CustomDrawer>
      <CustomDrawer show={showEditWalletDrawer}>
        <EditWalletContent
          onClose={closeEditWalletDrawer}
          onEnter={() => {
            updateSortWalletConfig();
            closeEditWalletDrawer();
          }}
          wallet={editWallet}
        />
      </CustomDrawer>
    </CustomDrawerContent>
  );
};

export default ManageWalletContent;
