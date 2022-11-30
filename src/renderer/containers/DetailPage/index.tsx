import { Outlet, useLocation } from 'react-router-dom';

import Collect from '@/components/Collect';
import { useShareStoreState, useMappingLocalToSystemSetting } from '@/utils/hooks';
import styles from './index.module.scss';

const DetailPage = () => {
  const location = useLocation();
  useMappingLocalToSystemSetting();
  useShareStoreState();

  return (
    <div className={styles.content}>
      <Outlet />
      <Collect title={location.pathname} />
    </div>
  );
};

export default DetailPage;
