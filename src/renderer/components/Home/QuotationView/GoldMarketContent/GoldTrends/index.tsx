import React, { useState } from 'react';
import { useRequest } from 'ahooks';

import { useHomeContext } from '@/components/Home';
import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as Services from '@/services';
import * as CONST from '@/constants';
import styles from './index.module.scss';

interface GoldTrendsProps {
  secid: string;
  title: string;
}

const GoldTrends: React.FC<GoldTrendsProps> = (props) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const { darkMode } = useHomeContext();
  const [data, setData] = useState<string[][]>([]);

  const { run: runGetAumFromEastmoney } = useRequest(() => Services.Quotation.GetGoldTrendsFromEastmoney(props.secid), {
    onSuccess: setData,
    ready: !!chartInstance,
  });

  useRenderEcharts(
    () => {
      chartInstance?.setOption({
        title: {
          show: false,
          text: '沪深主力',
        },
        tooltip: {
          trigger: 'axis',
          position: 'inside',
        },
        legend: {
          show: false,
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 10,
          containLabel: true,
        },
        xAxis: [
          {
            type: 'time',
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            scale: true,
            type: 'value',
          },
        ],
        series: [
          {
            name: '价格',
            type: 'line',
            stack: '',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            showSymbol: false,
            symbol: 'none',
            lineStyle: {
              width: 1,
            },
            data: data,
          },
        ],
      });
    },
    chartInstance,
    [darkMode, data]
  );

  return (
    <ChartCard className={styles.content} onFresh={runGetAumFromEastmoney} TitleBar={<div className={styles.titleBar}>{props.title}</div>}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </ChartCard>
  );
};

export default GoldTrends;
