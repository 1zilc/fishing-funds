import React from 'react';
import { Badge } from 'antd';
import { useSelector } from 'react-redux';
import { useBoolean, useThrottleFn } from 'ahooks';

import RefreshIcon from '@/static/icon/refresh.svg';
import SettingIcon from '@/static/icon/setting.svg';
import AppsIcon from '@/static/icon/apps.svg';
import CustomDrawer from '@/components/CustomDrawer';
import SettingContent from '@/components/Toolbar/SettingContent';
import AppCenterContent from '@/components/Toolbar/AppCenterContent';
import { StoreState } from '@/reducers/types';
import { useScrollToTop, useFreshFunds } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

export interface ToolBarProps {}

const iconSize = { height: 18, width: 18 };

const ToolBar: React.FC<ToolBarProps> = () => {
  const { lowKeySetting, baseFontSizeSetting } = useSelector((state: StoreState) => state.setting.systemSetting);
  const updateInfo = useSelector((state: StoreState) => state.updater.updateInfo);
  const tabsActiveKey = useSelector((state: StoreState) => state.tabs.activeKey);

  const { run: runLoadZindexs } = useThrottleFn(Helpers.Zindex.LoadZindexs, { wait: CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY });
  const { run: runLoadQuotations } = useThrottleFn(Helpers.Quotation.LoadQuotations, { wait: CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY });
  const { run: runLoadStocks } = useThrottleFn(Helpers.Stock.LoadStocks, { wait: CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY });
  const { run: runLoadCoins } = useThrottleFn(Helpers.Coin.LoadCoins, { wait: CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY });

  const freshFunds = useFreshFunds(CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY);
  const freshZindexs = useScrollToTop({ after: () => runLoadZindexs(true) });
  const freshQuotations = useScrollToTop({ after: () => runLoadQuotations(true) });
  const freshStocks = useScrollToTop({ after: () => runLoadStocks(true) });
  const freshCoins = useScrollToTop({ after: () => runLoadCoins(true) });

  const [showSettingDrawer, { setTrue: openSettingDrawer, setFalse: closeSettingDrawer, toggle: ToggleSettingDrawer }] = useBoolean(false);
  const [showAppCenterDrawer, { setTrue: openAppCenterDrawer, setFalse: closeAppCenterDrawer, toggle: ToggleAppCenterDrawer }] =
    useBoolean(false);

  return (
    <>
      <style>{` html { filter: ${lowKeySetting && 'grayscale(90%)'} }`}</style>
      <style>{` html { font-size: ${baseFontSizeSetting}px }`}</style>
      <div className={styles.bar}>
        <AppsIcon style={{ ...iconSize }} onClick={openAppCenterDrawer} />
        {tabsActiveKey === Enums.TabKeyType.Funds && <RefreshIcon style={{ ...iconSize }} onClick={freshFunds} />}
        {tabsActiveKey === Enums.TabKeyType.Zindex && <RefreshIcon style={{ ...iconSize }} onClick={freshZindexs} />}
        {tabsActiveKey === Enums.TabKeyType.Quotation && <RefreshIcon style={{ ...iconSize }} onClick={freshQuotations} />}
        {tabsActiveKey === Enums.TabKeyType.Stock && <RefreshIcon style={{ ...iconSize }} onClick={freshStocks} />}
        {tabsActiveKey === Enums.TabKeyType.Coin && <RefreshIcon style={{ ...iconSize }} onClick={freshCoins} />}
        <Badge dot={!!updateInfo.version}>
          <SettingIcon style={{ ...iconSize }} onClick={openSettingDrawer} />
        </Badge>
      </div>
      <CustomDrawer
        show={showAppCenterDrawer}
        maskStyle={{
          backgroundColor: ' var(--blur-color)',
          backdropFilter: 'saturate(180%) blur(20px)',
        }}
        contentWrapperStyle={{ boxShadow: 'none' }}
        placement="left"
        afterVisibleChange={() => {}}
      >
        <AppCenterContent onClose={closeAppCenterDrawer} />
      </CustomDrawer>
      <CustomDrawer show={showSettingDrawer}>
        <SettingContent
          onClose={closeSettingDrawer}
          onEnter={() => {
            freshFunds();
            freshZindexs();
            freshQuotations();
            freshCoins();
            closeSettingDrawer();
          }}
        />
      </CustomDrawer>
    </>
  );
};

export default ToolBar;
