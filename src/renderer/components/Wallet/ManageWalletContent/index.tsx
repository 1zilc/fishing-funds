import React, { useMemo } from 'react';

import { ReactSortable } from 'react-sortablejs';

import AddIcon from '@/static/icon/add.svg';
import Empty from '@/components/Empty';
import CustomDrawer from '@/components/CustomDrawer';
import WalletRow from '@/components/Wallet/WalletRow';
import CustomDrawerContent from '@/components/CustomDrawer/Content';

import { useDrawer, useAutoDestroySortableRef, useAppDispatch, useAppSelector } from '@/utils/hooks';
import { setWalletConfigAction, selectWalletAction } from '@/store/features/wallet';
import styles from './index.module.scss';

const AddWalletContent = React.lazy(() => import('@/components/Wallet/AddWalletContent'));
const EditWalletContent = React.lazy(() => import('@/components/Wallet/EditWalletContent'));

export interface ManageWalletContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const ManageWalletContent: React.FC<ManageWalletContentProps> = (props) => {
  const dispatch = useAppDispatch();
  const sortableRef = useAutoDestroySortableRef();
  const currentWalletCode = useAppSelector((state) => state.wallet.currentWalletCode);
  const { codeMap, walletConfig } = useAppSelector((state) => state.wallet.config);
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
