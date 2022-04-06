import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import CoinRow from '@/components/Home/CoinList/CoinRow';
import Empty from '@/components/Empty';
import LoadingBar from '@/components/LoadingBar';
import CustomDrawer from '@/components/CustomDrawer';
import GridView from '@/components/GridView';
import { StoreState } from '@/reducers/types';
import { useDrawer } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

const DetailCoinContent = React.lazy(() => import('@/components/Home/CoinList/DetailCoinContent'));

interface CoinListProps {
  filter: (coin: Coin.ResponseItem & Coin.ExtraRow) => boolean;
}

const CoinList: React.FC<CoinListProps> = (props) => {
  const coins = useSelector((state: StoreState) => state.coin.coins);
  const coinsLoading = useSelector((state: StoreState) => state.coin.coinsLoading);
  const coinViewMode = useSelector((state: StoreState) => state.sort.viewMode.coinViewMode);

  const { data: detailCoinCode, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');

  const list = coins.filter(props.filter);

  const view = useMemo(() => {
    switch (coinViewMode.type) {
      case Enums.CoinViewType.Grid:
        return (
          <GridView
            list={list.map((item) => ({
              ...item,
              name: Helpers.Coin.GetCurrentCoin(item.code).symbol,
              value: Number(item.price),
              zdf: Number(item.change24h),
              zdd: Number(
                Number(Number(item.change24h) * Number(item.price) * 0.01).toFixed(item.price?.toString().split('.')[1]?.length ?? 0)
              ),
            }))}
            onDetail={setDetailDrawer}
          />
        );
      case Enums.CoinViewType.List:
      default:
        return list.map((coin) => <CoinRow key={coin.code} coin={coin} onDetail={setDetailDrawer} />);
    }
  }, [list, coinViewMode]);

  return (
    <div className={styles.container}>
      <LoadingBar show={coinsLoading} />
      {list.length ? view : <Empty text="暂无货币数据~" />}
      <CustomDrawer show={showDetailDrawer}>
        <DetailCoinContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} code={detailCoinCode} />
      </CustomDrawer>
    </div>
  );
};
export default CoinList;
