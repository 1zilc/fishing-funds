import React, { useState, useMemo } from 'react';
import { useBoolean, useRequest } from 'ahooks';
import clsx from 'clsx';
import { Tabs, Rate } from 'antd';

import ChartCard from '@/components/Card/ChartCard';
import PureCard from '@/components/Card/PureCard';
import CustomDrawer from '@/components/CustomDrawer';
import ColorfulTags from '@/components/ColorfulTags';
import ExportTitleBar from '@/components/ExportTitleBar';
import Estimate from '@/components/Home/FundView/DetailFundContent/Estimate';
import InvestStyle from '@/components/Home/FundView/DetailFundContent/InvestStyle';
import Performance from '@/components/Home/FundView/DetailFundContent/Performance';
import HistoryPerformance from '@/components/Home/FundView/DetailFundContent/HistoryPerformance';
import HistoryValue from '@/components/Home/FundView/DetailFundContent/HistoryValue';
import StockWareHouse from '@/components/Home/FundView/DetailFundContent/StockWareHouse';
import SecuritiesWareHouse from '@/components/Home/FundView/DetailFundContent/SecuritiesWareHouse';
import StockWareHouseEstimate from '@/components/Home/FundView/DetailFundContent/StockWareHouseEstimate';
import Scale from '@/components/Home/FundView/DetailFundContent/Scale';
import Hold from '@/components/Home/FundView/DetailFundContent/Hold';
import Assets from '@/components/Home/FundView/DetailFundContent/Assets';
import SimilarRank from '@/components/Home/FundView/DetailFundContent/SimilarRank';
import SimilarProportion from '@/components/Home/FundView/DetailFundContent/SimilarProportion';
import PerformanceEvaluation from '@/components/Home/FundView/DetailFundContent/PerformanceEvaluation';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import SameFundList from '@/components/Home/FundView/DetailFundContent/SameFundList';
import IndustryLayout from '@/components/Home/FundView/DetailFundContent/IndustryLayout';
import WarehouseEvent from '@/components/Home/FundView/DetailFundContent/WarehouseEvent';
import Origin from '@/components/Home/FundView/DetailFundContent/Origin';
import Recent from '@/components/Home/NewsList/Recent';
import { useFundRating, useDrawer, useAppSelector } from '@/utils/hooks';
import * as Services from '@/services';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';
import styles from './index.module.scss';

const FundManagerContent = React.lazy(() => import('@/components/Home/FundView/FundManagerContent'));
const AddFundContent = React.lazy(() => import('@/components/Home/FundView/AddFundContent'));

export interface DetailFundContentProps {
  onEnter: () => void;
  onClose: () => void;
  code: string;
}

export const ContinuousTag: React.FC<{ values: number[] }> = ({ values = [] }) => {
  values.reverse();
  const up = values[0] > 0;
  const down = values[0] < 0;
  let maxUpDay = 0;
  let maxDownDay = 0;
  for (let i = 0; i < values.length; i++) {
    if (values[i] > 0) {
      maxUpDay++;
    } else {
      break;
    }
  }
  for (let i = 0; i < values.length; i++) {
    if (values[i] < 0) {
      maxDownDay++;
    } else {
      break;
    }
  }
  const maxDay = Math.max(maxDownDay, maxUpDay);

  if (up && maxDay >= 3) {
    return <span className={clsx(styles.continuous, 'text-up', 'boder-up')}>{maxUpDay}天 ↗</span>;
  }
  if (down && maxDay >= 3) {
    return <span className={clsx(styles.continuous, 'text-down', 'boder-down')}>{maxDownDay}天 ↘</span>;
  }
  return <></>;
};

export const ExceedTag: React.FC<{ value: number }> = ({ value }) => {
  if (value !== undefined) {
    return <span className={styles.exceed}>{`> ${value}%`}</span>;
  }
  return <></>;
};

export const TypeTag: React.FC<{ type?: string }> = ({ type }) => {
  if (type !== undefined) {
    return <span className={styles.type}>{type}</span>;
  }
  return <></>;
};

