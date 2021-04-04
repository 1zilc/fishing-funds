import React, { useState } from 'react';
import { useBoolean } from 'ahooks';
import classnames from 'classnames';
import { useRequest } from 'ahooks';
import { Tabs } from 'antd';

import Trend from '@/components/Home/ZindexList/DetailZindexContent/Trend';
import K from '@/components/Home/ZindexList/DetailZindexContent/K';
import CustomDrawerContent from '@/components/CustomDrawer/Content';

import * as Services from '@/services';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';
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
            <div className={styles.detailItem}>
              <div
                className={classnames(
                  Number(zindex.zdf) < 0 ? 'text-down' : 'text-up'
                )}
              >
                {Utils.Yang(zindex.zdf)}%
              </div>
              <div className={styles.detailItemLabel}>涨跌幅</div>
            </div>
            <div className={styles.detailItem}>
              <div className={classnames('text-center')}>{zindex.hs}%</div>
              <div className={styles.detailItemLabel}>换手率</div>
            </div>
            <div className={styles.detailItem}>
              <div className={classnames('text-center')}>{zindex.zf}%</div>
              <div className={styles.detailItemLabel}>振幅</div>
            </div>
          </div>
          <div className={styles.detail}>
            <div className={styles.detailItem}>
              <div
                className={classnames(
                  zindex.jk < zindex.zs ? 'text-down' : 'text-up'
                )}
              >
                {Utils.Yang(zindex.jk)}
              </div>
              <div className={styles.detailItemLabel}>今开</div>
            </div>
            <div className={styles.detailItem}>
              <div className={classnames('text-up', 'text-center')}>
                {zindex.zg}
              </div>
              <div className={styles.detailItemLabel}>最高</div>
            </div>
            <div className={styles.detailItem}>
              <div className={classnames('text-down', 'text-center')}>
                {zindex.zd}
              </div>
              <div className={styles.detailItemLabel}>最低</div>
            </div>
          </div>
          <div className={styles.detail}>
            <div className={styles.detailItem}>
              <div className={classnames('text-center')}>{zindex.zs}</div>
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
            <Tabs.TabPane tab="指数走势" key={0}>
              <Trend code={code} />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs
            defaultActiveKey={String(0)}
            animated={{ tabPane: true }}
            tabBarGutter={15}
          >
            <Tabs.TabPane tab="K线" key={0}>
              <K code={code} />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </CustomDrawerContent>
  );
};
export default DetailZindexContent;
