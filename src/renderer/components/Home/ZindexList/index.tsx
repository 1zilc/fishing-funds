import React from 'react';
import { useSelector } from 'react-redux';

import ZindexRow from '@/components/Home/ZindexList/ZindexRow';
import Empty from '@/components/Empty';
import LoadingBar from '@/components/LoadingBar';
import DetailZindexContent from '@/components/Home/ZindexList/DetailZindexContent';
import CustomDrawer from '@/components/CustomDrawer';
import { StoreState } from '@/reducers/types';
import { useDrawer } from '@/utils/hooks';
import styles from './index.module.scss';

interface ZindexListProps {
  filter: (zindex: Zindex.ResponseItem & Zindex.ExtraRow) => boolean;
}

const ZindexList: React.FC<ZindexListProps> = (props) => {
  const zindexs = useSelector((state: StoreState) => state.zindex.zindexs);
  const zindexsLoading = useSelector((state: StoreState) => state.zindex.zindexsLoading);

  const { data: detailZindexCode, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');

  const list = zindexs.filter(props.filter);

  return (
    <div className={styles.container}>
      <LoadingBar show={zindexsLoading} />
      {list.length ? (
        list.map((zindex) => <ZindexRow key={zindex.code} zindex={zindex} onDetail={setDetailDrawer} />)
      ) : (
        <Empty text="暂无指数数据~" />
      )}
      <CustomDrawer show={showDetailDrawer}>
        <DetailZindexContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} code={detailZindexCode} />
      </CustomDrawer>
    </div>
  );
};
export default ZindexList;
