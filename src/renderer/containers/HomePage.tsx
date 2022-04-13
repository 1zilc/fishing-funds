import Home from '../components/Home';

import {
  useUpdater,
  useAdjustmentNotification,
  useRiskNotification,
  useFundsClipboard,
  useBootStrap,
  useTrayContent,
  useAllConfigBackup,
  useMappingLocalToSystemSetting,
} from '@/utils/hooks';

const HomePage = () => {
  useUpdater();
  useAdjustmentNotification();
  useRiskNotification();
  useFundsClipboard();
  useAllConfigBackup();
  useTrayContent();
  useMappingLocalToSystemSetting();
  useBootStrap();

  return <Home />;
};

export default HomePage;
