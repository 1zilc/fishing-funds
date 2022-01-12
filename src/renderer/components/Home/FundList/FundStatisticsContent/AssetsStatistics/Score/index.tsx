import React, { useState } from 'react';
import { useRequest } from 'ahooks';
import { useSelector } from 'react-redux';
import classnames from 'classnames';

import ChartCard from '@/components/Card/ChartCard';
import { useHomeContext } from '@/components/Home';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import { StoreState } from '@/reducers/types';
import * as Enums from '@/utils/enums';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.scss';

export interface ScoreProps {
  gssyl: number;
}

/**
 *  沪深300 作为成绩衡量标准
 */
const indexCode = '1.000300';

const Score: React.FC<ScoreProps> = ({ gssyl = 0 }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(0.48);
  const { varibleColors, darkMode } = useHomeContext();
  const { freshDelaySetting, autoFreshSetting } = useSelector((state: StoreState) => state.setting.systemSetting);
  const eyeStatus = useSelector((state: StoreState) => state.wallet.eyeStatus);
  const eyeOpen = eyeStatus === Enums.EyeStatus.Open;
  const [HS, setHS] = useState('');

  const { run: runGetZindexFromEastmoney } = useRequest(() => Services.Zindex.FromEastmoney(indexCode), {
    pollingInterval: autoFreshSetting ? 1000 * 60 * freshDelaySetting : undefined,

    onSuccess: (result) => {
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
              color: varibleColors['--main-text-color'],
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
              color: varibleColors['--inner-text-color'],
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
    refreshDeps: [darkMode, gssyl],
  });

  return (
    <ChartCard
      auto
      onFresh={runGetZindexFromEastmoney}
      TitleBar={
        <div className={styles.row}>
          评分指标-沪深300(今)：
          <span className={classnames(Utils.GetValueColor(HS).textClass)}>{HS}%</span>
        </div>
      }
    >
      <div ref={chartRef} style={{ width: '100%' }} />
    </ChartCard>
  );
};

export default Score;
