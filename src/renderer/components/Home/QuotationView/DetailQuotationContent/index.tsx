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
import K from '@/components/Home/StockView/DetailStockContent/K';
import Trend from '@/components/Home/StockView/DetailStockContent/Trend';
import Estimate from '@/components/Home/StockView/DetailStockContent/Estimate';
import GuBa from '@/components/Home/NewsList/GuBa';
import { RedirectSearchParams } from '@/containers/InitPage';
import { DetailQuotationPageParams } from '@/components/Home/QuotationView/DetailQuotationPage';
import { setFavoriteQuotationMapAction } from '@/store/features/quotation';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import * as Services from '@/services';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import styles from './index.module.scss';

export type DetailQuotationProps = {
  code: string;
};

export interface DetailQuotationContentProps extends DetailQuotationProps {
  onEnter: () => void;
  onClose: () => void;
}
const { ipcRenderer } = window.contextModules.electron;

export const DetailQuotation: React.FC<DetailQuotationProps> = (props) => {
  const { code } = props;
  const dispatch = useAppDispatch();
  const favoriteQuotationMap = useAppSelector((state) => state.quotation.favoriteQuotationMap);

  const { data: quotation = {} as Quotation.DetailData | Record<string, any> } = useRequest(
    Services.Quotation.GetQuotationDetailFromEastmoney,
    {
      defaultParams: [code],
      cacheKey: Utils.GenerateRequestKey('Quotation.GetQuotationDetailFromEastmoney', code),
    }
  );

  const favorited = favoriteQuotationMap[quotation.code];

  return (
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
              <a
                className={styles.selfAdd}
                onClick={() => dispatch(setFavoriteQuotationMapAction({ code: quotation.code, status: false }))}
              >
                已关注
              </a>
            ) : (
              <a
                className={styles.selfAdd}
                onClick={() => dispatch(setFavoriteQuotationMapAction({ code: quotation.code, status: true }))}
              >
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
            <div className={clsx(styles.zdf, Utils.GetValueColor(quotation.zdd).textClass)}>
              {Utils.Yang(quotation.zdf)}%
            </div>
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
        <Tabs
          animated={{ tabPane: true }}
          tabBarGutter={15}
          items={[
            {
              key: String(0),
              label: '板块走势',
              children: <Trend secid={`90.${quotation.code}`} zs={quotation.zs} name={quotation.name} />,
            },
            {
              key: String(1),
              label: '走势详情',
              children: <Estimate secid={`90.${quotation.code}`} />,
            },
            {
              key: String(2),
              label: '近期资讯',
              children: <Recent keyword={quotation.name} />,
            },
            {
              key: String(3),
              label: '股吧',
              children: <GuBa keyword={quotation.code} type="103" />,
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
              children: <K secid={`90.${quotation.code}`} />,
            },
            {
              key: String(1),
              label: '实时成交分布',
              children: <RealTimeTransaction code={code} />,
            },
            {
              key: String(2),
              label: '实时资金',
              children: <RealTimeFundFlow secid={`90.${code}`} />,
            },
            {
              key: String(3),
              label: '盘后资金',
              children: <AfterTimeFundFlow secid={`90.${code}`} />,
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
              label: '主题基金',
              children: <Funds code={code} />,
            },
            {
              key: String(1),
              label: `${quotation.name}个股`,
              children: <Stocks code={code} />,
            },
          ]}
        />
      </div>
    </div>
  );
};

const DetailQuotationContent: React.FC<DetailQuotationContentProps> = (props) => {
  function onOpenChildWindow() {
    const search = Utils.MakeSearchParams('', {
      _redirect: Utils.MakeSearchParams(CONST.ROUTES.DETAIL_QUOTATION, {
        code: props.code,
      } as DetailQuotationPageParams),
    } as RedirectSearchParams);
    ipcRenderer.invoke('open-child-window', { search });
  }

  return (
    <CustomDrawerContent title="板块详情" enterText="多窗" onClose={props.onClose} onEnter={onOpenChildWindow}>
      <DetailQuotation code={props.code} />
    </CustomDrawerContent>
  );
};

export default DetailQuotationContent;
