import React, { useState, useContext } from 'react';
import classnames from 'classnames';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Drawer from 'rc-drawer';
import { useBoolean } from 'ahooks';

import { ReactComponent as AddIcon } from '../../assets/icons/add.svg';
import { ReactComponent as DeleteIcon } from '../../assets/icons/delete.svg';
import { ReactComponent as RefreshIcon } from '../../assets/icons/refresh.svg';
import { ReactComponent as QRcodeIcon } from '../../assets/icons/qr-code.svg';
import { ReactComponent as SettingIcon } from '../../assets/icons/setting.svg';
import { TabsState } from '../../reducers/tabs';
import AddContent from '../AddContent';
import SettingContent from '../SettingContent';
import PayContent from '../PayContent';
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
    showAddDrawer,
    {
      setTrue: openAddDrawer,
      setFalse: closeAddDrawer,
      toggle: ToggleAddDrawer,
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
          <AddIcon style={{ ...iconSize }} onClick={openAddDrawer} />
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
        open={showAddDrawer}
        showMask
        maskClosable
        level={null}
        handler={false}
        onClose={closeAddDrawer}
        placement="bottom"
      >
        <AddContent
          show={showAddDrawer}
          onEnter={() => {
            freshFunds();
            closeAddDrawer();
          }}
          onClose={closeAddDrawer}
        />
      </Drawer>
      <Drawer
        open={showSettingDrawer}
        showMask
        maskClosable
        level={null}
        handler={false}
        onClose={closeAddDrawer}
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
