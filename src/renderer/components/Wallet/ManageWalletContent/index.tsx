import React, { useMemo } from 'react';

import { ReactSortable } from 'react-sortablejs';
import { Button } from 'antd';
import { RiAddLine } from 'react-icons/ri';
import Empty from '@/components/Empty';
import CustomDrawer from '@/components/CustomDrawer';
import WalletRow from '@/components/Wallet/WalletRow';
import CustomDrawerContent from '@/components/CustomDrawer/Content';

import { useDrawer, useAutoDestroySortableRef, useAppDispatch, useAppSelector } from '@/utils/hooks';
import { setWalletConfigAction, changeCurrentWalletCodeAction } from '@/store/features/wallet';
import styles from './index.module.css';

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
  const { show: showAddWalletDrawer, open: openAddWalletDrawer, close: closeAddWalletDrawer } = useDrawer('');
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
    stocks: [],
  });

  async function onSelectWallet(wallet: Wallet.SettingItem) {
    const { code } = wallet;
    dispatch(changeCurrentWalletCodeAction(code));
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
      <Button
        className="bottom-button"
        shape="circle"
        type="primary"
        size="large"
        icon={<RiAddLine />}
        onClick={(e) => {
          openAddWalletDrawer();
          e.stopPropagation();
        }}
      />
      <CustomDrawer show={showAddWalletDrawer}>
        <AddWalletContent onClose={closeAddWalletDrawer} onEnter={closeAddWalletDrawer} />
      </CustomDrawer>
      <CustomDrawer show={showEditDrawer}>
        <EditWalletContent onClose={closeEditDrawer} onEnter={closeEditDrawer} wallet={editWalletData} />
      </CustomDrawer>
    </CustomDrawerContent>
  );
};

export default ManageWalletContent;
