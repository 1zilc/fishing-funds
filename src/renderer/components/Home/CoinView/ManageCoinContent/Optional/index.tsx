import React, { useMemo } from 'react';

import { ReactSortable } from 'react-sortablejs';
import clsx from 'clsx';
import { Button } from 'antd';
import { RiAddLine, RiMenuLine, RiIndeterminateCircleFill } from 'react-icons/ri';
import PureCard from '@/components/Card/PureCard';
import CustomDrawer from '@/components/CustomDrawer';
import Empty from '@/components/Empty';
import { deleteCoinAction, setCoinConfigAction } from '@/store/features/coin';
import { useDrawer, useAutoDestroySortableRef, useAppDispatch, useAppSelector } from '@/utils/hooks';
import * as Utils from '@/utils';
import styles from './index.module.scss';

const AddCoinContent = React.lazy(() => import('@/components/Home/CoinView/AddCoinContent'));

export interface OptionalProps {}

const { dialog } = window.contextModules.electron;

const Optional: React.FC<OptionalProps> = () => {
  const dispatch = useAppDispatch();
  const sortableRef = useAutoDestroySortableRef();
  const { codeMap, coinConfig } = useAppSelector((state) => state.coin.config);
  const { show: showAddDrawer, set: setAddDrawer, close: closeAddDrawer } = useDrawer(null);
  const sortCoinConfig = useMemo(() => coinConfig.map((_) => ({ ..._, id: _.code })), [coinConfig]);

  function onSortCoinConfig(sortList: Coin.SettingItem[]) {
    const hasChanged = Utils.CheckListOrderHasChanged(coinConfig, sortList, 'code');
    if (hasChanged) {
      const sortConfig = sortList.map((item) => codeMap[item.code]);
      dispatch(setCoinConfigAction(sortConfig));
    }
  }

  async function onRemoveCoin(coin: Coin.SettingItem) {
    const { response } = await dialog.showMessageBox({
      title: '删除货币',
      type: 'info',
      message: `确认删除 ${coin.name || ''} ${coin.code}`,
      buttons: ['确定', '取消'],
    });
    if (response === 0) {
      dispatch(deleteCoinAction(coin.code));
    }
  }

  return (
    <div className={styles.content}>
      {sortCoinConfig.length ? (
        <ReactSortable
          ref={sortableRef}
          animation={200}
          delay={2}
          list={sortCoinConfig}
          setList={onSortCoinConfig}
          dragClass={styles.dragItem}
          swap
        >
          {sortCoinConfig.map((coin) => (
            <PureCard key={coin.code} className={clsx(styles.row, 'hoverable')}>
              <RiIndeterminateCircleFill className={styles.remove} onClick={() => onRemoveCoin(coin)} />
              <div className={styles.name}>{coin.symbol}</div>
              <RiMenuLine className={styles.function} />
            </PureCard>
          ))}
        </ReactSortable>
      ) : (
        <Empty text="暂未自选货币~" />
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
        <AddCoinContent onClose={closeAddDrawer} onEnter={closeAddDrawer} />
      </CustomDrawer>
    </div>
  );
};

export default Optional;
