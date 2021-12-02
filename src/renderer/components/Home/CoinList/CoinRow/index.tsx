import React from 'react';
import classnames from 'classnames';
import ColorHash from 'color-hash';
import { useDispatch, useSelector } from 'react-redux';

import ArrowDownIcon from '@/static/icon/arrow-down.svg';
import ArrowUpIcon from '@/static/icon/arrow-up.svg';
import ArrowLine from '@/components/ArrowLine';
import Collapse from '@/components/Collapse';
import { StoreState } from '@/reducers/types';
import { toggleCoinCollapseAction } from '@/actions/coin';
import * as Utils from '@/utils';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

export interface RowProps {
  coin: Coin.ResponseItem & Coin.ExtraRow;
  onDetail: (code: string) => void;
}

const arrowSize = {
  width: 12,
  height: 12,
};
const colorHash = new ColorHash();

const CoinRow: React.FC<RowProps> = (props) => {
  const { coin } = props;
  const dispatch = useDispatch();
  const { conciseSetting } = useSelector((state: StoreState) => state.setting.systemSetting);
  const coinColor = colorHash.hex(coin.code);
  const { symbol } = Helpers.Coin.GetCurrentCoin(coin.code);
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
        <div className={classnames(styles.value)}>
          <div className={classnames(styles.zx, Utils.GetValueColor(coin.change24h).textClass)}>
            {coin.price}
            <ArrowLine value={coin.change24h} />
          </div>
          {!conciseSetting && (
            <div className={styles.zd}>
              <div className={classnames(styles.zdf, Utils.GetValueColor(coin.change24h).textClass)}>{Utils.Yang(coin.change24h)} %</div>
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
              <span className={classnames(Utils.GetValueColor(coin.change24h).textClass)}>{Utils.Yang(coin.change24h)} %</span>
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
