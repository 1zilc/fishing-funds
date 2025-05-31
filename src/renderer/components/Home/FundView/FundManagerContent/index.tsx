import React, { useRef } from 'react';
import clsx from 'clsx';
import { Rate, Tabs } from 'antd';
import { useScroll, useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import PureCard from '@/components/Card/PureCard';
import Appraise from '@/components/Home/FundView/FundManagerContent/Appraise';
import Profit from '@/components/Home/FundView/FundManagerContent/Profit';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import ManageHistoryFundList from '@/components/Home/FundView/FundManagerContent/ManageHistoryFundList';
import * as Services from '@/services';
import * as Enums from '@/utils/enums';
import styles from './index.module.css';

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
  const { manager = {} as Fund.Manager.Info } = props;
  const ref = useRef(null);
  const position = useScroll(ref, (val) => val.top <= 520);
  const miniMode = position && position.top > 40;

  const {
    data: managerDetail = {
      manageHistoryFunds: [],
      description: '',
    },
  } = useRequest(Services.Fund.GetFundManagerDetailFromEastMoney, {
    defaultParams: [manager.id],
    ready: !!manager.id,
  });

  return (
    <CustomDrawerContent title="基金经理" onClose={props.onClose} onEnter={props.onEnter}>
      <div className={styles.content} ref={ref}>
        <div className={clsx(styles.avatarContent)} style={{ backgroundImage: `url(${manager.pic})` }}>
          <div
            className={clsx(styles.avatar, {
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
            animated={{ tabPane: true }}
            tabBarGutter={15}
            items={[
              {
                key: String(Enums.ManagerPowerType.Appraise),
                label: '能力评估',
                children: (
                  <ChartCard>
                    <Appraise power={manager.power} />
                  </ChartCard>
                ),
              },
              {
                key: String(Enums.ManagerPowerType.Profit),
                label: '收益统计',
                children: (
                  <ChartCard>
                    <Profit profit={manager.profit} />
                  </ChartCard>
                ),
              },
            ]}
          />
        </div>
        <div className={styles.container}>
          <Tabs
            animated={{ tabPane: true }}
            tabBarGutter={15}
            items={[
              {
                key: String(0),
                label: `${manager.name || ''}管理过的基金`,
                children: (
                  <PureCard>
                    <ManageHistoryFundList manageHistoryFunds={managerDetail.manageHistoryFunds} />
                  </PureCard>
                ),
              },
            ]}
          />
        </div>
      </div>
    </CustomDrawerContent>
  );
};
export default FundManagerContent;
