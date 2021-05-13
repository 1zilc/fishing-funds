import React, { useContext } from 'react';
import { renderToString } from 'react-dom/server';
import { useRequest } from 'ahooks';

import { HomeContext } from '@/components/Home';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as Services from '@/services';
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
      <div className={item.zdf < 0 ? 'text-down' : 'text-up'}>
        涨跌幅：{item.zdf}%
      </div>
    </div>
  );
};

const StockWareHouse: React.FC<StockWareHouseProps> = ({
  code,
  stockCodes,
}) => {
  const { ref: chartRef, chartInstance } = useResizeEchart();
  const { varibleColors, darkMode } = useContext(HomeContext);

  const { run: runGetStockWareHouseFromEastmoney } = useRequest(
    Services.Fund.GetStockWareHouseFromEastmoney,
    {
      manual: true,
      throwOnError: true,
      cacheKey: `GetStockWareHouseFromEastmoney/${code}`,
      onSuccess: (result) => {
        console.log(result);
        chartInstance?.setOption({
          backgroundColor: 'transparent',
          title: {
            text: `持仓前${result.length}股票`,
            left: 'center',
            top: 0,
            textStyle: {
              color: varibleColors['--main-text-color'],
              fontSize: 12,
            },
          },
          grid: {
            top: '3%',
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
                      color:
                        item.zdf >= 0
                          ? varibleColors['--increase-color']
                          : varibleColors['--reduce-color'],
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
                color: varibleColors['--main-text-color'],
                borderRadius: 10,
                borderColor: varibleColors['--background-color'],
                borderWidth: 1,
                // shadowBlur: 200,
                // shadowColor: 'rgba(0, 0, 0, 0.5)',
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
      console.log(code, stockCodes);
      runGetStockWareHouseFromEastmoney(code, stockCodes);
    },
    chartInstance,
    [darkMode, code, stockCodes]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }}></div>
    </div>
  );
};

export default StockWareHouse;
