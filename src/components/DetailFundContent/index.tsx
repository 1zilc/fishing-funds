import React, { useState } from 'react';
import classnames from 'classnames';
import { useRequest } from 'ahooks';
import { Tabs } from 'antd';

import Estimate from '@/components/DetailFundContent/Estimate';
import Performance from '@/components/DetailFundContent/Performance';
import StockWareHouse from '@/components/DetailFundContent/StockWareHouse';
import SecuritiesWareHouse from '@/components/DetailFundContent/SecuritiesWareHouse';
import CustomDrawerContent from '@/components/CustomDrawer/Content';

import * as Services from '@/services';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';
import styles from './index.scss';

export interface DetailFundContentProps {
  onEnter: () => void;
  onClose: () => void;
  fund: Fund.ResponseItem;
}

const DetailFundContent: React.FC<DetailFundContentProps> = (props) => {
  const { fund } = props;
  const [pingzhongdata, setPingzhongdata] = useState<Fund.PingzhongData>({});

  useRequest(Services.Fund.GetFundDetailFromEastmoney, {
    defaultParams: [fund.fundcode],
    onSuccess: (result) => {
      setPingzhongdata(result);
    },
  });

  return (
    <CustomDrawerContent
      title="基金详情"
      enterText="确定"
      onClose={props.onClose}
      onEnter={props.onEnter}
    >
      <div className={styles.content}>
        <h3>{fund.name}</h3>
        <div>{fund.fundcode}</div>
        <div className={styles.detail}>
          <div className={styles.detailItem}>
            <div
              className={classnames(
                styles.syl_1n,
                Number(pingzhongdata.syl_1n) >= 0 ? 'up-text' : 'down-text'
              )}
            >
              {Utils.Yang(pingzhongdata.syl_1n)}%
            </div>
            <div className={styles.detailItemLabel}>近一年涨跌幅</div>
          </div>
          <div className={styles.detailItem}>
            <div
              className={classnames(
                Number(fund.gszzl) >= 0 ? 'up-text' : 'down-text'
              )}
            >
              {Utils.Yang(fund.gszzl)}%
            </div>
            <div className={styles.detailItemLabel}>日涨跌幅</div>
          </div>
          <div className={styles.detailItem}>
            <div>{fund.dwjz}</div>
            <div className={styles.detailItemLabel}>
              净值 {fund.jzrq.slice(5)}
            </div>
          </div>
        </div>
        <div>
          <Tabs
            defaultActiveKey={String(Enums.TrendType.Performance)}
            animated={{ tabPane: true }}
            tabBarGutter={15}
          >
            <Tabs.TabPane tab="业绩走势" key={Enums.TrendType.Performance}>
              <Performance code={fund.fundcode} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="净值估算" key={Enums.TrendType.Estimate}>
              <Estimate code={fund.fundcode} />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div>
          <Tabs
            defaultActiveKey={String(Enums.WareHouseType.Stock)}
            animated={{ tabPane: true }}
            tabBarGutter={15}
          >
            <Tabs.TabPane tab="股票持仓" key={Enums.WareHouseType.Stock}>
              <StockWareHouse code={fund.fundcode} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="证券持仓" key={Enums.WareHouseType.Securities}>
              {/* <Estimate code={fund.fundcode} /> */}
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </CustomDrawerContent>
  );
};
export default DetailFundContent;
