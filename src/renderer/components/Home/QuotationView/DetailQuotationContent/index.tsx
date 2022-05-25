import React from 'react';
import clsx from 'clsx';

import { useRequest } from 'ahooks';
import { Tabs } from 'antd';

import RealTimeFundFlow from '@/components/Home/QuotationView/DetailQuotationContent/RealTimeFundFlow';
import AfterTimeFundFlow from '@/components/Home/QuotationView/DetailQuotationContent/AfterTimeFundFlow';
import Stocks from '@/components/Home/QuotationView/DetailQuotationContent/Stocks';
import Funds from '@/components/Home/QuotationView/DetailQuotationContent/Funds';
import Recent from '@/components/Home/NewsList/Recent';
import RealTimeTransaction from '@/components/Home/QuotationView/DetailQuotationContent/RealTimeTransaction';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import { setFavoriteQuotationMapAction } from '@/store/features/quotation';

import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import * as Services from '@/services';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';
import styles from './index.module.scss';

export interface DetailQuotationContentProps {
  onEnter: () => void;
  onClose: () => void;
  code: string;
}

const DetailQuotationContent: React.FC<DetailQuotationContentProps> = (props) => {
  const { code } = props;
  const dispatch = useAppDispatch();
  const favoriteQuotationMap = useAppSelector((state) => state.quotation.favoriteQuotationMap);

  const { data: quotation = {} as Quotation.DetailData | Record<string, any> } = useRequest(
    Services.Quotation.GetQuotationDetailFromEastmoney,
    {
      defaultParams: [code],
    }
  );

  const favorited = favoriteQuotationMap[quotation.code];

  return (
    <CustomDrawerContent title="板块详情" enterText="确定" onClose={props.onClose} onEnter={props.onEnter}>
      <div className={styles.content}>
        <div className={styles.container}>
          <h3 className={styles.titleRow}>
            <span className="copify">{quotation?.name}</span>
            <span className={clsx(Utils.GetValueColor(quotation.zdd).textClass)}>{quotation?.zxj}</span>
          </h3>
          <div className={styles.subTitleRow}>
            <div>
              <span className="copify">{quotation?.code}</span>
              {favorited ? (
                <a className={styles.selfAdd} onClick={() => dispatch(setFavoriteQuotationMapAction(quotation.code, false))}>
                  已关注
                </a>
              ) : (
                <a className={styles.selfAdd} onClick={() => dispatch(setFavoriteQuotationMapAction(quotation.code, true))}>
                  未关注
                </a>
              )}
            </div>

            <div>
              <span className={styles.detailItemLabel}>最新价：</span>
              <span className={clsx(Utils.GetValueColor(quotation.zdd).textClass)}>{Utils.Yang(quotation?.zdd)}</span>
            </div>
          </div>
          <div className={styles.detail}>
            <div className={styles.detailItem}>
              <div className={clsx(styles.zdf, Utils.GetValueColor(quotation.zdd).textClass)}>{Utils.Yang(quotation.zdf)}%</div>
              <div className={styles.detailItemLabel}>涨跌幅</div>
            </div>
            <div className={clsx(styles.detailItem, 'text-center')}>
              <div className={clsx('text-up')}>{quotation.szjs}</div>
              <div className={styles.detailItemLabel}>上涨家数</div>
            </div>
            <div className={clsx(styles.detailItem, 'text-center')}>
              <div className={clsx('text-down')}>{quotation?.xdjs}</div>
              <div className={styles.detailItemLabel}>下跌家数</div>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="实时资金流向" key={String(Enums.FundFlowType.RealTime)}>
              <RealTimeFundFlow code={code} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="盘后资金流向" key={String(Enums.FundFlowType.AfterTime)}>
              <AfterTimeFundFlow code={code} />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="实时成交分布" key={String(0)}>
              <RealTimeTransaction code={code} />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="近期资讯" key={String(0)}>
              <Recent keyword={quotation.name} />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="主题基金" key={String(0)}>
              <Funds code={code} />
            </Tabs.TabPane>
            <Tabs.TabPane tab={`${quotation.name}个股`} key={String(1)}>
              <Stocks code={code} />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </CustomDrawerContent>
  );
};
export default DetailQuotationContent;
