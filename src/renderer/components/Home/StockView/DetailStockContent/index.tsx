import React from 'react';
import clsx from 'clsx';
import { useRequest } from 'ahooks';
import { message, Tabs } from 'antd';

import Trend from '@/components/Home/StockView/DetailStockContent/Trend';
import ColorfulTags from '@/components/ColorfulTags';
import Estimate from '@/components/Home/StockView/DetailStockContent/Estimate';
import K from '@/components/Home/StockView/DetailStockContent/K';
import Company from '@/components/Home/StockView/DetailStockContent/Company';
import Stocks from '@/components/Home/StockView/DetailStockContent/Stocks';
import HoldFunds from '@/components/Home/StockView/DetailStockContent/HoldFunds';
import Recent from '@/components/Home/NewsList/Recent';
import CycleReturn from '@/components/Home/FundView/DetailFundContent/CycleReturn';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import GuBa from '@/components/Home/NewsList/GuBa';
import { RedirectSearchParams } from '@/containers/InitPage';
import { DetailStockPageParams } from '@/components/Home/StockView/DetailStockPage';
import { addStockAction } from '@/store/features/stock';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import * as Services from '@/services';
import * as Utils from '@/utils';
import * as CONST from '@/constants';

import styles from './index.module.scss';

export type DetailStockProps = {
  secid: string;
  type?: string | number;
};

export interface DetailStockContentProps extends DetailStockProps {
  onEnter: () => void;
  onClose: () => void;
}

const { ipcRenderer } = window.contextModules.electron;

