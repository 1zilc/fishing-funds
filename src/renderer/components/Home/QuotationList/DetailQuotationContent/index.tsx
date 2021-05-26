import React, { useState } from 'react';
import classnames from 'classnames';
import { useRequest } from 'ahooks';
import { Tabs } from 'antd';

import ChartCard from '@/components/Card/ChartCard';
import RealTimeFundFlow from '@/components/Home/QuotationList/DetailQuotationContent/RealTimeFundFlow';
import AfterTimeFundFlow from '@/components/Home/QuotationList/DetailQuotationContent/AfterTimeFundFlow';
import StockList from '@/components/Home/QuotationList/DetailQuotationContent/StockList';
import RealTimeTransaction from '@/components/Home/QuotationList/DetailQuotationContent/RealTimeTransaction';
import CustomDrawerContent from '@/components/CustomDrawer/Content';

import * as Services from '@/services';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';
import styles from './index.scss';

export interface DetailQuotationContentProps {
  onEnter: () => void;
  onClose: () => void;
  code: string;
}

const DetailQuotationContent: React.FC<DetailQuotationContentProps> = (
  props
) => {
  const { code } = props;
  const [quotation, setQuotation] = useState<
    Quotation.DetailData | Record<string, any>
  >({});

  useRequest(Services.Quotation.GetQuotationDetailFromEastmoney, {
    throwOnError: true,
    defaultParams: [code],
    cacheKey: `GetQuotationDetailFromEastmoney/${code}`,
    onSuccess: setQuotation,
  });

  return (
    <CustomDrawerContent
      title="板块详情"
      enterText="确定"
      onClose={props.onClose}
      onEnter={props.onEnter}
    >
      <div className={styles.content}>
        <div className={styles.container}>
          <h3 className={styles.titleRow}>
            <span>{quotation?.name}</span>
            <span
              className={classnames(
                Number(quotation.zdd) < 0 ? 'text-down' : 'text-up'
              )}
            >
              {quotation?.zxj}
            </span>
          </h3>
          <div className={styles.subTitleRow}>
            <span>{quotation?.code}</span>
            <div>
              <span className={styles.detailItemLabel}>最新价：</span>
              <span
                className={classnames(
                  Number(quotation.zdd) < 0 ? 'text-down' : 'text-up'
                )}
              >
                {Utils.Yang(quotation?.zdd)}
              </span>
            </div>
          </div>
          <div className={styles.detail}>
            <div className={styles.detailItem}>
              <div
                className={classnames(
                  styles.zdf,
                  Number(quotation.zdf) < 0 ? 'text-down' : 'text-up'
                )}
              >
                {Utils.Yang(quotation.zdf)}%
              </div>
              <div className={styles.detailItemLabel}>涨跌幅</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-center')}>
              <div className={classnames('text-up')}>{quotation.szjs}</div>
              <div className={styles.detailItemLabel}>上涨家数</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-center')}>
              <div className={classnames('text-down')}>{quotation?.xdjs}</div>
              <div className={styles.detailItemLabel}>下跌家数</div>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <Tabs
            defaultActiveKey={String(Enums.FundFlowType.RealTime)}
            animated={{ tabPane: true }}
            tabBarGutter={15}
          >
            <Tabs.TabPane
              tab="实时资金流向"
              key={String(Enums.FundFlowType.RealTime)}
            >
              <ChartCard>
                <RealTimeFundFlow code={code} />
              </ChartCard>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab="盘后资金流向"
              key={String(Enums.FundFlowType.AfterTime)}
            >
              <ChartCard>
                <AfterTimeFundFlow code={code} />
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
            <Tabs.TabPane tab="实时成交分布" key={String(0)}>
              <ChartCard>
                <RealTimeTransaction code={code} />
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
            <Tabs.TabPane tab={`${quotation.name}个股`} key={String(0)}>
              <ChartCard auto>
                <StockList code={code} />
              </ChartCard>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </CustomDrawerContent>
  );
};
export default DetailQuotationContent;
