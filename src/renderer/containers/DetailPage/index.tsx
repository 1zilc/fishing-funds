import { Outlet } from 'react-router-dom';

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
      <Outlet />
      <Collect title={`${params.get('_nav')}`} />
    </div>
  );
};

export default DetailPage;
