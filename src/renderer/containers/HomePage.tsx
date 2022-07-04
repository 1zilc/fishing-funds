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
} from '@/utils/hooks';

const HomePage = () => {
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
  useBootStrap();

  return <Home />;
};

export default HomePage;
