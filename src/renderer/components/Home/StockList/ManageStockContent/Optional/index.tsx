import React, { useEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import classnames from 'classnames';

import PureCard from '@/components/Card/PureCard';
import { ReactComponent as AddIcon } from '@/assets/icons/add.svg';
import { ReactComponent as MenuIcon } from '@/assets/icons/menu.svg';
import { ReactComponent as RemoveIcon } from '@/assets/icons/remove.svg';
import CustomDrawer from '@/components/CustomDrawer';
import Empty from '@/components/Empty';
import AddStockContent from '@/components/Home/StockList/AddStockContent';
import { getStockConfig, deleteStock, setStockConfig } from '@/actions/stock';
import { useDrawer } from '@/utils/hooks';
import styles from './index.scss';

export interface OptionalProps {
  active: boolean;
}

const { dialog } = window.contextModules.electron;

const Optional: React.FC<OptionalProps> = ({ active }) => {
  const [sortStockConfig, setSortStockConfig] = useState<
    (Stock.SettingItem & Fund.SortRow)[]
  >([]);
  const {
    show: showAddDrawer,
    set: setAddDrawer,
    close: closeAddDrawer,
  } = useDrawer(null);

  const updateSortStockConfig = () => {
    const { stockConfig } = getStockConfig();
    setSortStockConfig(stockConfig.map((_) => ({ ..._, id: _.secid })));
  };

  const onSortStockConfig = (sortList: Stock.SettingItem[]) => {
    const { codeMap } = getStockConfig();
    const stockConfig = sortList.map((item) => {
      const stock = codeMap[item.secid];
      return {
        name: stock.name,
        secid: stock.secid,
        code: stock.code,
        market: stock.market,
      };
    });
    setStockConfig(stockConfig);
    updateSortStockConfig();
  };

  async function onRemoveStock(stock: Stock.SettingItem) {
    const { response } = await dialog.showMessageBox({
      title: '删除股票',
      type: 'info',
      message: `确认删除 ${stock.name || ''} ${stock.code}`,
      buttons: ['确定', '取消'],
    });
    if (response === 0) {
      deleteStock(stock.secid);
      updateSortStockConfig();
    }
  }

  useEffect(updateSortStockConfig, [active]);

  useEffect(() => {
    if (active) {
      updateSortStockConfig();
    }
  }, [active]);

  return (
    <div className={styles.content}>
      {sortStockConfig.length ? (
        <ReactSortable
          animation={200}
          delay={2}
          list={sortStockConfig}
          setList={onSortStockConfig}
          dragClass={styles.dragItem}
          swap
        >
          {sortStockConfig.map((stock) => {
            return (
              <PureCard
                key={stock.secid}
                className={classnames(styles.row, 'hoverable')}
              >
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
        <AddStockContent
          onClose={closeAddDrawer}
          onEnter={() => {
            updateSortStockConfig();
            closeAddDrawer();
          }}
        />
      </CustomDrawer>
    </div>
  );
};

export default Optional;
