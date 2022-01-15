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
  useBootStrap();

  return <Home />;
};

export default HomePage;
