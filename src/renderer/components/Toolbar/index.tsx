import React from 'react';
import { Badge } from 'antd';
import clsx from 'clsx';
import { useBoolean, useMemoizedFn } from 'ahooks';

import RefreshIcon from '@/static/icon/refresh.svg';
import SettingIcon from '@/static/icon/setting.svg';
import AppsIcon from '@/static/icon/apps.svg';
import CustomDrawer from '@/components/CustomDrawer';
import {
  useFreshFunds,
  useFreshZindexs,
  useFreshQuotations,
  useFreshStocks,
  useFreshCoins,
  useAppSelector,
  useIpcRendererListener,
} from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';
import styles from './index.module.scss';

const AppCenterContent = React.lazy(() => import('@/components/Toolbar/AppCenterContent'));
const SettingContent = React.lazy(() => import('@/components/Toolbar/SettingContent'));

export interface ToolBarProps {}

const iconSize = { height: 18, width: 18 };
const { ipcRenderer } = window.contextModules.electron;

const ToolBar: React.FC<ToolBarProps> = () => {
  const updateInfo = useAppSelector((state) => state.updater.updateInfo);
  const tabsActiveKey = useAppSelector((state) => state.tabs.activeKey);

  const freshFunds = useFreshFunds(CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY);
  const freshZindexs = useFreshZindexs(CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY);
  const freshQuotations = useFreshQuotations(CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY);
  const freshStocks = useFreshStocks(CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY);
  const freshCoins = useFreshCoins(CONST.DEFAULT.FRESH_BUTTON_THROTTLE_DELAY);

  const [openSupport, { setTrue: setOpenSupportTrue, setFalse: setOpenSupportFalse }] = useBoolean(false);
  const [showSettingContent, { setTrue: openSettingContent, setFalse: closeSettingContent, toggle: ToggleSettingContent }] =
    useBoolean(false);
  const [showAppCenterDrawer, { setTrue: openAppCenterDrawer, setFalse: closeAppCenterDrawer, toggle: ToggleAppCenterDrawer }] =
    useBoolean(false);

  useIpcRendererListener('support-author', (e) => {
    try {
      ipcRenderer.invoke('set-menubar-visible', true);
      setOpenSupportTrue();
      openSettingContent();
    } catch {}
  });

  const fresh = useMemoizedFn(() => {
    switch (tabsActiveKey) {
      case Enums.TabKeyType.Fund:
        freshFunds();
        break;
      case Enums.TabKeyType.Zindex:
        freshZindexs();
        break;
      case Enums.TabKeyType.Quotation:
        freshQuotations();
        break;
      case Enums.TabKeyType.Stock:
        freshStocks();
        break;
      case Enums.TabKeyType.Coin:
        freshCoins();
        break;
      default:
        break;
    }
  });

  const freshAll = useMemoizedFn(() => {
    freshFunds();
    freshZindexs();
    freshQuotations();
    freshStocks();
    freshCoins();
  });

  return (
    <div className={styles.content}>
      <div className={clsx(styles.bar, 'max-content')}>
        <AppsIcon style={{ ...iconSize }} onClick={openAppCenterDrawer} />
        <RefreshIcon style={{ ...iconSize }} onClick={fresh} />
        <Badge dot={!!updateInfo.version}>
          <SettingIcon style={{ ...iconSize }} onClick={openSettingContent} />
        </Badge>
        <CustomDrawer show={showAppCenterDrawer}>
          <AppCenterContent
            onClose={closeAppCenterDrawer}
            onEnter={() => {
              freshAll();
              closeAppCenterDrawer();
            }}
          />
        </CustomDrawer>
        <CustomDrawer className={styles.themeWrapper} show={showSettingContent}>
          <SettingContent
            openSupport={openSupport}
            themeWrapperClass={styles.themeWrapper}
            onClose={() => {
              setOpenSupportFalse();
              closeSettingContent();
            }}
            onEnter={() => {
              setOpenSupportFalse();
              closeSettingContent();
            }}
          />
        </CustomDrawer>
      </div>
    </div>
  );
};

export default ToolBar;
