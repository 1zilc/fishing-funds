import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';

import ZindexRow from '@/components/ZindexRow';
import Empty from '@/components/Empty';
import { HomeContext } from '@/components/Home';
import { StoreState } from '@/reducers/types';
import { useWorkDayTimeToDo } from '@/utils/hooks';
import styles from './index.scss';

const ZindexList = () => {
  const zindexs = useSelector((state: StoreState) => state.zindex.zindexs);
  const { runGetZindexs } = useContext(HomeContext);

  // 间隔时间刷新指数
  useWorkDayTimeToDo(runGetZindexs, 1000 * 20);

  useEffect(() => {
    runGetZindexs();
  }, []);

  return (
    <div className={styles.container}>
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
