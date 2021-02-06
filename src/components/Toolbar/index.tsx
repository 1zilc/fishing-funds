import React, { useState, useContext } from 'react';
import classnames from 'classnames';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Drawer from 'rc-drawer';
import { useBoolean } from 'ahooks';

import { ReactComponent as AddIcon } from '../../assets/icons/add.svg';
import { ReactComponent as MenuAddIcon } from '../../assets/icons/menu-add.svg';
import { ReactComponent as DeleteIcon } from '../../assets/icons/delete.svg';
import { ReactComponent as RefreshIcon } from '../../assets/icons/refresh.svg';
import { ReactComponent as QRcodeIcon } from '../../assets/icons/qr-code.svg';
import { ReactComponent as SettingIcon } from '../../assets/icons/setting.svg';
import { TabsState } from '../../reducers/tabs';
import AddFundContent from '../AddFundContent';
import SettingContent from '../SettingContent';
import PayContent from '../PayContent';
import EditZindexContent from '../EditZindexContent';
import {
  toggleToolbarDeleteStatus,
  changeToolbarDeleteStatus,
} from '../../actions/toolbar';
import { StoreState } from '../../reducers/types';
import { HomeContext } from '../Home';
import * as Enums from '../../utils/enums';
import styles from './index.scss';

export interface ToolBarProps {
  tabs: TabsState;
  toggleToolbarDeleteStatus: () => void;
}

const iconSize = { height: 18, width: 18 };

const ToolBar: React.FC<ToolBarProps> = ({
  tabs,
  toggleToolbarDeleteStatus,
}) => {
  const { freshFunds, freshZindexs } = useContext(HomeContext);
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
        {tabs.activeKey === Enums.TabKeyType.Funds && (
          <AddIcon style={{ ...iconSize }} onClick={openAddFundDrawer} />
        )}
        {tabs.activeKey === Enums.TabKeyType.Zindex && (
          <MenuAddIcon style={{ ...iconSize }} onClick={openEditZindexDrawer} />
        )}
        {tabs.activeKey === Enums.TabKeyType.Funds && (
          <DeleteIcon
            style={{ ...iconSize }}
            onClick={toggleToolbarDeleteStatus}
          />
        )}
        {tabs.activeKey === Enums.TabKeyType.Funds && (
          <RefreshIcon style={{ ...iconSize }} onClick={freshFunds} />
        )}
        {tabs.activeKey === Enums.TabKeyType.Zindex && (
          <RefreshIcon style={{ ...iconSize }} onClick={freshZindexs} />
        )}
        <QRcodeIcon style={{ ...iconSize }} onClick={openPayDrawer} />
        <SettingIcon style={{ ...iconSize }} onClick={openSettingDrawer} />
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

const connector = connect(
  (state: StoreState) => ({
    toolbar: state.toolbar,
    tabs: state.tabs,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      { toggleToolbarDeleteStatus, changeToolbarDeleteStatus },
      dispatch
    )
);

export default connector(ToolBar);
