import { Outlet, useLocation } from 'react-router-dom';

import Collect from '@/components/Collect';
import { useShareStoreState, useMappingLocalToSystemSetting } from '@/utils/hooks';
import styles from './index.module.scss';

function GlobalTask() {
  useMappingLocalToSystemSetting();
  useShareStoreState();
  return null;
}

const DetailPage = () => {
  const location = useLocation();

  return (
    <div className={styles.content}>
      <Outlet />
      <Collect title={location.pathname} />
      <GlobalTask />
    </div>
  );
};

export default DetailPage;
