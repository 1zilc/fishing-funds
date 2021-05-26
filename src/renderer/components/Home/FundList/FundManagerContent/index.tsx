import React, { useRef, useState } from 'react';
import classnames from 'classnames';
import { Rate, Tabs } from 'antd';
import { useScroll, useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import Appraise from '@/components/Home/FundList/FundManagerContent/Appraise';
import Profit from '@/components/Home/FundList/FundManagerContent/Profit';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import ManageHistoryFundList from '@/components/Home/FundList/FundManagerContent/ManageHistoryFundList';
import * as Services from '@/services';
import * as Enums from '@/utils/enums';
import styles from './index.scss';

export interface FundManagerContentProps {
  onEnter: () => void;
  onClose: () => void;
  manager: Fund.Manager.Info;
}

export interface ManagerDetail {
  manageHistoryFunds: Fund.Manager.ManageHistoryFund[];
  description: string;
}

const FundManagerContent: React.FC<FundManagerContentProps> = (props) => {
  const { manager } = props;
  const ref = useRef(null);
  const position = useScroll(ref, (val) => val.top <= 400);
  const miniMode = position.top > 40;
  const [managerDetail, setManagerDetail] = useState<ManagerDetail>({
    manageHistoryFunds: [],
    description: '',
  });

  useRequest(Services.Fund.GetFundManagerDetailFromEastMoney, {
    throwOnError: true,
    defaultParams: [manager.id],
    cacheKey: `GetFundManagerDetailFromEastMoney/${manager.id}`,
    onSuccess: setManagerDetail,
  });

  return (
    <CustomDrawerContent
      title="基金经理"
      onClose={props.onClose}
      onEnter={props.onEnter}
    >
      <div className={styles.content} ref={ref}>
        <div
          className={classnames(styles.avatarContent)}
          style={{ backgroundImage: `url(${manager.pic})` }}
        >
          <div
            className={classnames(styles.avatar, {
              [styles.avatarMiniMode]: miniMode,
            })}
          >
            <img src={manager.pic} />
          </div>
        </div>
        <div className={styles.detailContent}>
          <div className={styles.header}>
            <div className={styles.name}>{manager.name}</div>
            <Rate disabled className={styles.star} value={manager.star} />
          </div>
          <div className={styles.item}>
            <label>经理简介：</label>
            <div>{managerDetail.description}</div>
          </div>
          <div className={styles.item}>
            <label>累计任职时间：</label>
            <span>{manager.workTime}</span>
          </div>
          <div className={styles.item}>
            <label>现任基金资产规模：</label>
            <span>{manager.fundSize}</span>
          </div>
        </div>
        <div className={styles.container}>
          <Tabs
            defaultActiveKey={String(Enums.ManagerPowerType.Appraise)}
            animated={{ tabPane: true }}
            tabBarGutter={15}
          >
            <Tabs.TabPane
              tab="能力评估"
              key={String(Enums.ManagerPowerType.Appraise)}
            >
              <ChartCard>
                <Appraise power={manager.power} />
              </ChartCard>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab="收益统计"
              key={String(Enums.ManagerPowerType.Profit)}
            >
              <ChartCard>
                <Profit profit={manager.profit} />
              </ChartCard>
            </Tabs.TabPane>
          </Tabs>
        </div>
        <Tabs
          defaultActiveKey={String(0)}
          animated={{ tabPane: true }}
          tabBarGutter={15}
          tabBarStyle={{ marginLeft: 15 }}
        >
          <Tabs.TabPane tab={`${manager.name || ''}管理过的基金`} key={0}>
            <ManageHistoryFundList
              manageHistoryFunds={managerDetail.manageHistoryFunds}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </CustomDrawerContent>
  );
};
export default FundManagerContent;
