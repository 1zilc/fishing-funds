import React, { useEffect, useState, createContext, useMemo } from 'react';
import { Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRequest } from 'ahooks';

import FundRow from '@/components/FundRow';
import ZindexRow from '@/components/ZindexRow';
import Toolbar from '@/components/Toolbar';
import Wallet from '@/components/Wallet/index';
import LoadingBar from '@/components/LoadingBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SortBar from '@/components/SortBar';
import TabsBar from '@/components/TabsBar';

import { updateUpdateTime } from '@/actions/wallet';
import { getFunds, getFundConfig } from '@/actions/fund';
import { getZindexs } from '@/actions/zindex';
import { getSystemSetting } from '@/actions/setting';
import { getSortMode } from '@/actions/sort';
import { StoreState } from '@/reducers/types';
import { calcFund } from '@/actions/fund';
import { getZindexConfig } from '@/actions/zindex';
import { useWorkDayTimeToDo } from '@/utils/hooks';

import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import styles from './index.scss';
import dayjs from 'dayjs';

export interface HomeProps {}

export interface HomeContextType {
  funds: (Fund.ResponseItem & Fund.ExtraRow)[];
  setFunds: React.Dispatch<
    React.SetStateAction<(Fund.ResponseItem & Fund.ExtraRow)[]>
  >;
  freshFunds: () => Promise<void>;
  sortFunds: (responseFunds?: Fund.ResponseItem[]) => void;

  zindexs: (Zindex.ResponseItem & Zindex.ExtraRow)[];
  setZindexs: React.Dispatch<
    React.SetStateAction<(Zindex.ResponseItem & Zindex.ExtraRow)[]>
  >;
  freshZindexs: () => Promise<void>;
  sortZindexs: (esponseZindex?: Zindex.ResponseItem[]) => void;
}

export const HomeContext = createContext<HomeContextType>({
  funds: [],
  setFunds: () => {},
  freshFunds: async () => {},
  sortFunds: () => {},

  zindexs: [],
  setZindexs: () => {},
  freshZindexs: async () => {},
  sortZindexs: () => {},
});

