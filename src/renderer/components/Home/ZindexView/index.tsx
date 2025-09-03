import React from 'react';

import ZindexRow from '@/components/Home/ZindexView/ZindexRow';
import Empty from '@/components/Empty';
import LoadingBar from '@/components/LoadingBar';
import CustomDrawer from '@/components/CustomDrawer';
import GridView from '@/components/GridView';

import { deleteZindexAction } from '@/store/features/zindex';
import { useDrawer, useAppSelector, useFreshZindexs, useAppDispatch } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import styles from './index.module.css';

const EditZindexContent = React.lazy(() => import('@/components/Home/ZindexView/EditZindexContent'));
const DetailZindexContent = React.lazy(() => import('@/components/Home/ZindexView/DetailZindexContent'));

interface ZindexViewProps {
  filter: (zindex: Zindex.ResponseItem & Zindex.ExtraRow) => boolean;
}

const { dialog } = window.contextModules.electron;

const ZindexView: React.FC<ZindexViewProps> = (props) => {
  const dispatch = useAppDispatch();
  const zindexs = useAppSelector((state) => state.zindex.zindexs);
  const zindexsLoading = useAppSelector((state) => state.zindex.zindexsLoading);
  const zindexViewMode = useAppSelector((state) => state.sort.viewMode.zindexViewMode);

  const freshZindexs = useFreshZindexs();

  const { data: detailZindexCode, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');

  const {
    data: editData,
    show: showEditDrawer,
    set: setEditDrawer,
    close: closeEditDrawer,
  } = useDrawer({} as Zindex.SettingItem);

  const list = zindexs.filter(props.filter);

  const view = (() => {
    switch (zindexViewMode.type) {
      case Enums.ZindexViewType.Grid:
        return <GridView list={list.map((item) => ({ ...item, value: item.zsz }))} onDetail={setDetailDrawer} />;
      case Enums.ZindexViewType.List:
      default:
        return list.map((zindex) => (
          <ZindexRow
            key={zindex.code}
            zindex={zindex}
            onEdit={setEditDrawer}
            onDetail={setDetailDrawer}
            onDelete={onRemoveZindex}
          />
        ));
    }
  })();

  function enterEditDrawer() {
    freshZindexs();
    closeEditDrawer();
  }

  async function onRemoveZindex(zindex: Zindex.SettingItem) {
    const { response } = await dialog.showMessageBox({
      title: '删除指数',
      type: 'info',
      message: `确认删除 ${zindex.name || ''} ${zindex.code}`,
      buttons: ['确定', '取消'],
    });
    if (response === 0) {
      dispatch(deleteZindexAction(zindex.code));
      freshZindexs();
    }
  }

  return (
    <div className={styles.container}>
      <LoadingBar show={zindexsLoading} />
      {list.length ? view : <Empty text="暂无指数数据~" />}
      <CustomDrawer show={showEditDrawer}>
        <EditZindexContent onClose={closeEditDrawer} onEnter={enterEditDrawer} zindex={editData} />
      </CustomDrawer>
      <CustomDrawer show={showDetailDrawer}>
        <DetailZindexContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} code={detailZindexCode} />
      </CustomDrawer>
    </div>
  );
};
export default ZindexView;
