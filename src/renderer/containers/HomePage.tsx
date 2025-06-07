import Home from '@/components/Home';

import {
  useUpdater,
  useAdjustmentNotification,
  useRiskNotification,
  useFundsClipboard,
  useBootStrap,
  useTrayContent,
  useAllConfigBackup,
  useTouchBar,
  useMappingLocalToSystemSetting,
  useUpdateContextMenuWalletsState,
  useShareStoreState,
  useSyncConfig,
  useTranslate,
  useChatGPT,
  useForceReloadApp,
} from '@/utils/hooks';

function GlobalTask() {
  useUpdater();
  useAdjustmentNotification();
  useRiskNotification();
  useFundsClipboard();
  useAllConfigBackup();
  useTrayContent();
  useUpdateContextMenuWalletsState();
  useMappingLocalToSystemSetting();
  useTouchBar();
  useShareStoreState();
  useSyncConfig();
  useTranslate();
  useChatGPT();
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
