import React, { useMemo } from 'react';

import { ReactSortable } from 'react-sortablejs';
import clsx from 'clsx';
import { Button } from 'antd';

import PureCard from '@/components/Card/PureCard';
import {
  RiAddLine,
  RiMenuLine,
  RiIndeterminateCircleFill,
  RiNotification2Line,
  RiNotification2Fill,
} from 'react-icons/ri';
import CustomDrawer from '@/components/CustomDrawer';
import Empty from '@/components/Empty';
import { deleteZindexAction, setZindexConfigAction, updateZindexAction } from '@/store/features/zindex';
import { useDrawer, useAutoDestroySortableRef, useAppDispatch, useAppSelector } from '@/utils/hooks';
import * as Utils from '@/utils';
import styles from './index.module.scss';

const AddZindexContent = React.lazy(() => import('@/components/Home/ZindexView/AddZindexContent'));
const EditZindexContent = React.lazy(() => import('@/components/Home/ZindexView/EditZindexContent'));

export interface OptionalProps {}

const { dialog } = window.contextModules.electron;

const Optional: React.FC<OptionalProps> = () => {
  const dispatch = useAppDispatch();
  const sortableRef = useAutoDestroySortableRef();
  const { codeMap, zindexConfig } = useAppSelector((state) => state.zindex.config);
  const { show: showAddDrawer, set: setAddDrawer, close: closeAddDrawer } = useDrawer(null);
  const sortZindexConfig = useMemo(() => zindexConfig.map((_) => ({ ..._, id: _.code })), [zindexConfig]);

  const {
    data: editData,
    show: showEditDrawer,
    set: setEditDrawer,
    close: closeEditDrawer,
  } = useDrawer({} as Zindex.SettingItem);

  function onSortZindexConfig(sortList: Zindex.SettingItem[]) {
    const hasChanged = Utils.CheckListOrderHasChanged(zindexConfig, sortList, 'code');
    if (hasChanged) {
      const sortConfig = sortList.map((item) => {
        const zindex = codeMap[item.code];
        return {
          name: zindex.name,
          code: zindex.code,
        };
      });
      dispatch(setZindexConfigAction(sortConfig));
    }
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
    }
  }

  async function onCancleRiskNotice(zindex: Zindex.SettingItem) {
    const { response } = await dialog.showMessageBox({
      title: '取消涨跌通知',
      type: 'info',
      message: `确认取消 ${zindex.name || ''} 涨跌范围、基金净值通知`,
      buttons: ['确定', '取消'],
    });
    if (response === 0) {
      dispatch(
        updateZindexAction({
          code: zindex.code,
          zdfRange: undefined,
          jzNotice: undefined,
        })
      );
    }
  }

  return (
    <div className={styles.content}>
      {sortZindexConfig.length ? (
        <ReactSortable
          ref={sortableRef}
          animation={200}
          delay={2}
          list={sortZindexConfig}
          setList={onSortZindexConfig}
          dragClass={styles.dragItem}
          swap
        >
          {sortZindexConfig.map((zindex) => (
            <PureCard key={zindex.code} className={clsx(styles.row, 'hoverable')}>
              <RiIndeterminateCircleFill className={styles.remove} onClick={() => onRemoveZindex(zindex)} />
              <div className={styles.name}>{zindex.name}</div>
              {zindex.zdfRange || zindex.jzNotice ? (
                <RiNotification2Fill className={styles.function} onClick={() => onCancleRiskNotice(zindex)} />
              ) : (
                <RiNotification2Line className={styles.function} onClick={() => setEditDrawer(zindex)} />
              )}
              <RiMenuLine className={styles.function} />
            </PureCard>
          ))}
        </ReactSortable>
      ) : (
        <Empty text="暂未自选指数~" />
      )}
      <Button
        className="bottom-button"
        shape="circle"
        type="primary"
        size="large"
        icon={<RiAddLine />}
        onClick={(e) => {
          setAddDrawer(null);
          e.stopPropagation();
        }}
      />
      <CustomDrawer show={showAddDrawer}>
        <AddZindexContent onClose={closeAddDrawer} onEnter={closeAddDrawer} />
      </CustomDrawer>
      <CustomDrawer show={showEditDrawer}>
        <EditZindexContent onClose={closeEditDrawer} onEnter={closeEditDrawer} zindex={editData} />
      </CustomDrawer>
    </div>
  );
};

export default Optional;
