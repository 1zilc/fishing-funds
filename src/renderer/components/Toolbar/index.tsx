import React from 'react';
import { Badge } from 'antd';
import { useSelector } from 'react-redux';
import { useBoolean, useThrottleFn } from 'ahooks';

import { ReactComponent as MenuAddIcon } from '@/assets/icons/menu-add.svg';
import { ReactComponent as RefreshIcon } from '@/assets/icons/refresh.svg';
import { ReactComponent as SettingIcon } from '@/assets/icons/setting.svg';
import { ReactComponent as WalletIcon } from '@/assets/icons/wallet.svg';
import { ReactComponent as ChartBoxIcon } from '@/assets/icons/chart-box.svg';
import CustomDrawer from '@/components/CustomDrawer';
import ManageFundContent from '@/components/Home/FundList/ManageFundContent';
import ManageWalletContent from '@/components/Wallet/ManageWalletContent';
import SettingContent from '@/components/SettingContent';
import FundStatisticsContent from '@/components/Home/FundList/FundStatisticsContent';
import ManageZindexContent from '@/components/Home/ZindexList/ManageZindexContent';
import FundFlowContent from '@/components/Home/QuotationList/FundFlowContent';
import { StoreState } from '@/reducers/types';
import { loadZindexs } from '@/actions/zindex';
import { loadQuotations } from '@/actions/quotation';
import { useScrollToTop, useActions, useFreshFunds } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';
import styles from './index.scss';

export interface ToolBarProps {}

const iconSize = { height: 18, width: 18 };

const ToolBar: React.FC<ToolBarProps> = () => {
  const { lowKeySetting, baseFontSizeSetting } = useSelector(
    (state: StoreState) => state.setting.systemSetting
  );

  const updateInfo = useSelector(
    (state: StoreState) => state.updater.updateInfo
  );
  const tabsActiveKey = useSelector(
    (state: StoreState) => state.tabs.activeKey
  );

  const { run: runLoadZindexs } = useThrottleFn(useActions(loadZindexs), {
    wait: CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY,
  });
  const { run: runLoadQuotations } = useThrottleFn(useActions(loadQuotations), {
    wait: CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY,
  });

  const freshFunds = useFreshFunds(CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY);
  const freshZindexs = useScrollToTop({ after: runLoadZindexs });
  const freshQuotations = useScrollToTop({ after: runLoadQuotations });

  const [
    showManageFundDrawer,
    {
      setTrue: openManageFundDrawer,
      setFalse: closeManageFundDrawer,
      toggle: ToggleManageFundDrawer,
    },
  ] = useBoolean(false);
  const [
    showManageWalletDrawer,
    {
      setTrue: openManageWalletDrawer,
      setFalse: closeManageWalletDrawer,
      toggle: ToggleManageWalletDrawer,
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
    showFundsStatisticsDrawer,
    {
      setTrue: openFundStatisticsDrawer,
      setFalse: closeFundStatisticsDrawer,
      toggle: ToggleFundStatisticsDrawer,
    },
  ] = useBoolean(false);

  const [
    showFundFlowDrawer,
    {
      setTrue: openFundFlowDrawer,
      setFalse: closeFundFlowDrawer,
      toggle: ToggleFundFlowDrawer,
    },
  ] = useBoolean(false);

  return (
    <>
      <style>{` html { filter: ${lowKeySetting && 'grayscale(100%)'} }`}</style>
      <style>{` html { font-size: ${baseFontSizeSetting}px }`}</style>
      <div className={styles.bar}>
        {tabsActiveKey === Enums.TabKeyType.Funds && (
          <MenuAddIcon style={{ ...iconSize }} onClick={openManageFundDrawer} />
        )}
        {tabsActiveKey === Enums.TabKeyType.Funds && (
          <WalletIcon
            style={{ ...iconSize }}
            onClick={openManageWalletDrawer}
          />
        )}
        {tabsActiveKey === Enums.TabKeyType.Zindex && (
          <MenuAddIcon style={{ ...iconSize }} onClick={openEditZindexDrawer} />
        )}
        {tabsActiveKey === Enums.TabKeyType.Quotation && (
          <ChartBoxIcon style={{ ...iconSize }} onClick={openFundFlowDrawer} />
        )}
        {tabsActiveKey === Enums.TabKeyType.Stock && (
          <MenuAddIcon style={{ ...iconSize }} />
        )}
        {tabsActiveKey === Enums.TabKeyType.Funds && (
          <RefreshIcon style={{ ...iconSize }} onClick={freshFunds} />
        )}
        {tabsActiveKey === Enums.TabKeyType.Zindex && (
          <RefreshIcon style={{ ...iconSize }} onClick={freshZindexs} />
        )}
        {tabsActiveKey === Enums.TabKeyType.Quotation && (
          <RefreshIcon style={{ ...iconSize }} onClick={freshQuotations} />
        )}
        {tabsActiveKey === Enums.TabKeyType.Stock && (
          <RefreshIcon style={{ ...iconSize }} />
        )}
        {tabsActiveKey === Enums.TabKeyType.Funds && (
          <ChartBoxIcon
            style={{ ...iconSize }}
            onClick={openFundStatisticsDrawer}
          />
        )}
        <Badge dot={!!updateInfo.version}>
          <SettingIcon style={{ ...iconSize }} onClick={openSettingDrawer} />
        </Badge>
      </div>
      <CustomDrawer show={showManageFundDrawer}>
        <ManageFundContent
          onClose={closeManageFundDrawer}
          onEnter={() => {
            freshFunds();
            closeManageFundDrawer();
          }}
        />
      </CustomDrawer>
      <CustomDrawer show={showManageWalletDrawer}>
        <ManageWalletContent
          onClose={closeManageWalletDrawer}
          onEnter={() => {
            freshFunds();
            closeManageWalletDrawer();
          }}
        />
      </CustomDrawer>
      <CustomDrawer show={showEditZindexDrawer}>
        <ManageZindexContent
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
            freshZindexs();
            freshQuotations();
            closeSettingDrawer();
          }}
        />
      </CustomDrawer>
      <CustomDrawer show={showFundFlowDrawer}>
        <FundFlowContent
          onClose={closeFundFlowDrawer}
          onEnter={closeFundFlowDrawer}
        />
      </CustomDrawer>
      <CustomDrawer show={showFundsStatisticsDrawer}>
        <FundStatisticsContent
          onClose={closeFundStatisticsDrawer}
          onEnter={closeFundStatisticsDrawer}
        />
      </CustomDrawer>
    </>
  );
};

export default ToolBar;
