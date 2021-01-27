import React, { useState } from 'react';
import classnames from 'classnames';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Drawer from 'rc-drawer';
import { useBoolean } from 'ahooks';
import AddContent from '../AddContent';
import SettingContent from '../SettingContent';
import { ReactComponent as AddIcon } from 'assets/icons/add.svg';
import { ReactComponent as SettingIcon } from 'assets/icons/setting.svg';
import { ReactComponent as DeleteIcon } from 'assets/icons/delete.svg';
import { ReactComponent as FreshIcon } from 'assets/icons/fresh.svg';
import {
  toggleToolbarDeleteStatus,
  changeToolbarDeleteStatus
} from '../../actions/toolbar';
import { StoreState } from '../../reducers/types';
import { ToolbarState } from '../../reducers/toolbar';
import * as Enums from '../../utils/enums';
import styles from './index.scss';

export interface ToolBarProps {
  onFresh: () => Promise<Fund.ResponseItem[]>;
  toggleToolbarDeleteStatus: () => void;
}

const iconSize = { height: 24, width: 24 };

const ToolBar: React.FC<ToolBarProps> = ({
  onFresh,
  toggleToolbarDeleteStatus
}) => {
  const [
    showAddDrawer,
    {
      setTrue: openAddDrawer,
      setFalse: closeAddDrawer,
      toggle: ToggleAddDrawer
    }
  ] = useBoolean(false);
  const [
    showSettingDrawer,
    {
      setTrue: openSettingDrawer,
      setFalse: closeSettingDrawer,
      toggle: ToggleSettingDrawer
    }
  ] = useBoolean(false);

  return (
    <>
      <div className={styles.bar}>
        <AddIcon style={{ ...iconSize }} onClick={openAddDrawer} />
        <DeleteIcon
          style={{ ...iconSize }}
          onClick={toggleToolbarDeleteStatus}
        />
        <FreshIcon style={{ ...iconSize }} onClick={onFresh} />
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
          onEnter={() => {
            onFresh();
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
      >
        <SettingContent
          onEnter={closeSettingDrawer}
          onClose={closeSettingDrawer}
        />
      </Drawer>
    </>
  );
};

export default connect(
  (state: StoreState) => ({
    toolbar: state.toolbar
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      { toggleToolbarDeleteStatus, changeToolbarDeleteStatus },
      dispatch
    )
)(ToolBar);