export const DetailStock: React.FC<DetailStockProps> = (props) => {
  const { secid, type } = props;
  const dispatch = useAppDispatch();
  const codeMap = useAppSelector((state) => state.wallet.stockConfigCodeMap);

  const { data: stock = {} as any } = useRequest(Services.Stock.GetDetailFromEastmoney, {
    pollingInterval: 1000 * 60,
    defaultParams: [secid],
    cacheKey: Utils.GenerateRequestKey('Stock.GetDetailFromEastmoney', secid),
  });

  const { data: industrys = [] } = useRequest(Services.Stock.GetIndustryFromEastmoney, {
    defaultParams: [secid, 3],
    cacheKey: Utils.GenerateRequestKey('Stock.GetIndustryFromEastmoney', secid),
    staleTime: CONST.DEFAULT.SWR_STALE_DELAY,
  });

  const { data: kdata = [], run: runGetKFromEastmoney } = useRequest(
    () => Services.Stock.GetKFromEastmoney(secid, 101, 3600),
    {
      cacheKey: Utils.GenerateRequestKey('Stock.GetKFromEastmoney', [secid, 101, 3600]),
    }
  );

  async function onAdd() {
    try {
      const code = stock.code || secid.split('.').pop();
      let stockType = type;
      if (!stockType) {
        const result = await Services.Stock.SearchFromEastmoney(code);
        result.forEach((market) => {
          market.Datas.forEach(({ MktNum, Code }) => {
            if (secid === `${MktNum}.${Code}`) {
              stockType = market.Type;
            }
          });
        });
      }
      if (!stockType) {
        return;
      }
      dispatch(
        addStockAction({
          secid,
          market: stock.market,
          code: stock.code,
          name: stock.name,
          type: Number(stockType),
          cbj: undefined,
          cyfe: 0,
        })
      );
    } catch (error) {
      message.error('添加失败');
    }
  }
  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <h3 className={styles.titleRow}>
          <span className="copify">{stock.name}</span>
          <span className={clsx(Utils.GetValueColor(stock.zdd).textClass)}>{stock.zx}</span>
        </h3>
        <div className={styles.subTitleRow}>
          <div>
            <span className="copify">{stock.code}</span>
            {!codeMap[secid] && (
              <a className={styles.selfAdd} onClick={onAdd}>
                +加自选
              </a>
            )}
          </div>
          <div>
            <span className={styles.detailItemLabel}>涨跌点：</span>
            <span className={clsx(Utils.GetValueColor(stock.zdd).textClass)}>{Utils.Yang(stock.zdd)}</span>
          </div>
        </div>
        <div className={styles.detail}>
          <div className={clsx(styles.detailItem, 'text-left')}>
            <div className={clsx(Utils.GetValueColor(stock.zdf).textClass)}>{Utils.Yang(stock.zdf)}%</div>
            <div className={styles.detailItemLabel}>涨跌幅</div>
          </div>
          <div className={clsx(styles.detailItem, 'text-center')}>
            <div>{stock.hs}%</div>
            <div className={styles.detailItemLabel}>换手率</div>
          </div>
          <div className={clsx(styles.detailItem, 'text-right')}>
            <div>{stock.zss}万</div>
            <div className={styles.detailItemLabel}>总手数</div>
          </div>
        </div>
        <div className={styles.detail}>
          <div className={clsx(styles.detailItem, 'text-left')}>
            <div className={clsx(Utils.GetValueColor(stock.jk - stock.zs).textClass)}>{Utils.Yang(stock.jk)}</div>
            <div className={styles.detailItemLabel}>今开</div>
          </div>
          <div className={clsx(styles.detailItem, 'text-center')}>
            <div className={clsx('text-up')}>{stock.zg}</div>
            <div className={styles.detailItemLabel}>最高</div>
          </div>
          <div className={clsx(styles.detailItem, 'text-right')}>
            <div className={clsx('text-down')}>{stock.zd}</div>
            <div className={styles.detailItemLabel}>最低</div>
          </div>
        </div>
        <div className={styles.detail}>
          <div className={clsx(styles.detailItem, 'text-left')}>
            <div>{stock.zs}</div>
            <div className={styles.detailItemLabel}>昨收</div>
          </div>
          <div className={clsx(styles.detailItem, 'text-center')}>
            <div className={clsx('text-up')}>{stock.zt}</div>
            <div className={styles.detailItemLabel}>涨停</div>
          </div>
          <div className={clsx(styles.detailItem, 'text-right')}>
            <div className={clsx('text-down')}>{stock.dt}</div>
            <div className={styles.detailItemLabel}>跌停</div>
          </div>
        </div>
        <div className={styles.detail}>
          <div className={clsx(styles.detailItem, 'text-left')}>
            <div>{stock.wp}万</div>
            <div className={styles.detailItemLabel}>外盘</div>
          </div>
          <div className={clsx(styles.detailItem, 'text-center')}>
            <div>{stock.np}万</div>
            <div className={styles.detailItemLabel}>内盘</div>
          </div>
          <div className={clsx(styles.detailItem, 'text-right')}>
            <div>{stock.jj}</div>
            <div className={styles.detailItemLabel}>均价</div>
          </div>
        </div>
        <ColorfulTags tags={industrys.map((industry) => industry.name)} />
      </div>
      <div className={styles.container}>
        <Tabs
          animated={{ tabPane: true }}
          tabBarGutter={15}
          items={[
            {
              key: String(0),
              label: '股票走势',
              children: <Trend secid={secid} zs={stock.zs} name={stock.name} />,
            },
            {
              key: String(1),
              label: '走势详情',
              children: <Estimate secid={secid} />,
            },
            {
              key: String(2),
              label: '近期资讯',
              children: <Recent keyword={stock.name} />,
            },
            {
              key: String(3),
              label: '股吧',
              children: <GuBa keyword={stock.code} type="100" />,
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
              label: 'K线',
              children: <K secid={secid} name={stock.name} />,
            },
            {
              key: String(1),
              label: '周期回报',
              children: (
                <CycleReturn onFresh={runGetKFromEastmoney} data={kdata.map(({ date: x, sp: y }) => ({ x, y }))} />
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
              label: '持股基金',
              children: <HoldFunds secid={secid} />,
            },
            {
              key: String(1),
              label: '公司概况',
              children: <Company secid={secid} />,
            },
            {
              key: String(2),
              label: '同类股票',
              children: <Stocks secid={secid} />,
            },
          ]}
        />
      </div>
    </div>
  );
};

const DetailStockContent: React.FC<DetailStockContentProps> = (props) => {
  function onOpenChildWindow() {
    const search = Utils.MakeSearchParams('', {
      _redirect: Utils.MakeSearchParams(CONST.ROUTES.DETAIL_STOCK, {
        secid: props.secid,
        type: props.type,
      } as DetailStockPageParams),
    } as RedirectSearchParams);
    ipcRenderer.invoke('open-child-window', { search });
  }

  return (
    <CustomDrawerContent title="股票详情" enterText="多窗" onClose={props.onClose} onEnter={onOpenChildWindow}>
      <DetailStock secid={props.secid} type={props.type} />
    </CustomDrawerContent>
  );
};

export default DetailStockContent;
