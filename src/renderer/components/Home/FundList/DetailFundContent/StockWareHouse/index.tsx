import React from 'react';
import { renderToString } from 'react-dom/server';
import { useRequest } from 'ahooks';

import { useHomeContext } from '@/components/Home';
import CustomDrawer from '@/components/CustomDrawer';
import DetailStockContent from '@/components/Home/StockList/DetailStockContent';
import { useResizeEchart, useRenderEcharts, useDrawer } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.scss';

export interface StockWareHouseProps {
  code: string;
  stockCodes: string[];
}
interface TooltipProps {
  item: Fund.WareHouse;
}

const Tooltip: React.FC<TooltipProps> = (props) => {
  const { item } = props;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipName}>股票名称：{item.name}</div>
      <div>股票代码：{item.code}</div>
      <div>持仓占比：{item.ccb}%</div>
      <div className={Utils.GetValueColor(item.zdf).textClass}>
        涨跌幅：{item.zdf}%
      </div>
    </div>
  );
};

const StockWareHouse: React.FC<StockWareHouseProps> = ({
  code,
  stockCodes,
}) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(
    CONST.DEFAULT.ECHARTS_SCALE
  );
  const { varibleColors, darkMode } = useHomeContext();
  const {
    data: stockSecid,
    show: showDetailStockDrawer,
    set: setDetailStockDrawer,
    close: closeDetailStockDrawer,
  } = useDrawer('');

  const { run: runGetStockWareHouseFromEastmoney } = useRequest(
    Services.Fund.GetStockWareHouseFromEastmoney,
    {
      manual: true,
      throwOnError: true,
      cacheKey: `GetStockWareHouseFromEastmoney/${code}`,
      onSuccess: (result) => {
        chartInstance?.setOption({
          backgroundColor: 'transparent',
          title: {
            show: false,
          },
          grid: {
            left: 0,
            right: 5,
            bottom: 0,
            containLabel: true,
          },
          tooltip: {
            trigger: 'item',
            formatter: (params: any) =>
              renderToString(<Tooltip item={params.data.item} />),
          },
          series: [
            {
              name: '持仓占比',
              type: 'pie',
              radius: '64%',
              center: ['50%', '50%'],
              data:
                result?.map((item) => {
                  return {
                    value: item.ccb,
                    name: item.name,
                    itemStyle: {
                      color: Utils.GetValueColor(item.zdf).color,
                    },
                    item,
                  };
                }) || [],
              roseType: 'radius',
              label: {
                color: varibleColors['--main-text-color'],
              },
              labelLine: {
                lineStyle: {
                  color: varibleColors['--main-text-color'],
                },
                smooth: 0.2,
                length: 10,
                length2: 20,
              },
              itemStyle: {
                borderRadius: 10,
                borderColor: varibleColors['--background-color'],
                borderWidth: 1,
              },
              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: () => Math.random() * 200,
            },
          ],
        });
      },
    }
  );

  useRenderEcharts(
    () => {
      runGetStockWareHouseFromEastmoney(code, stockCodes);
      chartInstance?.off('click');
      chartInstance?.on('click', (params: any) => {
        const { market, code } = params.data.item;
        const secid = `${market}.${code}`;
        setDetailStockDrawer(secid);
      });
    },
    chartInstance,
    [darkMode, code, stockCodes]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
      <CustomDrawer show={showDetailStockDrawer}>
        <DetailStockContent
          onEnter={closeDetailStockDrawer}
          onClose={closeDetailStockDrawer}
          secid={stockSecid}
        />
      </CustomDrawer>
    </div>
  );
};

export default StockWareHouse;
