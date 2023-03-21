import React, { useState, useDeferredValue } from 'react';
import { Slider } from 'antd';
import dayjs from 'dayjs';
import ChartCard from '@/components/Card/ChartCard';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import styles from './index.module.scss';

export type CycleReturnProps = {
  data: { x: number | string; y: number }[];
  onFresh?: () => void;
};

const CycleReturn: React.FC<CycleReturnProps> = (props) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const [day, setDay] = useState(30 * 3);
  const d = useDeferredValue(day);

  useRenderEcharts(
    () => {
      const { data = [] } = props;
      const map = {} as Record<number | string, number>;
      const last = data[data.length - 1];
      if (!data.length) {
        return;
      }
      function findCurrentDay(x: number, count: number): number | null {
        const date = dayjs(x);
        if (!!map[x]) {
          return map[x];
        }
        // 向前14天未找到即查找失败
        if (count >= 14) {
          return null;
        }
        // 向前找净值
        return findCurrentDay(date.add(-1, 'day').valueOf(), count + 1);
      }
      data.forEach((item) => {
        const t = dayjs(item.x).valueOf();
        map[t] = item.y;
      });
      const list = data.map((item) => {
        const date = dayjs(item.x);
        const indexDay = date.add(d, 'day').valueOf(); // 指标日期
        const indexValue = findCurrentDay(indexDay, 0) || last.y;
        const zf = (((indexValue - item.y) / item.y) * 100).toFixed(2);
        return [date.month() + 1, zf];
      });
      chartInstance?.setOption({
        xAxis: {
          boundaryGap: false,
          splitLine: {
            show: false,
          },
          axisLabel: {
            formatter: `{value}月`,
            fontSize: 10,
          },
        },
        yAxis: {
          splitLine: {
            show: false,
          },
          axisLabel: {
            formatter: `{value}%`,
            fontSize: 10,
          },
        },
        grid: {
          left: 0,
          right: 10,
          bottom: 0,
          top: 10,
          containLabel: true,
        },
        series: [
          {
            symbolSize: 2,
            type: 'scatter',
            data: list,
          },
        ],
      });
    },
    chartInstance,
    [props.data, d]
  );

  return (
    <ChartCard
      className={styles.content}
      auto
      onFresh={props.onFresh}
      TitleBar={<div className={styles.titleBar}>各月份买入{d}天后收益率</div>}
    >
      <div ref={chartRef} style={{ width: '100%' }} />
      <Slider
        min={7}
        max={365}
        step={1}
        value={day}
        onChange={setDay}
        marks={{
          7: '1周',
          30: '1月',
          90: '3月',
          180: '半年',
          365: '一年',
        }}
        tooltip={{ formatter: (value?: number) => `${value}天` }}
      />
    </ChartCard>
  );
};

export default CycleReturn;
