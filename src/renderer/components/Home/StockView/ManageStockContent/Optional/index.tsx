import React, { useMemo } from 'react';

import { ReactSortable } from 'react-sortablejs';
import clsx from 'clsx';
import { Button } from 'antd';
import {
  RiAddLine,
  RiMenuLine,
  RiIndeterminateCircleFill,
  RiNotification2Line,
  RiNotification2Fill,
  RiEditLine,
} from 'react-icons/ri';
import PureCard from '@/components/Card/PureCard';
import CustomDrawer from '@/components/CustomDrawer';
import Empty from '@/components/Empty';
import { deleteStockAction, setStockConfigAction, updateStockAction } from '@/store/features/stock';
import { useDrawer, useAutoDestroySortableRef, useAppDispatch, useAppSelector } from '@/utils/hooks';
import * as Utils from '@/utils';
import styles from './index.module.scss';

const AddStockContent = React.lazy(() => import('@/components/Home/StockView/AddStockContent'));
const EditStockContent = React.lazy(() => import('@/components/Home/StockView/EditStockContent'));

export interface OptionalProps {}

const { dialog } = window.contextModules.electron;

const Optional: React.FC<OptionalProps> = () => {
  const dispatch = useAppDispatch();
  const sortableRef = useAutoDestroySortableRef();
  const { codeMap, stockConfig } = useAppSelector((state) => state.stock.config);
  const { show: showAddDrawer, set: setAddDrawer, close: closeAddDrawer } = useDrawer(null);
  const sortStockConfig = useMemo(() => stockConfig.map((_) => ({ ..._, id: _.secid })), [stockConfig]);

  const {
    data: editData,
    show: showEditDrawer,
    set: setEditDrawer,
    close: closeEditDrawer,
  } = useDrawer({} as Stock.SettingItem);

  function onSortStockConfig(sortList: Stock.SettingItem[]) {
    const hasChanged = Utils.CheckListOrderHasChanged(stockConfig, sortList, 'secid');
    if (hasChanged) {
      const sortConfig = sortList.map((item) => codeMap[item.secid]);
      dispatch(setStockConfigAction(sortConfig));
    }
  }

  async function onRemoveStock(stock: Stock.SettingItem) {
    const { response } = await dialog.showMessageBox({
      title: '删除股票',
      type: 'info',
      message: `确认删除 ${stock.name || ''} ${stock.code}`,
      buttons: ['确定', '取消'],
    });
    if (response === 0) {
      dispatch(deleteStockAction(stock.secid));
    }
  }

  async function onCancleRiskNotice(stock: Stock.SettingItem) {
    const { response } = await dialog.showMessageBox({
      title: '取消涨跌通知',
      type: 'info',
      message: `确认取消 ${stock.name || ''} 涨跌范围、基金净值通知`,
      buttons: ['确定', '取消'],
    });
    if (response === 0) {
      dispatch(
        updateStockAction({
          secid: stock.secid,
          zdfRange: undefined,
          jzNotice: undefined,
        })
      );
    }
  }

  return (
    <div className={styles.content}>
      {sortStockConfig.length ? (
        <ReactSortable
          ref={sortableRef}
          animation={200}
          delay={2}
          list={sortStockConfig}
          setList={onSortStockConfig}
          dragClass={styles.dragItem}
          swap
        >
          {sortStockConfig.map((stock) => (
            <PureCard key={stock.secid} className={clsx(styles.row, 'hoverable')}>
              <RiIndeterminateCircleFill className={styles.remove} onClick={() => onRemoveStock(stock)} />
              <div className={styles.name}>{stock.name}</div>
              <RiEditLine className={styles.function} onClick={() => setEditDrawer(stock)} />
              {stock.zdfRange || stock.jzNotice ? (
                <RiNotification2Fill className={styles.function} onClick={() => onCancleRiskNotice(stock)} />
              ) : (
                <RiNotification2Line className={styles.function} onClick={() => setEditDrawer(stock)} />
              )}
              <RiMenuLine className={styles.function} />
            </PureCard>
          ))}
        </ReactSortable>
      ) : (
        <Empty text="暂未自选股票~" />
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
        <AddStockContent onClose={closeAddDrawer} onEnter={closeAddDrawer} />
      </CustomDrawer>
      <CustomDrawer show={showEditDrawer}>
        <EditStockContent onClose={closeEditDrawer} onEnter={closeEditDrawer} stock={editData} />
      </CustomDrawer>
    </div>
  );
};

export default Optional;
