import React, { useRef } from 'react';
import { Badge } from 'antd';
import clsx from 'clsx';
import { useBoolean, useLongPress, useRequest } from 'ahooks';
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
  useAIImportFunds,
} from '@/utils/hooks';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';
import styles from './index.module.css';
import { FundsImportContentRef } from '@/components/Toolbar/FundsImportContent';

const AppCenterContent = React.lazy(() => import('@/components/Toolbar/AppCenterContent'));
const SettingContent = React.lazy(() => import('@/components/Toolbar/SettingContent'));
const FundsImportContent = React.lazy(() => import('@/components/Toolbar/FundsImportContent'));

export interface ToolBarProps {}

const iconSize = { height: 18, width: 18 };
const { ipcRenderer, dialog, clipboard } = window.contextModules.electron;
const { readFile } = window.contextModules.io;

const ToolBar: React.FC<ToolBarProps> = () => {
  const fundsImportRef = useRef<FundsImportContentRef>(null);
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
  const [showFundsImportContent, { setTrue: openFundsImportContent, setFalse: closeFundsImportContent }] = useBoolean(false);

  useIpcRendererListener('support-author', (e) => {
    try {
      ipcRenderer.invoke('set-menubar-visible', true);
      setOpenSupportTrue();
      openSettingContent();
    } catch {}
  });

  const { aiParseFunds, loading: importFundsLoading, funds: importFundsData, setFunds: setImportFundsData } = useAIImportFunds();
  const { runAsync: runMergeFunds, loading: mergeFundsLoading } = useRequest(async () => fundsImportRef.current?.mergeFunds(), {
    manual: true,
  });
  useIpcRendererListener('ai-funds-import', async (e) => {
    try {
      if (importFundsLoading || mergeFundsLoading) return;
      const { filePaths, canceled } = await dialog.showOpenDialog({
        title: '选择图片',
        filters: [{ name: '', extensions: ['jpg', 'png', 'jpeg', 'webp'] }],
      });
      const filePath = filePaths[0];
      if (canceled || !filePath) {
        return;
      }
      const fmt = filePath.split('.').pop() || 'png';
      const data = await readFile(filePath);
      const img = await Utils.ToBase64(new Blob([data], { type: `image/${fmt}` }));
      const res = await aiParseFunds(img);

      if (res) {
        await ipcRenderer.invoke('set-menubar-visible', true);
        openFundsImportContent();
      }
    } catch (e) {
      dialog.showMessageBox({
        type: 'info',
        title: `导入失败`,
        message: `导入基金失败:${e}`,
      });
    }
  });

  useIpcRendererListener('clipboard-funds-import', async (e: Electron.IpcRendererEvent, data) => {
    try {
      if (importFundsLoading || mergeFundsLoading) return;
      const text = await clipboard.readText();
      if (text) {
        const json: any[] = JSON.parse(text);
        setImportFundsData(json);
        await ipcRenderer.invoke('set-menubar-visible', true);
        openFundsImportContent();
      }
    } catch (e) {
      dialog.showMessageBox({
        type: 'info',
        title: `解析失败`,
        message: `请检查JSON格式:${e}`,
      });
    }
  });

  const fresh = () => {
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
  };

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
        <CustomDrawer show={showFundsImportContent}>
          <FundsImportContent
            ref={fundsImportRef}
            loading={importFundsLoading || mergeFundsLoading}
            funds={importFundsData}
            onClose={closeFundsImportContent}
            onEnter={async () => {
              await runMergeFunds();
              freshFunds();
              closeFundsImportContent();
            }}
          />
        </CustomDrawer>
      </div>
    </div>
  );
};

export default ToolBar;
