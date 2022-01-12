import React, { useState, useRef, useCallback } from 'react';
import classnames from 'classnames';
import { useScroll, useRequest } from 'ahooks';
import { Tabs } from 'antd';

import ChartCard from '@/components/Card/ChartCard';
import Trend from '@/components/Home/CoinList/DetailCoinContent/Trend';
import K from '@/components/Home/CoinList/DetailCoinContent/K';
import Appraise from '@/components/Home/CoinList/DetailCoinContent/Appraise';
import Sentiment from '@/components/Home/CoinList/DetailCoinContent/Sentiment';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import * as Services from '@/services';

import styles from './index.module.scss';

export interface DetailCoinContentProps {
  onEnter: () => void;
  onClose: () => void;
  code: string;
}

const DetailCoinContent: React.FC<DetailCoinContentProps> = (props) => {
  const { code } = props;
  const [coin, setCoin] = useState<Coin.DetailItem | null>(null);
  const ref = useRef(null);
  const position = useScroll(ref, (val) => val.top <= 520);
  const miniMode = position && position.top > 40;

  const { run: runGetDetailFromCoingecko } = useRequest(Services.Coin.GetDetailFromCoingecko, {
    pollingInterval: 1000 * 60,
    defaultParams: [code],
    onSuccess: setCoin,
  });

  const freshDetail = useCallback(() => {
    runGetDetailFromCoingecko(code);
  }, [code]);

  return (
    <CustomDrawerContent title="货币详情" enterText="确定" onClose={props.onClose} onEnter={props.onEnter}>
      <div className={styles.content} ref={ref}>
        <div className={classnames(styles.avatarContent)} style={{ backgroundImage: `url(${coin?.image.large})` }}>
          <div
            className={classnames(styles.avatar, {
              [styles.avatarMiniMode]: miniMode,
            })}
          >
            <img src={coin?.image.large} />
          </div>
        </div>
        <div className={styles.container}>
          <h3 className={styles.titleRow}>
            <span className="copify">{coin?.symbol.toUpperCase()}</span>
            <span>排名：{coin?.market_cap_rank}</span>
          </h3>
          <div className={styles.subTitleRow}>
            <span className="copify">{coin?.id}</span>
            <div>
              <span className={styles.detailItemLabel}>发行日期：</span>
              <span>{coin?.genesis_date}</span>
            </div>
          </div>
          <div className={styles.detail}>
            <div className={classnames(styles.detailItem, 'text-left')}>
              <div>{coin?.country_origin || '无'}</div>
              <div className={styles.detailItemLabel}>起源国家</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-center')}>
              <div>{coin?.hashing_algorithm || '无'}</div>
              <div className={styles.detailItemLabel}>hash算法</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-right')}>
              <div>{coin?.block_time_in_minutes}分钟</div>
              <div className={styles.detailItemLabel}>区块时间</div>
            </div>
          </div>
          <div className={styles.detail}>
            <div className={classnames(styles.detailItem, 'text-left')}>
              <div>{coin?.public_interest_score || '无'}</div>
              <div className={styles.detailItemLabel}>趣味得分</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-center')}> </div>
            <div className={classnames(styles.detailItem, 'text-right')}> </div>
          </div>
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="近期走势" key={String(0)}>
              <Trend code={code} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="货币评估" key={String(1)}>
              <ChartCard onFresh={freshDetail}>
                <Appraise
                  data={[coin?.coingecko_score || 0, coin?.developer_score || 0, coin?.community_score || 0, coin?.liquidity_score || 0]}
                />
              </ChartCard>
            </Tabs.TabPane>
            <Tabs.TabPane tab="大众趋势" key={String(2)}>
              <ChartCard onFresh={freshDetail}>
                <Sentiment up={coin?.sentiment_votes_up_percentage} down={coin?.sentiment_votes_down_percentage} />
              </ChartCard>
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="K线" key={String(0)}>
              <K code={code} />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </CustomDrawerContent>
  );
};
export default DetailCoinContent;
