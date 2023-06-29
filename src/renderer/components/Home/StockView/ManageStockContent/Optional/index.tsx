import React, { useMemo } from 'react';

import { ReactSortable } from 'react-sortablejs';
import clsx from 'clsx';
import { Button } from 'antd';
import { RiAddLine, RiMenuLine, RiIndeterminateCircleFill } from 'react-icons/ri';
import PureCard from '@/components/Card/PureCard';
import CustomDrawer from '@/components/CustomDrawer';
import Empty from '@/components/Empty';
import { deleteStockAction, setStockConfigAction } from '@/store/features/stock';
import { useDrawer, useAutoDestroySortableRef, useAppDispatch, useAppSelector } from '@/utils/hooks';
import * as Utils from '@/utils';
import styles from './index.module.scss';

const AddStockContent = React.lazy(() => import('@/components/Home/StockView/AddStockContent'));

export interface OptionalProps {}

const { dialog } = window.contextModules.electron;

const Optional: React.FC<OptionalProps> = () => {
  const dispatch = useAppDispatch();
  const sortableRef = useAutoDestroySortableRef();
  const { codeMap, stockConfig } = useAppSelector((state) => state.stock.config);
  const { show: showAddDrawer, set: setAddDrawer, close: closeAddDrawer } = useDrawer(null);
  const sortStockConfig = useMemo(() => stockConfig.map((_) => ({ ..._, id: _.secid })), [stockConfig]);

  function onSortStockConfig(sortList: Stock.SettingItem[]) {
    const hasChanged = Utils.CheckListOrderHasChanged(stockConfig, sortList, 'secid');
    if (hasChanged) {
      const sortConfig = sortList.map((item) => {
        const stock = codeMap[item.secid];
        return {
          name: stock.name,
          secid: stock.secid,
          code: stock.code,
          market: stock.market,
          type: stock.type,
        };
      });
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
          {sortStockConfig.map((stock) => {
            return (
              <PureCard key={stock.secid} className={clsx(styles.row, 'hoverable')}>
                <RiIndeterminateCircleFill
                  className={styles.remove}
                  onClick={(e) => {
                    onRemoveStock(stock);
                    e.stopPropagation();
                  }}
                />
                <div className={styles.inner}>
                  <div className={styles.name}>
                    {stock.name}
                    <span className={styles.code}>（{stock.code}）</span>
                  </div>
                </div>
                <RiMenuLine className={styles.menu} />
              </PureCard>
            );
          })}
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
    </div>
  );
};

export default Optional;
