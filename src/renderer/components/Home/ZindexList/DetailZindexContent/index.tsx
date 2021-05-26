import React, { useState } from 'react';
import classnames from 'classnames';
import { useRequest } from 'ahooks';
import { Tabs } from 'antd';

import ChartCard from '@/components/Card/ChartCard';
import Trend from '@/components/Home/ZindexList/DetailZindexContent/Trend';
import K from '@/components/Home/ZindexList/DetailZindexContent/K';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import * as Services from '@/services';
import * as Utils from '@/utils';

import styles from './index.scss';

export interface DetailFundContentProps {
  onEnter: () => void;
  onClose: () => void;
  code: string;
}

const DetailZindexContent: React.FC<DetailFundContentProps> = (props) => {
  const { code } = props;
  const [zindex, setZindex] = useState<
    Zindex.ResponseItem | Record<string, any>
  >({});

  useRequest(Services.Zindex.FromEastmoney, {
    throwOnError: true,
    pollingInterval: 1000 * 60,
    defaultParams: [code],
    onSuccess: setZindex,
    cacheKey: `FromEastmoney/${code}`,
  });

  return (
    <CustomDrawerContent
      title="指数详情"
      enterText="确定"
      onClose={props.onClose}
      onEnter={props.onEnter}
    >
      <div className={styles.content}>
        <div className={styles.container}>
          <h3 className={styles.titleRow}>
            <span>{zindex?.name}</span>
            <span
              className={classnames(
                Number(zindex.zdd) < 0 ? 'text-down' : 'text-up'
              )}
            >
              {zindex?.zsz}
            </span>
          </h3>
          <div className={styles.subTitleRow}>
            <span>{zindex?.zindexCode}</span>
            <div>
              <span className={styles.detailItemLabel}>涨跌点：</span>
              <span
                className={classnames(
                  Number(zindex.zdd) < 0 ? 'text-down' : 'text-up'
                )}
              >
                {Utils.Yang(zindex?.zdd)}
              </span>
            </div>
          </div>
          <div className={styles.detail}>
            <div className={classnames(styles.detailItem, 'text-left')}>
              <div
                className={classnames(
                  Number(zindex.zdf) < 0 ? 'text-down' : 'text-up'
                )}
              >
                {Utils.Yang(zindex.zdf)}%
              </div>
              <div className={styles.detailItemLabel}>涨跌幅</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-center')}>
              <div>{zindex.hs}%</div>
              <div className={styles.detailItemLabel}>换手率</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-right')}>
              <div>{zindex.zf}%</div>
              <div className={styles.detailItemLabel}>振幅</div>
            </div>
          </div>
          <div className={styles.detail}>
            <div className={classnames(styles.detailItem, 'text-left')}>
              <div
                className={classnames(
                  zindex.jk < zindex.zs ? 'text-down' : 'text-up'
                )}
              >
                {Utils.Yang(zindex.jk)}
              </div>
              <div className={styles.detailItemLabel}>今开</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-center')}>
              <div className={classnames('text-up')}>{zindex.zg}</div>
              <div className={styles.detailItemLabel}>最高</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-right')}>
              <div className={classnames('text-down')}>{zindex.zd}</div>
              <div className={styles.detailItemLabel}>最低</div>
            </div>
          </div>
          <div className={styles.detail}>
            <div className={styles.detailItem}>
              <div className={''}>{zindex.zs}</div>
              <div className={styles.detailItemLabel}>昨收</div>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <Tabs
            defaultActiveKey={String(0)}
            animated={{ tabPane: true }}
            tabBarGutter={15}
          >
            <Tabs.TabPane tab="指数走势" key={String(0)}>
              <ChartCard>
                <Trend code={code} />
              </ChartCard>
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs
            defaultActiveKey={String(0)}
            animated={{ tabPane: true }}
            tabBarGutter={15}
          >
            <Tabs.TabPane tab="K线" key={String(0)}>
              <ChartCard>
                <K code={code} />
              </ChartCard>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </CustomDrawerContent>
  );
};
export default DetailZindexContent;
