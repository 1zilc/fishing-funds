import React, { useState } from 'react';
import classnames from 'classnames';
import { useRequest } from 'ahooks';
import { Tabs } from 'antd';

import ChartCard from '@/components/Card/ChartCard';
import Trend from '@/components/Home/StockList/DetailStockContent/Trend';
import Estimate from '@/components/Home/StockList/DetailStockContent/Estimate';
import K from '@/components/Home/ZindexList/DetailZindexContent/K';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import * as Services from '@/services';
import * as Utils from '@/utils';

import styles from './index.scss';

export interface DetailStockContentProps {
  onEnter: () => void;
  onClose: () => void;
  secid: string;
}

const DetailStockContent: React.FC<DetailStockContentProps> = (props) => {
  const { secid } = props;
  const [stock, setStock] = useState<Stock.DetailItem | Record<string, any>>(
    {}
  );

  useRequest(Services.Stock.GetDetailFromEastmoney, {
    throwOnError: true,
    pollingInterval: 1000 * 60,
    defaultParams: [secid],
    onSuccess: setStock,
    cacheKey: `GetDetailFromEastmoney/${secid}`,
  });

  return (
    <CustomDrawerContent
      title="股票详情"
      enterText="确定"
      onClose={props.onClose}
      onEnter={props.onEnter}
    >
      <div className={styles.content}>
        <div className={styles.container}>
          <h3 className={styles.titleRow}>
            <span>{stock.name}</span>
            <span
              className={classnames(Utils.GetValueColor(stock.zdd).textClass)}
            >
              {stock.zx}
            </span>
          </h3>
          <div className={styles.subTitleRow}>
            <span>{stock.code}</span>
            <div>
              <span className={styles.detailItemLabel}>涨跌点：</span>
              <span
                className={classnames(Utils.GetValueColor(stock.zdd).textClass)}
              >
                {Utils.Yang(stock.zdd)}
              </span>
            </div>
          </div>
          <div className={styles.detail}>
            <div className={classnames(styles.detailItem, 'text-left')}>
              <div
                className={classnames(Utils.GetValueColor(stock.zdf).textClass)}
              >
                {Utils.Yang(stock.zdf)}%
              </div>
              <div className={styles.detailItemLabel}>涨跌幅</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-center')}>
              <div>{stock.hs}%</div>
              <div className={styles.detailItemLabel}>换手率</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-right')}>
              <div>{stock.zss}万</div>
              <div className={styles.detailItemLabel}>总手数</div>
            </div>
          </div>
          <div className={styles.detail}>
            <div className={classnames(styles.detailItem, 'text-left')}>
              <div
                className={classnames(
                  Utils.GetValueColor(stock.jk - stock.zs).textClass
                )}
              >
                {Utils.Yang(stock.jk)}
              </div>
              <div className={styles.detailItemLabel}>今开</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-center')}>
              <div className={classnames('text-up')}>{stock.zg}</div>
              <div className={styles.detailItemLabel}>最高</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-right')}>
              <div className={classnames('text-down')}>{stock.zd}</div>
              <div className={styles.detailItemLabel}>最低</div>
            </div>
          </div>
          <div className={styles.detail}>
            <div className={classnames(styles.detailItem, 'text-left')}>
              <div>{stock.zs}</div>
              <div className={styles.detailItemLabel}>昨收</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-center')}>
              <div className={classnames('text-up')}>{stock.zt}</div>
              <div className={styles.detailItemLabel}>涨停</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-right')}>
              <div className={classnames('text-down')}>{stock.dt}</div>
              <div className={styles.detailItemLabel}>跌停</div>
            </div>
          </div>
          <div className={styles.detail}>
            <div className={classnames(styles.detailItem, 'text-left')}>
              <div>{stock.wp}万</div>
              <div className={styles.detailItemLabel}>外盘</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-center')}>
              <div>{stock.np}万</div>
              <div className={styles.detailItemLabel}>内盘</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-right')}>
              <div>{stock.jj}</div>
              <div className={styles.detailItemLabel}>均价</div>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <Tabs
            defaultActiveKey={String(0)}
            animated={{ tabPane: true }}
            tabBarGutter={15}
          >
            <Tabs.TabPane tab="股票走势" key={String(0)}>
              <ChartCard>
                <Trend secid={secid} zs={stock.zs} />
              </ChartCard>
            </Tabs.TabPane>
            <Tabs.TabPane tab="走势详情" key={String(1)}>
              <ChartCard>
                <Estimate secid={secid} />
              </ChartCard>
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          {/* <Tabs
            defaultActiveKey={String(0)}
            animated={{ tabPane: true }}
            tabBarGutter={15}
          >
            <Tabs.TabPane tab="K线" key={String(0)}>
              <ChartCard>
                <K code={code} />
              </ChartCard>
            </Tabs.TabPane>
          </Tabs> */}
        </div>
      </div>
    </CustomDrawerContent>
  );
};
export default DetailStockContent;
