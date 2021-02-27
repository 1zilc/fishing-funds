import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';

import ZindexRow from '@/components/ZindexRow';
import Empty from '@/components/Empty';
import LoadingBar from '@/components/LoadingBar';
import { loadZindexs } from '@/actions/zindex';
import { StoreState } from '@/reducers/types';
import { useWorkDayTimeToDo } from '@/utils/hooks';
import { useActions } from '@/utils/hooks';
import styles from './index.scss';

const ZindexList = () => {
  const zindexs = useSelector((state: StoreState) => state.zindex.zindexs);
  const zindexsLoading = useSelector(
    (state: StoreState) => state.zindex.zindexsLoading
  );
  const runLoadZindexs = useActions(loadZindexs);

  // 间隔时间刷新指数
  useWorkDayTimeToDo(runLoadZindexs, 1000 * 20);

  useEffect(() => {
    runLoadZindexs();
  }, []);

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
