import React, { useEffect, useRef, useState, useContext } from 'react';
import { renderToString } from 'react-dom/server';
import { useRequest, useSize } from 'ahooks';
import * as echarts from 'echarts';

import { HomeContext } from '@/components/Home';

import * as Services from '@/services';
import styles from './index.scss';

export interface StockWareHouseProps {
  code: string;
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

const RealTimeTransaction: React.FC<StockWareHouseProps> = ({ code }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(
    null
  );
  const { width: chartRefWidth } = useSize(chartRef);
  const { varibleColors, darkMode } = useContext(HomeContext);

  const initChart = () => {
    const instance = echarts.init(chartRef.current!, undefined, {
      renderer: 'svg',
    });
    setChartInstance(instance);
  };

  const { run: runGetTransactionFromEasymoney } = useRequest(
    Services.Quotation.GetTransactionFromEasymoney,
    {
      manual: true,
      throwOnError: true,
      pollingInterval: 1000 * 60,
      onSuccess: (result) => {
        chartInstance?.setOption({
          backgroundColor: 'transparent',
          title: {
            text: `分布情况`,
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
          },
          series: [
            {
              name: '交易金额(亿元)',
              type: 'pie',
              radius: '64%',
              center: ['50%', '50%'],
              data: [
                {
                  name: '超大单流入',
                  value: result.cddlr,
                  itemStyle: {
                    color: darkMode ? '#431418' : '#820014',
                  },
                },
                {
                  name: '大单流入',
                  value: result.ddlr,
                  itemStyle: {
                    color: darkMode ? '#791a1f' : '#cf1322',
                  },
                },
                {
                  name: '中单流入',
                  value: result.zdlr,
                  itemStyle: {
                    color: darkMode ? '#d32029' : '#ff4d4f',
                  },
                },
                {
                  name: '小单流入',
                  value: result.xdlr,
                  itemStyle: {
                    color: darkMode ? '#f37370' : '#ffa39e',
                  },
                },
                {
                  name: '小单流出',
                  value: result.xdlc,
                  itemStyle: {
                    color: darkMode ? '#8fd460' : '#b7eb8f',
                  },
                },
                {
                  name: '中单流出',
                  value: result.zdlc,
                  itemStyle: {
                    color: darkMode ? '#49aa19' : '#73d13d',
                  },
                },
                {
                  name: '大单流出',
                  value: result.ddlc,
                  itemStyle: {
                    color: darkMode ? '#306317' : '#389e0d',
                  },
                },
                {
                  name: '超大单流出',
                  value: result.cddlc,
                  itemStyle: {
                    color: darkMode ? '#1d3712' : '#135200',
                  },
                },
              ],
              label: {
                color: varibleColors['--main-text-color'],
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

  useEffect(() => {
    initChart();
  }, []);

  useEffect(() => {
    if (chartInstance) {
      runGetTransactionFromEasymoney(code);
    }
  }, [darkMode, chartInstance]);

  useEffect(() => {
    chartInstance?.resize({
      height: chartRefWidth,
    });
  }, [chartRefWidth]);

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }}></div>
    </div>
  );
};

export default RealTimeTransaction;
