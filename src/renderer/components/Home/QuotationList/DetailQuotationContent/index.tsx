import React, { useState } from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useRequest } from 'ahooks';
import { Tabs } from 'antd';

import RealTimeFundFlow from '@/components/Home/QuotationList/DetailQuotationContent/RealTimeFundFlow';
import AfterTimeFundFlow from '@/components/Home/QuotationList/DetailQuotationContent/AfterTimeFundFlow';
import Stocks from '@/components/Home/QuotationList/DetailQuotationContent/Stocks';
import Funds from '@/components/Home/QuotationList/DetailQuotationContent/Funds';
import RealTimeTransaction from '@/components/Home/QuotationList/DetailQuotationContent/RealTimeTransaction';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import { syncFavoriteQuotationMapAction } from '@/actions/quotation';
import { StoreState } from '@/reducers/types';
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
  const dispatch = useDispatch();
  const [quotation, setQuotation] = useState<Quotation.DetailData | Record<string, any>>({});
  const favoriteQuotationMap = useSelector((state: StoreState) => state.quotation.favoriteQuotationMap);
  const { conciseSetting } = useSelector((state: StoreState) => state.setting.systemSetting);
  const favorited = favoriteQuotationMap[quotation.code];

  useRequest(Services.Quotation.GetQuotationDetailFromEastmoney, {
    defaultParams: [code],
    onSuccess: setQuotation,
  });

  return (
    <CustomDrawerContent title="板块详情" enterText="确定" onClose={props.onClose} onEnter={props.onEnter}>
      <div className={styles.content}>
        <div className={styles.container}>
          <h3 className={styles.titleRow}>
            <span className="copify">{quotation?.name}</span>
            <span className={classnames(Utils.GetValueColor(quotation.zdd).textClass)}>{quotation?.zxj}</span>
          </h3>
          <div className={styles.subTitleRow}>
            <div>
              <span className="copify">{quotation?.code}</span>
              {favorited ? (
                <a className={styles.selfAdd} onClick={() => dispatch(syncFavoriteQuotationMapAction(quotation.code, false))}>
                  已关注
                </a>
              ) : (
                <a className={styles.selfAdd} onClick={() => dispatch(syncFavoriteQuotationMapAction(quotation.code, true))}>
                  未关注
                </a>
              )}
            </div>

            <div>
              <span className={styles.detailItemLabel}>最新价：</span>
              <span className={classnames(Utils.GetValueColor(quotation.zdd).textClass)}>{Utils.Yang(quotation?.zdd)}</span>
            </div>
          </div>
          <div className={styles.detail}>
            <div className={styles.detailItem}>
              <div className={classnames(styles.zdf, Utils.GetValueColor(quotation.zdd).textClass)}>{Utils.Yang(quotation.zdf)}%</div>
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