const DetailFundContent: React.FC<DetailFundContentProps> = (props) => {
  const { code } = props;
  const { star: fundStar, type: fundType } = useFundRating(code);
  const codeMap = useAppSelector((state) => state.wallet.fundConfigCodeMap);
  const { data: addCode, show: showAddDrawer, set: setAddDrawer, close: closeAddDrawer } = useDrawer(code);
  const [showManagerDrawer, { setTrue: openManagerDrawer, setFalse: closeManagerDrawer, toggle: ToggleManagerDrawer }] = useBoolean(false);

  const { data: fund = {} } = useRequest(() => Services.Fund.GetFixFromEastMoney(code));
  const { data: pingzhongdata = {} as Fund.PingzhongData | Record<string, any>, run: runGetFundDetailFromEastmoney } = useRequest(
    () => Services.Fund.GetFundDetailFromEastmoney(code),
    {
      refreshDeps: [code],
      cacheKey: Utils.GenerateRequestKey('Fund.GetFundDetailFromEastmoney', code),
      staleTime: CONST.DEFAULT.SWR_STALE_DELAY,
    }
  );
  const { data: industryData = { stocks: [], expansion: '' }, run: runGetIndustryRateFromEaseMoney } = useRequest(
    () => Services.Fund.GetIndustryRateFromEaseMoney(code),
    {
      refreshDeps: [code],
      cacheKey: Utils.GenerateRequestKey('Fund.GetIndustryRateFromEaseMoney', code),
      staleTime: CONST.DEFAULT.SWR_STALE_DELAY,
    }
  );

  const rateInSimilarPersent = pingzhongdata.Data_rateInSimilarPersent || [];
  const syl_1n = pingzhongdata.syl_1n || pingzhongdata.syl_6y || pingzhongdata.syl_3y || pingzhongdata.syl_1y;
  const industryTags = useMemo(() => Array.from(new Set(industryData.stocks.map((stock) => stock.INDEXNAME))), [industryData.stocks]);

  return (
    <CustomDrawerContent title="基金详情" enterText="确定" onClose={props.onClose} onEnter={props.onEnter}>
      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.titleRow}>
            <h3 className="copify">{fund?.fixName}</h3>
          </div>
          <div className={styles.subTitleRow}>
            <Rate allowHalf defaultValue={fundStar} disabled />
            <div className={styles.labels}>
              <TypeTag type={fundType} />
              <ExceedTag value={rateInSimilarPersent[rateInSimilarPersent.length - 1]?.[1]} />
              <ContinuousTag values={(pingzhongdata.Data_netWorthTrend || []).map(({ equityReturn }: any) => equityReturn)} />
            </div>
          </div>
          <div className={styles.subTitleRow}>
            <div>
              <span className="copify">{fund?.code}</span>
              {!codeMap[code] && (
                <a className={styles.selfAdd} onClick={() => setAddDrawer(code)}>
                  +加自选
                </a>
              )}
            </div>
            <div>
              <span>基金经理：</span>
              <a onClick={openManagerDrawer}>{pingzhongdata.Data_currentFundManager?.[0]?.name}</a>
            </div>
          </div>
          <div className={styles.detail}>
            <div className={styles.detailItem}>
              <div className={clsx(styles.syl_1n, Utils.GetValueColor(syl_1n).textClass)}>{Utils.Yang(syl_1n)}%</div>
              <div className={styles.detailItemLabel}>近一年涨跌幅</div>
            </div>
            <div className={clsx(styles.detailItem, 'text-center')}>
              <div className={clsx(Utils.GetValueColor(fund?.fixZzl).textClass)}>{Utils.Yang(fund?.fixZzl)}%</div>
              <div className={styles.detailItemLabel}>日涨跌幅</div>
            </div>
            <div className={clsx(styles.detailItem, 'text-center')}>
              <div>{fund?.fixDwjz}</div>
              <div className={styles.detailItemLabel}>净值 {fund?.fixDate}</div>
            </div>
          </div>
          <ColorfulTags tags={industryTags} />
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="历史业绩" key={String(0)}>
              <ChartCard
                auto
                onFresh={runGetFundDetailFromEastmoney}
                TitleBar={<ExportTitleBar name={fund?.fixName} data={pingzhongdata.Data_netWorthTrend} />}
              >
                <HistoryPerformance
                  syl_1n={pingzhongdata.syl_1n}
                  syl_6y={pingzhongdata.syl_6y}
                  syl_3y={pingzhongdata.syl_3y}
                  syl_1y={pingzhongdata.syl_1y}
                  data={pingzhongdata.Data_netWorthTrend}
                />
              </ChartCard>
            </Tabs.TabPane>
            <Tabs.TabPane tab="历史净值" key={String(1)}>
              <ChartCard
                auto
                onFresh={runGetFundDetailFromEastmoney}
                TitleBar={<ExportTitleBar name={fund?.fixName} data={pingzhongdata.Data_netWorthTrend} />}
              >
                <HistoryValue data={pingzhongdata.Data_netWorthTrend} />
              </ChartCard>
            </Tabs.TabPane>
            <Tabs.TabPane tab="近期资讯" key={String(2)}>
              <Recent keyword={fund?.fixName || ''} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="源网站" key={String(3)}>
              <ChartCard auto>
                <Origin code={code} />
              </ChartCard>
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="业绩走势" key={String(Enums.HistoryType.Performance)}>
              <Performance code={code} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="净值估算" key={String(Enums.HistoryType.Value)}>
              <Estimate code={code} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="投资风格" key={String(Enums.HistoryType.InvestStyle)}>
              <InvestStyle code={code} />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="股票持仓" key={String(Enums.WareHouseType.Stock)}>
              <StockWareHouse code={code} stockCodes={pingzhongdata.stockCodesNew!} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="债券持仓" key={String(Enums.WareHouseType.Securities)}>
              <SecuritiesWareHouse code={code} securitiesCodes={pingzhongdata.zqCodesNew!} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="行业布局" key={String(Enums.WareHouseType.IndustryLayout)}>
              <ChartCard onFresh={runGetIndustryRateFromEaseMoney} TitleBar={<div className={styles.date}>{industryData.expansion}</div>}>
                <IndustryLayout stocks={industryData.stocks} />
              </ChartCard>
            </Tabs.TabPane>
            <Tabs.TabPane tab="股票仓位测算" key={String(Enums.WareHouseType.StockEstimate)}>
              <ChartCard onFresh={runGetFundDetailFromEastmoney}>
                <StockWareHouseEstimate fundSharesPositions={pingzhongdata.Data_fundSharesPositions!} />
              </ChartCard>
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="资产配置" key={String(Enums.ConfigType.Assets)}>
              <ChartCard onFresh={runGetFundDetailFromEastmoney}>
                <Assets Data_assetAllocation={pingzhongdata.Data_assetAllocation} />
              </ChartCard>
            </Tabs.TabPane>
            <Tabs.TabPane tab="持有人结构" key={String(Enums.ConfigType.Hold)}>
              <ChartCard onFresh={runGetFundDetailFromEastmoney}>
                <Hold Data_holderStructure={pingzhongdata.Data_holderStructure} />
              </ChartCard>
            </Tabs.TabPane>
            <Tabs.TabPane tab="仓位变动" key={String(Enums.ConfigType.WareHouse)}>
              <ChartCard
                auto
                onFresh={runGetIndustryRateFromEaseMoney}
                TitleBar={<div className={styles.date}>{industryData.expansion}</div>}
              >
                <WarehouseEvent stocks={industryData.stocks} />
              </ChartCard>
            </Tabs.TabPane>
            <Tabs.TabPane tab="规模变动" key={String(Enums.ConfigType.Scale)}>
              <ChartCard onFresh={runGetFundDetailFromEastmoney}>
                <Scale Data_fluctuationScale={pingzhongdata.Data_fluctuationScale} />
              </ChartCard>
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="同类排名" key={String(Enums.SimilarCompareType.Rank)}>
              <ChartCard onFresh={runGetFundDetailFromEastmoney}>
                <SimilarRank rateInSimilarType={pingzhongdata.Data_rateInSimilarType} />
              </ChartCard>
            </Tabs.TabPane>
            <Tabs.TabPane tab="百分比排名" key={String(Enums.SimilarCompareType.Proportion)}>
              <ChartCard onFresh={runGetFundDetailFromEastmoney}>
                <SimilarProportion rateInSimilarPersent={pingzhongdata.Data_rateInSimilarPersent} />
              </ChartCard>
            </Tabs.TabPane>
            <Tabs.TabPane tab="业绩评价" key={String(Enums.SimilarCompareType.Evaluation)}>
              <ChartCard onFresh={runGetFundDetailFromEastmoney}>
                <PerformanceEvaluation Data_performanceEvaluation={pingzhongdata.Data_performanceEvaluation} />
              </ChartCard>
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="同类型基金涨幅榜" key={String(0)}>
              <PureCard>
                <SameFundList swithSameType={pingzhongdata.swithSameType} />
              </PureCard>
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
      <CustomDrawer show={showAddDrawer}>
        <AddFundContent defaultCode={addCode} onClose={closeAddDrawer} onEnter={closeAddDrawer} />
      </CustomDrawer>
    </CustomDrawerContent>
  );
};
export default DetailFundContent;