const Home: React.FC<HomeProps> = () => {
  const dispathch = useDispatch();
  const { freshDelaySetting } = getSystemSetting();
  const [funds, setFunds] = useState<(Fund.ResponseItem & Fund.ExtraRow)[]>([]);
  const [zindexs, setZindexs] = useState<Zindex.ResponseItem[]>([]);
  const tabsActiveKey = useSelector(
    (state: StoreState) => state.tabs.activeKey
  );
  const fundsCodeToMap = useMemo(
    () =>
      funds.reduce((map, fund) => {
        map[fund.fundcode] = fund;
        return map;
      }, {}),
    [funds]
  );
  const zindexsCodeToMap = useMemo(
    () =>
      zindexs.reduce((map, zindex) => {
        map[zindex.zindexCode] = zindex;
        return map;
      }, {}),
    [zindexs]
  );

  const { run: runGetFunds, loading: fundsLoading } = useRequest(getFunds, {
    manual: true,
    throttleInterval: 1000 * 2, // 2秒请求一次
    onSuccess: (result) => {
      const now = dayjs().format('YYYY/MM/DD HH:mm:ss');
      sortFunds(
        result
          .filter((_) => !!_)
          .map((_) => ({
            ..._,
            collapse: fundsCodeToMap[_?.fundcode]?.collapse,
          })) as (Fund.ResponseItem & Fund.ExtraRow)[]
      );
      dispathch(updateUpdateTime(now));
    },
  });

  const { run: runGetZindexs, loading: zindexsLoading } = useRequest(
    getZindexs,
    {
      manual: true,
      onSuccess: (result) => {
        sortZindexs(
          result
            .filter((_) => !!_)
            .map((_) => ({
              ..._,
              collapse: zindexsCodeToMap[_?.zindexCode]?.collapse,
            })) as (Zindex.ResponseItem & Zindex.ExtraRow)[]
        );
      },
    }
  );

  const freshFunds = async () => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    });
    runGetFunds();
  };

  const freshZindexs = async () => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    });
    runGetZindexs();
  };

  const sortFunds = (responseFunds?: Fund.ResponseItem[]) => {
    const {
      fundSortMode: { type: fundSortType, order: fundSortorder },
    } = getSortMode();
    const { codeMap } = getFundConfig();
    const sortList: Fund.ResponseItem[] = Utils.DeepCopy(
      responseFunds || funds
    );
    sortList.sort((a, b) => {
      const _a = calcFund(a);
      const _b = calcFund(b);
      const t = fundSortorder === Enums.SortOrderType.Asc ? 1 : -1;
      switch (fundSortType) {
        case Enums.FundSortType.Growth:
          return Number(_a.gszzl) > Number(_b.gszzl) ? 1 * t : -1 * t;
        case Enums.FundSortType.Block:
          return Number(_a.cyfe) > Number(_b.cyfe) ? 1 * t : -1 * t;
        case Enums.FundSortType.Money:
          return Number(_a.jrsygz) > Number(_b.jrsygz) ? 1 * t : -1 * t;
        case Enums.FundSortType.Estimate:
          return Number(_a.gszz) > Number(_b.gszz) ? 1 * t : -1 * t;
        case Enums.FundSortType.Default:
        default:
          return codeMap[a.fundcode]?.originSort >
            codeMap[b.fundcode]?.originSort
            ? -1 * t
            : 1 * t;
      }
    });
    setFunds(sortList);
  };

  const sortZindexs = (responseZindexs?: Zindex.ResponseItem[]) => {
    const {
      zindexSortMode: { type: zindexSortType, order: zindexSortorder },
    } = getSortMode();
    const { codeMap } = getZindexConfig();
    const sortList: Zindex.ResponseItem[] = Utils.DeepCopy(
      responseZindexs || zindexs
    );
    sortList.sort((a, b) => {
      const t = zindexSortorder === Enums.SortOrderType.Asc ? 1 : -1;
      switch (zindexSortType) {
        case Enums.ZindexSortType.Zdd:
          return a.zdd > b.zdd ? 1 * t : -1 * t;
        case Enums.ZindexSortType.Zdf:
          return a.zdf > b.zdf ? 1 * t : -1 * t;
        case Enums.ZindexSortType.Zsz:
          return a.zsz > b.zsz ? 1 * t : -1 * t;
        case Enums.ZindexSortType.Custom:
        default:
          return codeMap[a.zindexCode]?.originSort >
            codeMap[b.zindexCode]?.originSort
            ? -1 * t
            : 1 * t;
      }
    });
    setZindexs(sortList);
  };

  // 间隔时间刷新基金
  useWorkDayTimeToDo(runGetFunds, freshDelaySetting * 1000 * 60);

  // 间隔时间刷新指数
  useWorkDayTimeToDo(runGetZindexs, 1000 * 10);

  useEffect(() => {
    runGetFunds();
    runGetZindexs();
  }, []);

  return (
    <HomeContext.Provider
      value={{
        funds,
        setFunds,
        freshFunds,
        sortFunds,
        zindexs,
        setZindexs,
        freshZindexs,
        sortZindexs,
      }}
    >
      <div className={styles.layout}>
        <Header>
          <Wallet />
          <SortBar />
        </Header>
        <Tabs
          defaultActiveKey={String(tabsActiveKey)}
          renderTabBar={() => <></>}
          activeKey={String(tabsActiveKey)}
          animated={{ tabPane: true }}
        >
          <Tabs.TabPane key={Enums.TabKeyType.Funds} forceRender>
            <LoadingBar show={fundsLoading} />
            <div className={styles.container}>
              {funds.map((fund, index) => (
                <FundRow key={fund.fundcode} fund={fund} index={index} />
              ))}
              {!funds.length && (
                <div className={styles.empty}>暂无基金数据~</div>
              )}
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane key={Enums.TabKeyType.Zindex} forceRender>
            <LoadingBar show={zindexsLoading} />
            <div className={styles.container}>
              {zindexs.map((zindex, index) => (
                <ZindexRow
                  key={zindex.zindexCode}
                  zindex={zindex}
                  index={index}
                />
              ))}
              {!zindexs.length && (
                <div className={styles.empty}>暂无指数数据~</div>
              )}
            </div>
          </Tabs.TabPane>
        </Tabs>
        <Footer>
          <Toolbar />
          <TabsBar />
        </Footer>
      </div>
    </HomeContext.Provider>
  );
};

export default Home;
