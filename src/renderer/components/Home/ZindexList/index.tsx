import React from 'react';
import { useSelector } from 'react-redux';

import ZindexRow from '@/components/Home/ZindexList/ZindexRow';
import Empty from '@/components/Empty';
import LoadingBar from '@/components/LoadingBar';
import { StoreState } from '@/reducers/types';
import styles from './index.scss';

const ZindexList = () => {
  const zindexs = useSelector((state: StoreState) => state.zindex.zindexs);
  const zindexsLoading = useSelector(
    (state: StoreState) => state.zindex.zindexsLoading
  );

  return (
    <div className={styles.container}>
      <LoadingBar show={zindexsLoading} />
      {zindexs.length ? (
        zindexs.map((zindex) => (
          <ZindexRow key={zindex.zindexCode} zindex={zindex} />
        ))
      ) : (
        <Empty text="暂无指数数据~" />
      )}
    </div>
  );
};
export default ZindexList;
