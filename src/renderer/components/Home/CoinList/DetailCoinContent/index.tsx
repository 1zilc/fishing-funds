import React, { useState } from 'react';
import classnames from 'classnames';
import { useRequest } from 'ahooks';
import { Tabs } from 'antd';

import Trend from '@/components/Home/CoinList/DetailCoinContent/Trend';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import * as Services from '@/services';
import * as Utils from '@/utils';

import styles from './index.scss';

export interface DetailCoinContentProps {
  onEnter: () => void;
  onClose: () => void;
  code: string;
}

const DetailCoinContent: React.FC<DetailCoinContentProps> = (props) => {
  const { code } = props;
  const [coin, setCoin] = useState<Coin.ResponseItem | null>(null);

  useRequest(Services.Coin.GetFromCoinCap, {
    throwOnError: true,
    pollingInterval: 1000 * 60,
    defaultParams: [code],
    onSuccess: setCoin,
    cacheKey: `GetFromCoinCap/${code}`,
  });

  return (
    <CustomDrawerContent title="货币详情" enterText="确定" onClose={props.onClose} onEnter={props.onEnter}>
      <div className={styles.content}>
        <div className={styles.container}>
          <h3 className={styles.titleRow}>
            <span>{coin?.symbol}</span>
            <span className={classnames(Utils.GetValueColor(coin?.changePercent24Hr).textClass)}>{coin?.priceUsd}</span>
          </h3>
          <div className={styles.subTitleRow}>
            <span>{coin?.code}</span>
            <div>
              <span className={styles.detailItemLabel}>24H涨跌幅：</span>
              <span className={classnames(Utils.GetValueColor(coin?.changePercent24Hr).textClass)}>
                {Utils.Yang(coin?.changePercent24Hr)}%
              </span>
            </div>
          </div>
          <div className={styles.detail}>
            <div className={classnames(styles.detailItem, 'text-left')}>
              <div>{coin?.rank}</div>
              <div className={styles.detailItemLabel}>排名</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-center')}>
              <div>{coin?.marketCapUsd}亿</div>
              <div className={styles.detailItemLabel}>当前市值</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-right')}>
              <div>{coin?.volumeUsd24Hr}亿</div>
              <div className={styles.detailItemLabel}>24H交易量</div>
            </div>
          </div>
          <div className={styles.detail}>
            <div className={classnames(styles.detailItem, 'text-left')}>
              <div>{coin?.maxSupply ? `${coin?.maxSupply}万` : '无信息'}</div>
              <div className={styles.detailItemLabel}>总发行</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-center')}>
              <div>{coin?.supply}万</div>
              <div className={styles.detailItemLabel}>流通个数</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-right')}>{}</div>
          </div>
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="近期走势" key={String(0)}>
              <Trend code={code} />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </CustomDrawerContent>
  );
};
export default DetailCoinContent;
