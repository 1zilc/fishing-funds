import React, { useEffect, useState } from 'react';
import { useBoolean } from 'ahooks';
import { ReactSortable } from 'react-sortablejs';
import { remote } from 'electron';

import { ReactComponent as AddIcon } from '@/assets/icons/add.svg';
import { ReactComponent as RemoveIcon } from '@/assets/icons/remove.svg';
import { ReactComponent as MenuIcon } from '@/assets/icons/menu.svg';

import { ReactComponent as EditIcon } from '@/assets/icons/edit.svg';

import CustomDrawer from '@/components/CustomDrawer';
import Empty from '@/components/Empty';
import AddWalletContent from '@/components/Wallet/AddWalletContent';
import EditFundContent, {
  EditFundType,
} from '@/components/Home/FundList/EditFundContent';
import CustomDrawerContent from '@/components/CustomDrawer/Content';

const T2 = require(`@/assets/icons/wallet/2.svg`);
import styles from './index.scss';

export interface ManageWalletContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const WalletIcons = new Array(25)
  .fill('')
  .map((_, index) => require(`@/assets/icons/wallet/${index}.svg`).default);

const ManageWalletContent: React.FC<ManageWalletContentProps> = (props) => {
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

  return (
    <CustomDrawerContent
      title="管理钱包"
      enterText="确定"
      onEnter={() => {
        props.onClose();
      }}
      onClose={props.onClose}
    >
      <div className={styles.content}>
        {WalletIcons.map((_) => (
          <div className={styles.row} style={{}}>
            <img className={styles.rowBg} src={_} draggable={false} />
            <div className={styles.cover}></div>
            <img className={styles.icon} src={_} draggable={false} />
            <div className={styles.rowInfo}>
              <div className={styles.time}>更新时间：2020-12-12 12:31</div>
              <div className={styles.name}>
                自定义钱包钱包钱包钱
                <EditIcon
                  className={styles.editor}
                  onClick={(e) => {
                    openEditWalletDrawer();
                    e.stopPropagation();
                  }}
                />
              </div>
              <div>收益估值：+20</div>
              <div>持有金额：20000</div>
            </div>
            <RemoveIcon
              className={styles.remove}
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </div>
        ))}
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
            closeAddWalletDrawer();
          }}
        />
      </CustomDrawer>
      <CustomDrawer show={showEditWalletDrawer}>
        <AddWalletContent
          onClose={closeEditWalletDrawer}
          onEnter={() => {
            closeEditWalletDrawer();
          }}
        />
      </CustomDrawer>
    </CustomDrawerContent>
  );
};

export default ManageWalletContent;
