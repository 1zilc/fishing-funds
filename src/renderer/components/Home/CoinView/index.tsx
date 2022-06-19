import React, { useMemo } from 'react';

import CoinRow from '@/components/Home/CoinView/CoinRow';
import Empty from '@/components/Empty';
import LoadingBar from '@/components/LoadingBar';
import CustomDrawer from '@/components/CustomDrawer';
import GridView from '@/components/GridView';
import { useDrawer, useAppSelector } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

const DetailCoinContent = React.lazy(() => import('@/components/Home/CoinView/DetailCoinContent'));

interface CoinListProps {
  filter: (coin: Coin.ResponseItem & Coin.ExtraRow) => boolean;
}

const CoinView: React.FC<CoinListProps> = (props) => {
  const coins = useAppSelector((state) => state.coin.coins);
  const remoteCoinsMap = useAppSelector((state) => state.coin.remoteCoinsMap);
  const coinsLoading = useAppSelector((state) => state.coin.coinsLoading);
  const coinViewMode = useAppSelector((state) => state.sort.viewMode.coinViewMode);

  const { data: detailCoinCode, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');

  const list = coins.filter(props.filter);

  const view = useMemo(() => {
    switch (coinViewMode.type) {
      case Enums.CoinViewType.Grid:
        return (
          <GridView
            list={list.map((item) => ({
              ...item,
              name: remoteCoinsMap[item.code]?.symbol,
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
export default CoinView;
