import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import ZindexRow from '@/components/Home/ZindexView/ZindexRow';
import Empty from '@/components/Empty';
import LoadingBar from '@/components/LoadingBar';
import CustomDrawer from '@/components/CustomDrawer';
import GridView from '@/components/GridView';
import { StoreState } from '@/reducers/types';
import { useDrawer, useZindexTouchBar } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import styles from './index.module.scss';

const DetailZindexContent = React.lazy(() => import('@/components/Home/ZindexView/DetailZindexContent'));

interface ZindexViewProps {
  filter: (zindex: Zindex.ResponseItem & Zindex.ExtraRow) => boolean;
}

const ZindexView: React.FC<ZindexViewProps> = (props) => {
  const zindexs = useSelector((state: StoreState) => state.zindex.zindexs);
  const zindexsLoading = useSelector((state: StoreState) => state.zindex.zindexsLoading);
  const zindexViewMode = useSelector((state: StoreState) => state.sort.viewMode.zindexViewMode);

  const { data: detailZindexCode, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');

  const list = zindexs.filter(props.filter);

  const view = useMemo(() => {
    switch (zindexViewMode.type) {
      case Enums.ZindexViewType.Grid:
        return <GridView list={list.map((item) => ({ ...item, value: item.zsz }))} onDetail={setDetailDrawer} />;
      case Enums.ZindexViewType.List:
      default:
        return list.map((zindex) => <ZindexRow key={zindex.code} zindex={zindex} onDetail={setDetailDrawer} />);
    }
  }, [list, zindexViewMode]);

  useZindexTouchBar();

  return (
    <div className={styles.container}>
      <LoadingBar show={zindexsLoading} />
      {list.length ? view : <Empty text="暂无指数数据~" />}
      <CustomDrawer show={showDetailDrawer}>
        <DetailZindexContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} code={detailZindexCode} />
      </CustomDrawer>
    </div>
  );
};
export default ZindexView;
