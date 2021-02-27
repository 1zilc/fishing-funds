import React from 'react';
import { Badge } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useBoolean, useThrottleFn } from 'ahooks';

import { ReactComponent as AddIcon } from '@/assets/icons/add.svg';
import { ReactComponent as MenuAddIcon } from '@/assets/icons/menu-add.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/delete.svg';
import { ReactComponent as RefreshIcon } from '@/assets/icons/refresh.svg';
import { ReactComponent as QRcodeIcon } from '@/assets/icons/qr-code.svg';
import { ReactComponent as SettingIcon } from '@/assets/icons/setting.svg';
import CustomDrawer from '@/components/CustomDrawer';
import AddFundContent from '@/components/AddFundContent';
import SettingContent from '@/components/SettingContent';
import PayContent from '@/components/PayContent';
import EditZindexContent from '@/components/EditZindexContent';
import { StoreState } from '@/reducers/types';
import { toggleToolbarDeleteStatus } from '@/actions/toolbar';
import { loadFunds } from '@/actions/fund';
import { loadZindexs } from '@/actions/zindex';
import { loadQuotations } from '@/actions/quotation';
import { getSystemSetting } from '@/actions/setting';
import { useScrollToTop, useActions } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import styles from './index.scss';

export interface ToolBarProps {}

const iconSize = { height: 18, width: 18 };
const throttleDelay = 1000 * 3;

const ToolBar: React.FC<ToolBarProps> = () => {
  const dispatch = useDispatch();
  const { lowKeySetting } = getSystemSetting();
  const updateInfo = useSelector(
    (state: StoreState) => state.updater.updateInfo
  );
  const tabsActiveKey = useSelector(
    (state: StoreState) => state.tabs.activeKey
  );
  const { run: runLoadFunds } = useThrottleFn(useActions(loadFunds), {
    wait: throttleDelay,
  });
  const { run: runLoadZindexs } = useThrottleFn(useActions(loadZindexs), {
    wait: throttleDelay,
  });
  const { run: runLoadQuotations } = useThrottleFn(useActions(loadQuotations), {
    wait: throttleDelay,
  });

  const freshFunds = useScrollToTop({ after: runLoadFunds });
  const freshZindexs = useScrollToTop({ after: runLoadZindexs });
  const freshQuotations = useScrollToTop({ after: runLoadQuotations });

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
      {lowKeySetting && <style>{`html { filter: grayscale(95%) }`}</style>}
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
        {tabsActiveKey === Enums.TabKeyType.Quotation && (
          <RefreshIcon style={{ ...iconSize }} onClick={freshQuotations} />
        )}
        <Badge dot={!!updateInfo.version}>
          <SettingIcon style={{ ...iconSize }} onClick={openSettingDrawer} />
        </Badge>
      </div>
      <CustomDrawer show={showAddFundDrawer}>
        <AddFundContent
          onClose={closeAddFundDrawer}
          onEnter={() => {
            freshFunds();
            closeAddFundDrawer();
          }}
        />
      </CustomDrawer>
      <CustomDrawer show={showEditZindexDrawer}>
        <EditZindexContent
          onClose={closeEditZindexDrawer}
          onEnter={() => {
            freshZindexs();
            closeEditZindexDrawer();
          }}
        />
      </CustomDrawer>
      <CustomDrawer show={showSettingDrawer}>
        <SettingContent
          onClose={closeSettingDrawer}
          onEnter={() => {
            freshFunds();
            closeSettingDrawer();
          }}
        />
      </CustomDrawer>
      <CustomDrawer show={showPayDrawer}>
        <PayContent onEnter={closePayDrawer} onClose={closePayDrawer} />
      </CustomDrawer>
    </>
  );
};

export default ToolBar;
