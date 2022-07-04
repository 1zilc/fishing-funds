import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import { useScroll, useRequest } from 'ahooks';
import { Tabs } from 'antd';

import ChartCard from '@/components/Card/ChartCard';
import Trend from '@/components/Home/CoinView/DetailCoinContent/Trend';
import K from '@/components/Home/CoinView/DetailCoinContent/K';
import Appraise from '@/components/Home/CoinView/DetailCoinContent/Appraise';
import Recent from '@/components/Home/NewsList/Recent';
import Sentiment from '@/components/Home/CoinView/DetailCoinContent/Sentiment';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import * as Services from '@/services';
import * as Utils from '@/utils';

import styles from './index.module.scss';

export interface DetailCoinProps {
  code: string;
}
export interface DetailCoinContentProps extends DetailCoinProps {
  onEnter: () => void;
  onClose: () => void;
}

const { ipcRenderer } = window.contextModules.electron;

export const DetailCoin: React.FC<DetailCoinProps> = (props) => {
  const { code } = props;
  const ref = useRef(null);
  const position = useScroll(ref, (val) => val.top <= 520);
  const miniMode = position && position.top > 40;

  const { data: coin, run: runGetDetailFromCoingecko } = useRequest(() => Services.Coin.GetDetailFromCoingecko(code), {
    pollingInterval: 1000 * 60,
    cacheKey: Utils.GenerateRequestKey('Coin.GetDetailFromCoingecko', code),
  });

  return (
    <div className={styles.content} ref={ref}>
      <div className={clsx(styles.avatarContent)} style={{ backgroundImage: `url(${coin?.image.large})` }}>
        <div
          className={clsx(styles.avatar, {
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
          <div className={clsx(styles.detailItem, 'text-left')}>
            <div>{coin?.country_origin || '无'}</div>
            <div className={styles.detailItemLabel}>起源国家</div>
          </div>
          <div className={clsx(styles.detailItem, 'text-center')}>
            <div>{coin?.hashing_algorithm || '无'}</div>
            <div className={styles.detailItemLabel}>hash算法</div>
          </div>
          <div className={clsx(styles.detailItem, 'text-right')}>
            <div>{coin?.block_time_in_minutes}分钟</div>
            <div className={styles.detailItemLabel}>区块时间</div>
          </div>
        </div>
        <div className={styles.detail}>
          <div className={clsx(styles.detailItem, 'text-left')}>
            <div>{coin?.public_interest_score || '无'}</div>
            <div className={styles.detailItemLabel}>趣味得分</div>
          </div>
          <div className={clsx(styles.detailItem, 'text-center')}> </div>
          <div className={clsx(styles.detailItem, 'text-right')}> </div>
        </div>
      </div>
      <div className={styles.container}>
        <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
          <Tabs.TabPane tab="近期走势" key={String(0)}>
            <Trend code={code} name={coin?.name} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="货币评估" key={String(1)}>
            <ChartCard onFresh={runGetDetailFromCoingecko}>
              <Appraise
                data={[coin?.coingecko_score || 0, coin?.developer_score || 0, coin?.community_score || 0, coin?.liquidity_score || 0]}
              />
            </ChartCard>
          </Tabs.TabPane>
          <Tabs.TabPane tab="大众趋势" key={String(2)}>
            <ChartCard onFresh={runGetDetailFromCoingecko}>
              <Sentiment up={coin?.sentiment_votes_up_percentage} down={coin?.sentiment_votes_down_percentage} />
            </ChartCard>
          </Tabs.TabPane>
          <Tabs.TabPane tab="近期资讯" key={String(3)}>
            <Recent keyword={coin?.symbol || ''} />
          </Tabs.TabPane>
        </Tabs>
      </div>
      <div className={styles.container}>
        <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
          <Tabs.TabPane tab="K线" key={String(0)}>
            <K code={code} name={coin?.name} />
          </Tabs.TabPane>
        </Tabs>
      </div>
      <div className={styles.container}>
        <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
          <Tabs.TabPane tab="货币描述" key={String(0)}>
            <ChartCard onFresh={runGetDetailFromCoingecko}>
              <div dangerouslySetInnerHTML={{ __html: coin?.description?.en?.replace(/<a/g, '<a target="_blank"') || '暂无信息' }}></div>
            </ChartCard>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

const DetailCoinContent: React.FC<DetailCoinContentProps> = (props) => {
  function onOpenChildWindow() {
    const search = Utils.MakeSearchParams({
      _nav: '/detail/coin',
      data: {
        code: props.code,
      },
    });
    ipcRenderer.invoke('open-child-window', { search });
    props.onEnter();
  }

  return (
    <CustomDrawerContent title="货币详情" enterText="多窗" onClose={props.onClose} onEnter={onOpenChildWindow}>
      <DetailCoin code={props.code} />
    </CustomDrawerContent>
  );
};
export default DetailCoinContent;
