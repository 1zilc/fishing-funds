import React, { useState } from 'react';
import { useBoolean } from 'ahooks';
import classnames from 'classnames';
import { useRequest } from 'ahooks';
import { Tabs } from 'antd';

import ChartCard from '@/components/Card/ChartCard';
import CustomDrawer from '@/components/CustomDrawer';
import Estimate from '@/components/Home/FundList/DetailFundContent/Estimate';
import Performance from '@/components/Home/FundList/DetailFundContent/Performance';
import HistoryPerformance from '@/components/Home/FundList/DetailFundContent/HistoryPerformance';
import HistoryValue from '@/components/Home/FundList/DetailFundContent/HistoryValue';
import StockWareHouse from '@/components/Home/FundList/DetailFundContent/StockWareHouse';
import SecuritiesWareHouse from '@/components/Home/FundList/DetailFundContent/SecuritiesWareHouse';
import StockWareHouseEstimate from '@/components/Home/FundList/DetailFundContent/StockWareHouseEstimate';
import Scale from '@/components/Home/FundList/DetailFundContent/Scale';
import Hold from '@/components/Home/FundList/DetailFundContent/Hold';
import Assets from '@/components/Home/FundList/DetailFundContent/Assets';
import SimilarRank from '@/components/Home/FundList/DetailFundContent/SimilarRank';
import SimilarProportion from '@/components/Home/FundList/DetailFundContent/SimilarProportion';
import PerformanceEvaluation from '@/components/Home/FundList/DetailFundContent/PerformanceEvaluation';
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
  const [fund, setFund] = useState<Fund.FixData | Record<string, any>>({});
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
    cacheKey: `GetFixFromEastMoney/${code}`,
  });

  useRequest(Services.Fund.GetFundDetailFromEastmoney, {
    throwOnError: true,
    defaultParams: [code],
    onSuccess: setPingzhongdata,
    cacheKey: `GetFundDetailFromEastmoney/${code}`,
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
                  Number(pingzhongdata.syl_1n) < 0 ? 'text-down' : 'text-up'
                )}
              >
                {Utils.Yang(pingzhongdata.syl_1n)}%
              </div>
              <div className={styles.detailItemLabel}>近一年涨跌幅</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-center')}>
              <div
                className={classnames(
                  Number(fund?.fixZzl) < 0 ? 'text-down' : 'text-up'
                )}
              >
                {Utils.Yang(fund?.fixZzl)}%
              </div>
              <div className={styles.detailItemLabel}>日涨跌幅</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-center')}>
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
            <Tabs.TabPane
              tab="历史业绩"
              key={String(Enums.TrendType.Performance)}
            >
              <ChartCard auto>
                <HistoryPerformance
                  syl_1n={pingzhongdata.syl_1n}
                  syl_6y={pingzhongdata.syl_6y}
                  syl_3y={pingzhongdata.syl_3y}
                  syl_1y={pingzhongdata.syl_1y}
                  data={pingzhongdata.Data_netWorthTrend}
                />
              </ChartCard>
            </Tabs.TabPane>
            <Tabs.TabPane tab="历史净值" key={String(Enums.TrendType.Estimate)}>
              <ChartCard auto>
                <HistoryValue data={pingzhongdata.Data_netWorthTrend} />{' '}
              </ChartCard>
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs
            defaultActiveKey={String(Enums.HistoryType.Performance)}
            animated={{ tabPane: true }}
            tabBarGutter={15}
          >
            <Tabs.TabPane
              tab="业绩走势"
              key={String(Enums.HistoryType.Performance)}
            >
              <ChartCard>
                <Performance code={code} />
              </ChartCard>
            </Tabs.TabPane>
            <Tabs.TabPane tab="净值估算" key={String(Enums.HistoryType.Value)}>
              <ChartCard>
                <Estimate code={code} />
              </ChartCard>
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs
            defaultActiveKey={String(Enums.WareHouseType.Stock)}
            animated={{ tabPane: true }}
            tabBarGutter={15}
          >
            <Tabs.TabPane
              tab="股票持仓"
              key={String(Enums.WareHouseType.Stock)}
            >
              <ChartCard>
                <StockWareHouse
                  code={code}
                  stockCodes={pingzhongdata.stockCodesNew!}
                />
              </ChartCard>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab="债券持仓"
              key={String(Enums.WareHouseType.Securities)}
            >
              <ChartCard>
                <SecuritiesWareHouse
                  code={code}
                  securitiesCodes={pingzhongdata.zqCodesNew!}
                />
              </ChartCard>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab="股票仓位测算"
              key={String(Enums.WareHouseType.StockEstimate)}
            >
              <ChartCard>
                <StockWareHouseEstimate
                  fundSharesPositions={pingzhongdata.Data_fundSharesPositions!}
                />
              </ChartCard>
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs
            defaultActiveKey={String(Enums.ConfigType.Assets)}
            animated={{ tabPane: true }}
            tabBarGutter={15}
          >
            <Tabs.TabPane tab="资产配置" key={String(Enums.ConfigType.Assets)}>
              <ChartCard>
                <Assets
                  Data_assetAllocation={pingzhongdata.Data_assetAllocation}
                />
              </ChartCard>
            </Tabs.TabPane>
            <Tabs.TabPane tab="持有人结构" key={String(Enums.ConfigType.Hold)}>
              <ChartCard>
                <Hold
                  Data_holderStructure={pingzhongdata.Data_holderStructure}
                />
              </ChartCard>
            </Tabs.TabPane>
            <Tabs.TabPane tab="规模变动" key={String(Enums.ConfigType.Scale)}>
              <ChartCard>
                <Scale
                  Data_fluctuationScale={pingzhongdata.Data_fluctuationScale}
                />
              </ChartCard>
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs
            defaultActiveKey={String(Enums.SimilarCompareType.Rank)}
            animated={{ tabPane: true }}
            tabBarGutter={15}
          >
            <Tabs.TabPane
              tab="同类排名"
              key={String(Enums.SimilarCompareType.Rank)}
            >
              <ChartCard>
                <SimilarRank
                  rateInSimilarType={pingzhongdata.Data_rateInSimilarType}
                />
              </ChartCard>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab="百分比排名"
              key={String(Enums.SimilarCompareType.Proportion)}
            >
              <ChartCard>
                <SimilarProportion
                  rateInSimilarPersent={pingzhongdata.Data_rateInSimilarPersent}
                />
              </ChartCard>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab="业绩评价"
              key={String(Enums.SimilarCompareType.Evaluation)}
            >
              <ChartCard>
                <PerformanceEvaluation
                  Data_performanceEvaluation={
                    pingzhongdata.Data_performanceEvaluation
                  }
                />
              </ChartCard>
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
            <Tabs.TabPane tab="同类型基金涨幅榜" key={String(0)}>
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
