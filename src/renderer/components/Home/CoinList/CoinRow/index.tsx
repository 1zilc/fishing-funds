import React from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as ArrowDownIcon } from '@/assets/icons/arrow-down.svg';
import { ReactComponent as ArrowUpIcon } from '@/assets/icons/arrow-up.svg';
import ArrowLine from '@/components/ArrowLine';
import Collapse from '@/components/Collapse';
import { StoreState } from '@/reducers/types';
import { toggleCoinCollapseAction } from '@/actions/coin';
import * as Utils from '@/utils';
import styles from './index.scss';

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
  const dispatch = useDispatch();
  const { conciseSetting } = useSelector((state: StoreState) => state.setting.systemSetting);

  const onDetailClick = () => {
    props.onDetail(coin.code);
  };

  return (
    <>
      <div className={classnames(styles.row)} onClick={() => dispatch(toggleCoinCollapseAction(coin))}>
        <div className={styles.arrow}>
          {coin.collapse ? <ArrowUpIcon style={{ ...arrowSize }} /> : <ArrowDownIcon style={{ ...arrowSize }} />}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span className={styles.zindexName}>{coin.symbol}</span>
          </div>
          {!conciseSetting && (
            <div className={styles.rowBar}>
              <div>
                <span className={styles.code}>{coin.code}</span>
              </div>
            </div>
          )}
        </div>
        <div className={classnames(styles.value)}>
          <div className={classnames(styles.zx, Utils.GetValueColor(coin.changePercent24Hr).textClass)}>
            {coin.priceUsd}
            <ArrowLine value={coin.changePercent24Hr} />
          </div>
          {!conciseSetting && (
            <div className={styles.zd}>
              <div className={classnames(styles.zdf, Utils.GetValueColor(coin.changePercent24Hr).textClass)}>
                {Utils.Yang(coin.changePercent24Hr)} %
              </div>
            </div>
          )}
        </div>
      </div>
      <Collapse isOpened={!!coin.collapse}>
        <div className={styles.collapseContent}>
          <section>
            <span>排名：</span>
            <span>{coin.rank}</span>
          </section>
          <section>
            <span>当前市值：</span>
            <span>{coin.marketCapUsd} 亿</span>
          </section>
          <section>
            <span>挖掘个数：</span>
            <span>{coin.supply}万</span>
          </section>
          <section>
            <span>总发行：</span>
            <span>{coin.maxSupply ? `${coin.maxSupply}万` : '无信息'}</span>
          </section>
          <section>
            <span>24H交易量：</span>
            <span>{coin.volumeUsd24Hr}亿</span>
          </section>
          <section>
            <span>24H均价：</span>
            <span>{coin.vwap24Hr}</span>
          </section>
          {conciseSetting && (
            <section>
              <span>24H涨跌幅：</span>
              <span className={classnames(Utils.GetValueColor(coin.changePercent24Hr).textClass)}>
                {Utils.Yang(coin.changePercent24Hr)} %
              </span>
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
