import React, { useState } from 'react';
import { useBoolean } from 'ahooks';
import classnames from 'classnames';
import { useRequest } from 'ahooks';
import { Tabs } from 'antd';

import CustomDrawer from '@/components/CustomDrawer';
import Estimate from '@/components/Home/FundList/DetailFundContent/Estimate';
import Performance from '@/components/Home/FundList/DetailFundContent/Performance';
import HistoryPerformance from '@/components/Home/FundList/DetailFundContent/HistoryPerformance';
import HistoryValue from '@/components/Home/FundList/DetailFundContent/HistoryValue';
import StockWareHouse from '@/components/Home/FundList/DetailFundContent/StockWareHouse';
import SecuritiesWareHouse from '@/components/Home/FundList/DetailFundContent/SecuritiesWareHouse';
import SimilarRank from '@/components/Home/FundList/DetailFundContent/SimilarRank';
import SimilarProportion from '@/components/Home/FundList/DetailFundContent/SimilarProportion';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import SameFundList from '@/components/Home/FundList/DetailFundContent/SameFundList';
import FundManagerContent from '@/components/Home/FundList/FundManagerContent';
import * as Services from '@/services';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';
import styles from './index.scss';

export interface DetailFundContentProps {
  onEnter: () => void;
  onClose: () => void;
  code: string;
}

const DetailFundContent: React.FC<DetailFundContentProps> = (props) => {
  const { code } = props;
  const [fund, setFund] = useState<Fund.FixData>({});
  const [pingzhongdata, setPingzhongdata] = useState<
    Fund.PingzhongData | Record<string, any>
  >({});

  const [
    showManagerDrawer,
    {
      setTrue: openManagerDrawer,
      setFalse: closeManagerDrawer,
      toggle: ToggleManagerDrawer,
    },
  ] = useBoolean(false);

  useRequest(Services.Fund.GetFixFromEastMoney, {
    throwOnError: true,
    defaultParams: [code],
    onSuccess: setFund,
  });

  useRequest(Services.Fund.GetFundDetailFromEastmoney, {
    throwOnError: true,
    defaultParams: [code],
    onSuccess: setPingzhongdata,
  });

  return (
    <CustomDrawerContent
      title="基金详情"
      enterText="确定"
      onClose={props.onClose}
      onEnter={props.onEnter}
    >
      <div className={styles.content}>
        <div className={styles.container}>
          <h3>{fund?.fixName}</h3>
          <div className={styles.subTitleRow}>
            <span>{fund?.code}</span>
            <span>
              基金经理：
              <a onClick={openManagerDrawer}>
                {pingzhongdata.Data_currentFundManager?.[0]?.name}
              </a>
            </span>
          </div>
          <div className={styles.detail}>
            <div className={styles.detailItem}>
              <div
                className={classnames(
                  styles.syl_1n,
                  Number(pingzhongdata.syl_1n) >= 0 ? 'text-up' : 'text-down'
                )}
              >
                {Utils.Yang(pingzhongdata.syl_1n)}%
              </div>
              <div className={styles.detailItemLabel}>近一年涨跌幅</div>
            </div>
            <div className={styles.detailItem}>
              <div
                className={classnames(
                  Number(fund?.fixZzl) >= 0 ? 'text-up' : 'text-down'
                )}
              >
                {Utils.Yang(fund?.fixZzl)}%
              </div>
              <div className={styles.detailItemLabel}>日涨跌幅</div>
            </div>
            <div className={styles.detailItem}>
              <div>{fund?.fixDwjz}</div>
              <div className={styles.detailItemLabel}>净值 {fund?.fixDate}</div>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <Tabs
            defaultActiveKey={String(Enums.TrendType.Performance)}
            animated={{ tabPane: true }}
            tabBarGutter={15}
          >
            <Tabs.TabPane tab="历史业绩" key={Enums.TrendType.Performance}>
              <HistoryPerformance
                syl_6y={pingzhongdata.syl_6y}
                syl_3y={pingzhongdata.syl_3y}
                syl_1y={pingzhongdata.syl_1y}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="历史净值" key={Enums.TrendType.Estimate}>
              <HistoryValue data={pingzhongdata.Data_netWorthTrend} />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs
            defaultActiveKey={String(Enums.HistoryType.Performance)}
            animated={{ tabPane: true }}
            tabBarGutter={15}
          >
            <Tabs.TabPane tab="业绩走势" key={Enums.HistoryType.Performance}>
              <Performance code={code} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="净值估算" key={Enums.HistoryType.Value}>
              <Estimate code={code} />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs
            defaultActiveKey={String(Enums.WareHouseType.Stock)}
            animated={{ tabPane: true }}
            tabBarGutter={15}
          >
            <Tabs.TabPane tab="股票持仓" key={Enums.WareHouseType.Stock}>
              <StockWareHouse
                code={code}
                stockCodes={pingzhongdata.stockCodesNew!}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="债券持仓" key={Enums.WareHouseType.Securities}>
              <SecuritiesWareHouse
                code={code}
                securitiesCodes={pingzhongdata.zqCodesNew!}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs
            defaultActiveKey={String(Enums.SimilarCompareType.Rank)}
            animated={{ tabPane: true }}
            tabBarGutter={15}
          >
            <Tabs.TabPane tab="同类排名" key={Enums.SimilarCompareType.Rank}>
              <SimilarRank
                rateInSimilarType={pingzhongdata.Data_rateInSimilarType}
              />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab="百分比排名"
              key={Enums.SimilarCompareType.Proportion}
            >
              <SimilarProportion
                rateInSimilarPersent={pingzhongdata.Data_rateInSimilarPersent}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div>
          <Tabs
            defaultActiveKey={String(0)}
            animated={{ tabPane: true }}
            tabBarGutter={15}
            tabBarStyle={{ marginLeft: 15 }}
          >
            <Tabs.TabPane tab="同类型基金涨幅榜" key={0}>
              <SameFundList swithSameType={pingzhongdata.swithSameType} />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
      <CustomDrawer show={showManagerDrawer}>
        <FundManagerContent
          onEnter={closeManagerDrawer}
          onClose={closeManagerDrawer}
          manager={pingzhongdata.Data_currentFundManager?.[0]}
        />
      </CustomDrawer>
    </CustomDrawerContent>
  );
};
export default DetailFundContent;
