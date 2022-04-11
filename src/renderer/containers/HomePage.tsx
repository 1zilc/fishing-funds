import Home from '../components/Home';

import {
  useUpdater,
  useAdjustmentNotification,
  useRiskNotification,
  useFundsClipboard,
  useBootStrap,
  useMappingLocalToSystemSetting,
  useTrayContent,
  useUpdateContextMenuWalletsState,
  useAllConfigBackup,
  useZindexTouchBar,
  useWalletTouchBar,
  useTabTouchBar,
} from '@/utils/hooks';

const HomePage = () => {
  useUpdater();
  useAdjustmentNotification();
  useRiskNotification();
  useFundsClipboard();
  useAllConfigBackup();
  useTrayContent();
  useMappingLocalToSystemSetting();
  useUpdateContextMenuWalletsState();
  useTabTouchBar();
  useZindexTouchBar();
  useWalletTouchBar();
  useBootStrap();

  return <Home />;
};

export default HomePage;
