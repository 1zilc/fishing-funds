import React, { useState, useContext } from 'react';
import classnames from 'classnames';
import { Badge } from 'antd';

import { useSelector, useDispatch } from 'react-redux';
import Drawer from 'rc-drawer';
import { useBoolean } from 'ahooks';

import { ReactComponent as AddIcon } from '@/assets/icons/add.svg';
import { ReactComponent as MenuAddIcon } from '@/assets/icons/menu-add.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/delete.svg';
import { ReactComponent as RefreshIcon } from '@/assets/icons/refresh.svg';
import { ReactComponent as QRcodeIcon } from '@/assets/icons/qr-code.svg';
import { ReactComponent as SettingIcon } from '@/assets/icons/setting.svg';

import AddFundContent from '@/components/AddFundContent';
import SettingContent from '@/components/SettingContent';
import PayContent from '@/components/PayContent';
import { HomeContext } from '@/components/Home';
import EditZindexContent from '@/components/EditZindexContent';

import { toggleToolbarDeleteStatus } from '@/actions/toolbar';

import { StoreState } from '@/reducers/types';

import * as Enums from '@/utils/enums';
import styles from './index.scss';

export interface ToolBarProps {}

const iconSize = { height: 18, width: 18 };

const ToolBar: React.FC<ToolBarProps> = () => {
  const dispatch = useDispatch();
  const { freshFunds, freshZindexs } = useContext(HomeContext);

  const updateInfo = useSelector(
    (state: StoreState) => state.updater.updateInfo
  );
  const tabsActiveKey = useSelector(
    (state: StoreState) => state.tabs.activeKey
  );

  const [
    showAddFundDrawer,
    {
      setTrue: openAddFundDrawer,
      setFalse: closeAddFundDrawer,
      toggle: ToggleAddFundDrawer,
    },
  ] = useBoolean(false);
  const [
    showEditZindexDrawer,
    {
      setTrue: openEditZindexDrawer,
      setFalse: closeEditZindexDrawer,
      toggle: ToggleEditZindexDrawer,
    },
  ] = useBoolean(false);
  const [
    showSettingDrawer,
    {
      setTrue: openSettingDrawer,
      setFalse: closeSettingDrawer,
      toggle: ToggleSettingDrawer,
    },
  ] = useBoolean(false);
  const [
    showPayDrawer,
    {
      setTrue: openPayDrawer,
      setFalse: closePayDrawer,
      toggle: TogglePayDrawer,
    },
  ] = useBoolean(false);

  return (
    <>
      <div className={styles.bar}>
        {tabsActiveKey === Enums.TabKeyType.Funds && (
          <AddIcon style={{ ...iconSize }} onClick={openAddFundDrawer} />
        )}
        {tabsActiveKey === Enums.TabKeyType.Zindex && (
          <MenuAddIcon style={{ ...iconSize }} onClick={openEditZindexDrawer} />
        )}
        {tabsActiveKey === Enums.TabKeyType.Funds && (
          <DeleteIcon
            style={{ ...iconSize }}
            onClick={() => dispatch(toggleToolbarDeleteStatus())}
          />
        )}
        {tabsActiveKey === Enums.TabKeyType.Funds && (
          <RefreshIcon style={{ ...iconSize }} onClick={freshFunds} />
        )}
        {tabsActiveKey === Enums.TabKeyType.Zindex && (
          <RefreshIcon style={{ ...iconSize }} onClick={freshZindexs} />
        )}
        <QRcodeIcon style={{ ...iconSize }} onClick={openPayDrawer} />
        <Badge dot={!!updateInfo.version}>
          <SettingIcon style={{ ...iconSize }} onClick={openSettingDrawer} />
        </Badge>
      </div>

      <Drawer
        open={showAddFundDrawer}
        showMask
        maskClosable
        level={null}
        handler={false}
        onClose={closeAddFundDrawer}
        placement="bottom"
      >
        <AddFundContent
          show={showAddFundDrawer}
          onEnter={() => {
            freshFunds();
            closeAddFundDrawer();
          }}
          onClose={closeAddFundDrawer}
        />
      </Drawer>
      <Drawer
        open={showEditZindexDrawer}
        showMask
        maskClosable
        level={null}
        handler={false}
        onClose={closeEditZindexDrawer}
        placement="bottom"
        height="100vh"
      >
        <EditZindexContent
          show={showEditZindexDrawer}
          onEnter={() => {
            freshZindexs();
            closeEditZindexDrawer();
          }}
          onClose={closeEditZindexDrawer}
        />
      </Drawer>
      <Drawer
        open={showSettingDrawer}
        showMask
        maskClosable
        level={null}
        handler={false}
        onClose={closeAddFundDrawer}
        placement="bottom"
        height="100vh"
      >
        <SettingContent
          show={showSettingDrawer}
          onEnter={() => {
            freshFunds();
            closeSettingDrawer();
          }}
          onClose={closeSettingDrawer}
        />
      </Drawer>
      <Drawer
        open={showPayDrawer}
        showMask
        maskClosable
        level={null}
        handler={false}
        onClose={closePayDrawer}
        placement="bottom"
        height="100vh"
      >
        <PayContent
          show={showPayDrawer}
          onEnter={closePayDrawer}
          onClose={closePayDrawer}
        />
      </Drawer>
    </>
  );
};

export default ToolBar;
