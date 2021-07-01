import React, { useState } from 'react';
import { Tabs } from 'antd';

import PureCard from '@/components/Card/PureCard';
import { ReactComponent as EditIcon } from '@/assets/icons/edit.svg';
import CustomDrawer from '@/components/CustomDrawer';
import Optional from '@/components/Home/FundList/ManageFundContent/Optional';
import Automatic from '@/components/Home/FundList/ManageFundContent/Automatic';
import Rank from '@/components/Home/FundList/ManageFundContent/Rank';
import EditWalletContent from '@/components/Wallet/EditWalletContent';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import { getCurrentWallet, walletIcons } from '@/actions/wallet';
import { useDrawer } from '@/utils/hooks';
import styles from './index.scss';

export interface ManageFundContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const ManageFundContent: React.FC<ManageFundContentProps> = (props) => {
  const wallet = getCurrentWallet();
  const [activeKey, setActiveKey] = useState(String(0));

  const {
    data: editWalletData,
    show: showEditWalletDrawer,
    set: setEditWalletDrawer,
    close: closeEdittWalletDrawer,
  } = useDrawer<Wallet.SettingItem>({
    name: '',
    iconIndex: 0,
    code: '',
    funds: [],
  });

  return (
    <CustomDrawerContent
      title="管理基金"
      enterText="确定"
      onEnter={props.onEnter}
      onClose={props.onClose}
    >
      <div className={styles.wallet}>
        <img src={walletIcons[wallet.iconIndex]} draggable={false} />
        <div className={styles.walletName}>
          {wallet.name}
          <EditIcon
            className={styles.editWallet}
            onClick={() => setEditWalletDrawer(wallet)}
          />
        </div>
      </div>
      <div className={styles.content}>
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          animated={{ tabPane: true }}
          tabBarGutter={15}
        >
          <Tabs.TabPane tab="自选基金" key={String(0)}>
            <Optional active={activeKey === String(0)} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="近期好基" key={String(1)}>
            <PureCard>
              <Rank />
            </PureCard>
          </Tabs.TabPane>
          <Tabs.TabPane tab="定投排行" key={String(2)}>
            <PureCard>
              <Automatic />
            </PureCard>
          </Tabs.TabPane>
        </Tabs>
      </div>
      <CustomDrawer show={showEditWalletDrawer}>
        <EditWalletContent
          onClose={closeEdittWalletDrawer}
          onEnter={closeEdittWalletDrawer}
          wallet={editWalletData}
        />
      </CustomDrawer>
    </CustomDrawerContent>
  );
};

export default ManageFundContent;
