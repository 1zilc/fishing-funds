import React, { useEffect, useState } from 'react';
import { useBoolean } from 'ahooks';
import { useSelector, useDispatch } from 'react-redux';
import { ReactSortable } from 'react-sortablejs';

import { ReactComponent as AddIcon } from '@/assets/icons/add.svg';
import Empty from '@/components/Empty';
import CustomDrawer from '@/components/CustomDrawer';
import AddWalletContent from '@/components/Wallet/AddWalletContent';
import WalletRow from '@/components/Wallet/WalletRow';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import { StoreState } from '@/reducers/types';
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

  const [
    showAddWalletDrawer,
    {
      setTrue: openAddWalletDrawer,
      setFalse: closeAddWalletDrawer,
      toggle: ToggleAddWalletDrawer,
    },
  ] = useBoolean(false);

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
          openAddWalletDrawer();
          e.stopPropagation();
        }}
      >
        <AddIcon />
      </div>
      <CustomDrawer show={showAddWalletDrawer}>
        <AddWalletContent
          onClose={closeAddWalletDrawer}
          onEnter={closeAddWalletDrawer}
        />
      </CustomDrawer>
    </CustomDrawerContent>
  );
};

export default ManageWalletContent;
