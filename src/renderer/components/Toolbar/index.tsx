import React, { useRef } from 'react';
import { Badge } from 'antd';
import clsx from 'clsx';
import { useBoolean, useMemoizedFn, useLongPress } from 'ahooks';
import { RiRefreshLine, RiSettingsLine, RiAppsLine } from 'react-icons/ri';
import CustomDrawer from '@/components/CustomDrawer';
import {
  useFreshFunds,
  useFreshZindexs,
  useFreshQuotations,
  useFreshStocks,
  useFreshCoins,
  useAppSelector,
  useIpcRendererListener,
  useFreshAll,
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
  const freshRef = useRef<HTMLDivElement>(null);
  const updateInfo = useAppSelector((state) => state.updater.updateInfo);
  const tabsActiveKey = useAppSelector((state) => state.tabs.activeKey);

  const freshFunds = useFreshFunds();
  const freshZindexs = useFreshZindexs();
  const freshQuotations = useFreshQuotations();
  const freshStocks = useFreshStocks();
  const freshCoins = useFreshCoins();

  const [openSupport, { setTrue: setOpenSupportTrue, setFalse: setOpenSupportFalse }] = useBoolean(false);
  const [showSettingContent, { setTrue: openSettingContent, setFalse: closeSettingContent }] = useBoolean(false);
  const [showAppCenterDrawer, { setTrue: openAppCenterDrawer, setFalse: closeAppCenterDrawer }] = useBoolean(false);

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

  const freshAll = useFreshAll();

  useLongPress(freshAll, freshRef, {
    onClick: fresh,
  });

  return (
    <div className={styles.content}>
      <div className={clsx(styles.bar, 'max-content')}>
        <RiAppsLine style={{ ...iconSize }} onClick={openAppCenterDrawer} />
        <div ref={freshRef}>
          <RiRefreshLine style={{ ...iconSize }} />
        </div>
        <Badge dot={!!updateInfo.version}>
          <RiSettingsLine style={{ ...iconSize }} onClick={openSettingContent} />
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
