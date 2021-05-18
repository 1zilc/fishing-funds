import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ReactSortable } from 'react-sortablejs';

import { ReactComponent as AddIcon } from '@/assets/icons/add.svg';
import Empty from '@/components/Empty';
import CustomDrawer from '@/components/CustomDrawer';
import AddWalletContent from '@/components/Wallet/AddWalletContent';
import WalletRow from '@/components/Wallet/WalletRow';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import EditWalletContent from '@/components/Wallet/EditWalletContent';
import { StoreState } from '@/reducers/types';
import { useDrawer } from '@/utils/hooks';
import {
  getWalletConfig,
  setWalletConfig,
  selectWallet,
} from '@/actions/wallet';
import styles from './index.scss';

export interface ManageWalletContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const ManageWalletContent: React.FC<ManageWalletContentProps> = (props) => {
  const dispatch = useDispatch();
  const currentWalletCode = useSelector(
    (state: StoreState) => state.wallet.currentWalletCode
  );
  const wallets = useSelector((state: StoreState) => state.wallet.wallets);
  const [sortWalletConfig, setSortWalletConfig] = useState<
    (Wallet.SettingItem & Wallet.SortRow)[]
  >([]);

  const [selectedCode, setSelectedCode] = useState(currentWalletCode);

  const {
    show: showAddDrawer,
    set: setAddDrawer,
    close: closeAddDrawer,
  } = useDrawer(null);

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

  const onSelectWallet = async (wallet: Wallet.SettingItem) => {
    const { code } = wallet;
    setSelectedCode(code);
    setTimeout(onSave);
  };

  const onSortWalletConfig = (sortList: Wallet.SettingItem[]) => {
    const { codeMap } = getWalletConfig();
    const walletConfig = sortList.map((item) => codeMap[item.code]);
    dispatch(setWalletConfig(walletConfig));
  };

  const onSave = () => {
    dispatch(selectWallet(selectedCode));
    props.onEnter();
  };

  useEffect(() => {
    setSortWalletConfig(wallets.map((_) => ({ ..._, id: _.code })));
  }, [wallets]);

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
              <WalletRow
                key={wallet.code}
                wallet={wallet}
                onClick={(wallet) => setSelectedCode(wallet.code)}
                onDoubleClick={onSelectWallet}
                selected={selectedCode === wallet.code}
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
        <EditWalletContent
          onClose={closeEditDrawer}
          onEnter={closeEditDrawer}
          wallet={editWalletData}
        />
      </CustomDrawer>
    </CustomDrawerContent>
  );
};

export default ManageWalletContent;
