import React, { useState } from 'react';
import { useRequest } from 'ahooks';

import { useHomeContext } from '@/components/Home';
import ChartCard from '@/components/Card/ChartCard';
import TypeSelection from '@/components/TypeSelection';
import { useResizeEchart } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.scss';

interface IndustryProps {}

const industryTypeList = [
  { name: '今日排行', type: 'f62', code: 'm:90+t:2' },
  { name: '5日排行', type: 'f164', code: 'm:90+t:2' },
  { name: '10日排行', type: 'f174', code: 'm:90+t:2' },
];

const Industry: React.FC<IndustryProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const [industryType, setIndustryType] = useState(industryTypeList[0]);
  const { varibleColors, darkMode } = useHomeContext();

  const { run: runGetFundPerformanceFromEastmoney } = useRequest(
    () => Services.Quotation.GetFundFlowFromEastmoney(industryType.code, industryType.type),
    {
      onSuccess: (result) => {
        chartInstance?.setOption({
          title: {
            show: false,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          grid: {
            top: '3%',
            left: 0,
            right: 0,
            bottom: 0,
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              fontSize: 10,
              interval: 0,
              formatter: (value: string) => value.split('').join('\n'),
            },
            data: result.map(({ name }) => name) || [],
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: `{value}亿`,
              fontSize: 10,
            },
          },
          series: [
            {
              type: 'bar',
              data: result.map(({ value }) => {
                return {
                  value,
                  itemStyle: {
                    color: Utils.GetValueColor(value).color,
                  },
                };
              }),
            },
          ],
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 20,
              maxValueSpan: 50,
            },
          ],
        });
      },
      refreshDeps: [darkMode, industryType.code, industryType.type],
      ready: !!chartInstance,
    }
  );

  return (
    <ChartCard onFresh={runGetFundPerformanceFromEastmoney}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
        <TypeSelection types={industryTypeList} activeType={industryType.type} onSelected={setIndustryType} />
      </div>
    </ChartCard>
  );
};

export default Industry;
