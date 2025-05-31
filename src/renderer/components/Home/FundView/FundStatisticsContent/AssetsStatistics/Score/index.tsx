import React, { useState } from 'react';
import { useRequest } from 'ahooks';

import clsx from 'clsx';

import ChartCard from '@/components/Card/ChartCard';

import { useResizeEchart, useAppSelector, useRenderEcharts } from '@/utils/hooks';

import * as Enums from '@/utils/enums';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.css';

export interface ScoreProps {
  gssyl: number;
}

/**
 *  沪深300 作为成绩衡量标准
 */
const indexCode = '1.000300';

const Score: React.FC<ScoreProps> = ({ gssyl = 0 }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(0.48);
  const { freshDelaySetting, autoFreshSetting } = useAppSelector((state) => state.setting.systemSetting);
  const [HS, setHS] = useState('');

  const { data: result, run: runGetZindexFromEastmoney } = useRequest(() => Services.Zindex.FromEastmoney(indexCode), {
    pollingInterval: autoFreshSetting ? 1000 * 60 * freshDelaySetting : undefined,
  });

  useRenderEcharts(
    () => {
      if (!result) {
        return;
      }
      const indexNumber = result.zdf;
      chartInstance?.setOption({
        series: [
          {
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            splitNumber: 16,
            radius: '150%',
            center: ['50%', '95%'],
            axisLine: {
              lineStyle: {
                width: 2,
                color: [
                  [0.25, '#FF6E76'],
                  [0.5, '#FDDD60'],
                  [0.75, '#58D9F9'],
                  [1, '#7CFFB2'],
                ],
              },
            },
            pointer: {
              icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
              length: '12%',
              width: 6,
              offsetCenter: [0, '-55%'],
              itemStyle: {
                color: 'auto',
              },
            },
            axisTick: {
              length: 12,
              lineStyle: {
                color: 'auto',
                width: 2,
              },
            },
            splitLine: {
              length: 20,
              lineStyle: {
                color: 'auto',
                width: 1,
              },
            },
            axisLabel: {
              color: 'var(--main-text-color)',
              fontSize: 10,
              distance: -50,
              formatter: (value: number) => {
                if (value === (100 * 7) / 8) {
                  return '优';
                } else if (value === (100 * 5) / 8) {
                  return '良';
                } else if (value === (100 * 3) / 8) {
                  return '中';
                } else if (value === (100 * 1) / 8) {
                  return '差';
                } else {
                  return '';
                }
              },
            },
            title: {
              offsetCenter: [0, '-25%'],
              fontSize: 10,
              color: 'var(--inner-text-color)',
            },
            detail: {
              fontSize: 12,
              offsetCenter: [0, '-5%'],
              valueAnimation: true,
              formatter: (value: number) => {
                return `${value} 分`;
              },
              color: 'auto',
            },
            data: [
              {
                value: Math.round(20 * (gssyl - indexNumber) + 60),
                name: '今日成绩',
              },
            ],
          },
        ],
      });
      setHS(String(indexNumber));
    },
    chartInstance,
    [result, gssyl]
  );

  return (
    <ChartCard
      auto
      onFresh={runGetZindexFromEastmoney}
      TitleBar={
        <div className={styles.row}>
          评分指标-沪深300(今)：
          <span className={clsx(Utils.GetValueColor(HS).textClass)}>{HS}%</span>
        </div>
      }
    >
      <div ref={chartRef} style={{ width: '100%' }} />
    </ChartCard>
  );
};

export default Score;
