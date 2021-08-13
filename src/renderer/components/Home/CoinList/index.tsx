import React from 'react';
import { useSelector } from 'react-redux';

import CoinRow from '@/components/Home/CoinList/CoinRow';
import Empty from '@/components/Empty';
import LoadingBar from '@/components/LoadingBar';
import DetailStockContent from '@/components/Home/StockList/DetailStockContent';
import CustomDrawer from '@/components/CustomDrawer';
import { StoreState } from '@/reducers/types';
import { useDrawer } from '@/utils/hooks';
import styles from './index.scss';

interface CoinListProps {
  filter: (coin: Coin.ResponseItem & Coin.ExtraRow) => boolean;
}

const CoinList: React.FC<CoinListProps> = (props) => {
  const coins = useSelector((state: StoreState) => state.coin.coins);
  const coinsLoading = useSelector((state: StoreState) => state.coin.coinsLoading);

  const { data: detailCoinCode, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');

  const list = coins.filter(props.filter);

  return (
    <div className={styles.container}>
      <LoadingBar show={coinsLoading} />
      {list.length ? (
        list.map((coin) => <CoinRow key={coin.code} coin={coin} onDetail={setDetailDrawer} />)
      ) : (
        <Empty text="暂无货币数据~" />
      )}
      <CustomDrawer show={showDetailDrawer}>
        <DetailStockContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} secid={detailCoinCode} />
      </CustomDrawer>
    </div>
  );
};
export default CoinList;
