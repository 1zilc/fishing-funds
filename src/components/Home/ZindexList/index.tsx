import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';

import ZindexRow from '@/components/ZindexRow';
import { HomeContext } from '@/components/Home';
import { StoreState } from '@/reducers/types';
import { useWorkDayTimeToDo } from '@/utils/hooks';
import styles from './index.scss';

const ZindexList = () => {
  const zindexs = useSelector((state: StoreState) => state.zindex.zindexs);
  const { runGetZindexs } = useContext(HomeContext);

  // 间隔时间刷新指数
  useWorkDayTimeToDo(runGetZindexs, 1000 * 10);

  useEffect(() => {
    runGetZindexs();
  }, []);

  return (
    <div className={styles.container}>
      {zindexs.map((zindex) => (
        <ZindexRow key={zindex.zindexCode} zindex={zindex} />
      ))}
      {!zindexs.length && <div className={styles.empty}>暂无指数数据~</div>}
    </div>
  );
};
export default ZindexList;
