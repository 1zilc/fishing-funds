import { Outlet } from 'react-router-dom';

import GlobalStyles from '@/components/GlobalStyles';
import Collect from '@/components/Collect';
import { useShareStoreState, useMappingLocalToSystemSetting } from '@/utils/hooks';
import * as Utils from '@/utils';
import styles from './index.module.scss';

const params = Utils.ParseSearchParams();

const DetailPage = () => {
  useMappingLocalToSystemSetting();
  useShareStoreState();

  return (
    <div className={styles.content}>
      <GlobalStyles />
      <Outlet />
      <Collect title={`${params.get('_nav')}`} />
    </div>
  );
};

export default DetailPage;
