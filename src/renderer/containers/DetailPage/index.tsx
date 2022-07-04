import { Outlet } from 'react-router-dom';

import GlobalStyles from '@/components/GlobalStyles';

import { useShareStoreState, useMappingLocalToSystemSetting } from '@/utils/hooks';
import styles from './index.module.scss';

const DetailPage = () => {
  useMappingLocalToSystemSetting();
  useShareStoreState();

  return (
    <div className={styles.content}>
      <GlobalStyles />
      <Outlet />
    </div>
  );
};

export default DetailPage;
