import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ReactSortable } from 'react-sortablejs';

import AddIcon from '@/static/icon/add.svg';
import Empty from '@/components/Empty';
import CustomDrawer from '@/components/CustomDrawer';
import AddWalletContent from '@/components/Wallet/AddWalletContent';
import WalletRow from '@/components/Wallet/WalletRow';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import EditWalletContent from '@/components/Wallet/EditWalletContent';
import { StoreState } from '@/reducers/types';
import { useDrawer, useAutoDestroySortableRef } from '@/utils/hooks';
import { setWalletConfigAction, selectWalletAction } from '@/actions/wallet';
import styles from './index.module.scss';

export interface ManageWalletContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const ManageWalletContent: React.FC<ManageWalletContentProps> = (props) => {
  const dispatch = useDispatch();
  const sortableRef = useAutoDestroySortableRef();
  const currentWalletCode = useSelector((state: StoreState) => state.wallet.currentWalletCode);
  const { codeMap, walletConfig } = useSelector((state: StoreState) => state.wallet.config);
  const { show: showAddDrawer, set: setAddDrawer, close: closeAddDrawer } = useDrawer(null);
  const sortWalletConfig = useMemo(() => walletConfig.map((_) => ({ ..._, id: _.code })), [walletConfig]);

  const {
    data: editWalletData,
    show: showEditDrawer,
    set: setEditDrawer,
    close: closeEditDrawer,
  } = useDrawer<Wallet.SettingItem>({
    name: '',
    iconIndex: 0,
    code: '',
    funds: [],
  });

  async function onSelectWallet(wallet: Wallet.SettingItem) {
    const { code } = wallet;
    dispatch(selectWalletAction(code));
  }

  function onSortWalletConfig(sortList: Wallet.SettingItem[]) {
    const walletConfig = sortList.map((item) => codeMap[item.code]);
    dispatch(setWalletConfigAction(walletConfig));
  }

  return (
    <CustomDrawerContent title="管理钱包" enterText="确定" onEnter={props.onEnter} onClose={props.onClose}>
      <div className={styles.content}>
        {sortWalletConfig.length ? (
          <ReactSortable ref={sortableRef} animation={200} delay={2} list={sortWalletConfig} setList={onSortWalletConfig} swap>
            {sortWalletConfig.map((wallet) => (
              <WalletRow
                key={wallet.code}
                wallet={wallet}
                onClick={(wallet) => onSelectWallet(wallet)}
                onDoubleClick={(wallet) => {
                  onSelectWallet(wallet);
                  props.onEnter();
                }}
                selected={currentWalletCode === wallet.code}
                onEdit={setEditDrawer}
              />
            ))}
          </ReactSortable>
        ) : (
          <Empty text="暂无钱包~" />
        )}
      </div>
      <div
        className={styles.add}
        onClick={(e) => {
          setAddDrawer(null);
          e.stopPropagation();
        }}
      >
        <AddIcon />
      </div>
      <CustomDrawer show={showAddDrawer}>
        <AddWalletContent onClose={closeAddDrawer} onEnter={closeAddDrawer} />
      </CustomDrawer>
      <CustomDrawer show={showEditDrawer}>
        <EditWalletContent onClose={closeEditDrawer} onEnter={closeEditDrawer} wallet={editWalletData} />
      </CustomDrawer>
    </CustomDrawerContent>
  );
};

export default ManageWalletContent;
