import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ReactSortable } from 'react-sortablejs';
import classnames from 'classnames';

import PureCard from '@/components/Card/PureCard';
import AddIcon from '@/static/icon/add.svg';
import MenuIcon from '@/static/icon/menu.svg';
import RemoveIcon from '@/static/icon/remove.svg';
import CustomDrawer from '@/components/CustomDrawer';
import Empty from '@/components/Empty';
import AddStockContent from '@/components/Home/StockList/AddStockContent';
import { deleteStockAction, setStockConfigAction } from '@/actions/stock';
import { useDrawer, useAutoDestroySortableRef } from '@/utils/hooks';
import { StoreState } from '@/reducers/types';
import styles from './index.module.scss';

export interface OptionalProps {}

const { dialog } = window.contextModules.electron;

const Optional: React.FC<OptionalProps> = () => {
  const dispatch = useDispatch();
  const sortableRef = useAutoDestroySortableRef();
  const { codeMap, stockConfig } = useSelector((state: StoreState) => state.stock.config);
  const { show: showAddDrawer, set: setAddDrawer, close: closeAddDrawer } = useDrawer(null);
  const sortStockConfig = useMemo(() => stockConfig.map((_) => ({ ..._, id: _.secid })), [stockConfig]);

  function onSortStockConfig(sortList: Stock.SettingItem[]) {
    const stockConfig = sortList.map((item) => {
      const stock = codeMap[item.secid];
      return {
        name: stock.name,
        secid: stock.secid,
        code: stock.code,
        market: stock.market,
        type: stock.type,
      };
    });
    dispatch(setStockConfigAction(stockConfig));
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
              <PureCard key={stock.secid} className={classnames(styles.row, 'hoverable')}>
                <RemoveIcon
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
                <MenuIcon className={styles.menu} />
              </PureCard>
            );
          })}
        </ReactSortable>
      ) : (
        <Empty text="暂未自选股票~" />
      )}
      <div
        className={styles.add}
        onClick={(e) => {
          setAddDrawer(null);
          e.stopPropagation();
        }}
      >
        <AddIcon />
      </div>
      <CustomDrawer show={showAddDrawer}>
        <AddStockContent onClose={closeAddDrawer} onEnter={closeAddDrawer} />
      </CustomDrawer>
    </div>
  );
};

export default Optional;
