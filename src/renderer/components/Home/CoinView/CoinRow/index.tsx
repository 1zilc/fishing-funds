import React from 'react';
import clsx from 'clsx';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import ArrowLine from '@/components/ArrowLine';
import Collapse from '@/components/Collapse';
import { toggleCoinCollapseAction } from '@/store/features/coin';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import colorHash from '@/utils/colorHash';
import * as Utils from '@/utils';
import styles from './index.module.scss';

export interface RowProps {
  coin: Coin.ResponseItem & Coin.ExtraRow;
  onDetail: (code: string) => void;
}

const arrowSize = {
  width: 12,
  height: 12,
};

const CoinRow: React.FC<RowProps> = (props) => {
  const { coin } = props;
  const dispatch = useAppDispatch();
  const { conciseSetting } = useAppSelector((state) => state.setting.systemSetting);
  const remoteCoinsMap = useAppSelector((state) => state.coin.remoteCoinsMap);
  const coinColor = colorHash.hex(coin.code);
  const { symbol } = remoteCoinsMap[coin.code];
  const onDetailClick = () => {
    props.onDetail(coin.code);
  };

  return (
    <>
      <div className={clsx(styles.row)} onClick={() => dispatch(toggleCoinCollapseAction(coin))}>
        <div className={styles.arrow}>
          {coin.collapse ? <RiArrowUpSLine style={{ ...arrowSize }} /> : <RiArrowDownSLine style={{ ...arrowSize }} />}
        </div>
        <div style={{ flex: 1, width: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className={styles.zindexName}>{symbol.toUpperCase()}</span>
            <span
              className={styles.coin}
              style={{
                background: coinColor,
                boxShadow: `0 2px 5px ${coinColor}`,
              }}
            />
          </div>
          {!conciseSetting && (
            <div className={styles.rowBar}>
              <div>
                <span className={styles.code}>{coin.code}</span>
                <span>{coin.updateTime}</span>
              </div>
            </div>
          )}
        </div>
        <div className={clsx(styles.value)}>
          <div className={clsx(styles.zx, Utils.GetValueColor(coin.change24h).textClass)}>
            {coin.price}
            <ArrowLine value={coin.change24h} />
          </div>
          {!conciseSetting && (
            <div className={styles.zd}>
              <div className={clsx(styles.zdf, Utils.GetValueColor(coin.change24h).textClass)}>{Utils.Yang(coin.change24h)} %</div>
            </div>
          )}
        </div>
      </div>
      <Collapse isOpened={!!coin.collapse}>
        <div className={styles.collapseContent}>
          <section>
            <span>总市值：</span>
            <span>{coin.marketCap}</span>
          </section>
          <section>
            <span>24H交易量：</span>
            <span>{coin.vol24h}</span>
          </section>
          {conciseSetting && (
            <section>
              <span>24H涨跌幅：</span>
              <span className={clsx(Utils.GetValueColor(coin.change24h).textClass)}>{Utils.Yang(coin.change24h)} %</span>
            </section>
          )}
          <div className={styles.view}>
            <a onClick={onDetailClick}>{'查看详情 >'}</a>
          </div>
        </div>
      </Collapse>
    </>
  );
};

export default CoinRow;
