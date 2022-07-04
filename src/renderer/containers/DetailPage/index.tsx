import { Outlet } from 'react-router-dom';

import GlobalStyles from '@/components/GlobalStyles';

import { useShareStoreState } from '@/utils/hooks';
import styles from './index.module.scss';

const DetailPage = () => {
  useShareStoreState();

  return (
    <div className={styles.content}>
      <GlobalStyles />
      <Outlet />
    </div>
  );
};

export default DetailPage;
