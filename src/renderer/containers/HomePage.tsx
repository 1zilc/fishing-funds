import Home from '@/components/Home';

import {
  useUpdater,
  useAdjustmentNotification,
  useRiskNotification,
  useClipboardImportFunds,
  useBootStrap,
  useTrayContent,
  useAllConfigBackup,
  useTouchBar,
  useMappingLocalToSystemSetting,
  useUpdateContextMenuWalletsState,
  useShareStoreState,
  useSyncConfig,
  useTranslate,
  useForceReloadApp,
} from '@/utils/hooks';

function GlobalTask() {
  useUpdater();
  useAdjustmentNotification();
  useRiskNotification();
  useClipboardImportFunds();
  useAllConfigBackup();
  useTrayContent();
  useUpdateContextMenuWalletsState();
  useMappingLocalToSystemSetting();
  useTouchBar();
  useShareStoreState();
  useSyncConfig();
  useTranslate();
  useForceReloadApp();
  useBootStrap();
  return null;
}

const HomePage = () => {
  return (
    <>
      <Home />
      <GlobalTask />
    </>
  );
};

export default HomePage;
