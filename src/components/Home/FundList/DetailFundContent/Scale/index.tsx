import React, { useEffect, useRef, useState, useContext } from 'react';
import { useSize } from 'ahooks';
import * as echarts from 'echarts';

import { HomeContext } from '@/components/Home';
import styles from './index.scss';

interface ScaleProps {
  rateInSimilarType?: { x: number; y: number; sc: string }[];
}

const Scale: React.FC<ScaleProps> = ({ rateInSimilarType = [] }) => {
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

  const renderChart = () => {
    chartInstance?.setOption({
      title: {
        text: '同类中排名',
        left: 'center',
        top: 0,
        textStyle: {
          color: varibleColors['--main-text-color'],
          fontSize: 12,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      grid: {
        top: 32,
        left: 0,
        right: 5,
        bottom: 0,
        containLabel: true,
      },
      xAxis: {
        type: 'time',
        axisLabel: {
          fontSize: 10,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 10,
        },
      },
      series: [
        {
          data: rateInSimilarType?.map(({ x, y, sc }) => [x, y]),
          type: 'bar',
        },
      ],
      dataZoom: [
        {
          type: 'inside',
          start: 90,
          end: 100,
          minValueSpan: 3600 * 24 * 1000 * 7,
        },
      ],
    });
  };

  useEffect(() => {
    initChart();
  }, []);

  useEffect(() => {
    if (chartInstance) {
      renderChart();
    }
  }, [darkMode, chartInstance, rateInSimilarType]);

  useEffect(() => {
    chartInstance?.resize({
      height: chartRefWidth! * 0.64,
    });
  }, [chartRefWidth]);

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }}></div>
    </div>
  );
};

export default Scale;

// /*规模变动 mom-较上期环比*/ var Data_fluctuationScale = {
//   categories: [
//     '2020-03-31',
//     '2020-06-30',
//     '2020-09-30',
//     '2020-12-31',
//     '2021-03-31',
//   ],
//   series: [
//     { y: 17.26, mom: '85.20%' },
//     { y: 23.1, mom: '33.86%' },
//     { y: 20.8, mom: '-9.95%' },
//     { y: 103.7, mom: '398.53%' },
//     { y: 162.79, mom: '56.99%' },
//   ],
// };
// /*持有人结构*/ var Data_holderStructure = {
//   series: [
//     { name: '机构持有比例', data: [0.04, 58.78, 43.87, 16.87] },
//     { name: '个人持有比例', data: [99.96, 41.22, 56.13, 83.13] },
//     { name: '内部持有比例', data: [0.06, 0.02, 0.04, 0.01] },
//   ],
//   categories: ['2019-06-30', '2019-12-31', '2020-06-30', '2020-12-31'],
// };
// /*资产配置*/ var Data_assetAllocation = {
//   series: [
//     {
//       name: '股票占净比',
//       type: null,
//       data: [93.04, 86.22, 92.63, 88.97],
//       yAxis: 0,
//     },
//     { name: '债券占净比', type: null, data: [0, 0.03, 0.01, 0.0], yAxis: 0 },
//     {
//       name: '现金占净比',
//       type: null,
//       data: [6.94, 12.44, 15.28, 11.93],
//       yAxis: 0,
//     },
//     {
//       name: '净资产',
//       type: 'line',
//       data: [23.0998646466, 20.8009881999, 103.6986675195, 162.794546109],
//       yAxis: 1,
//     },
//   ],
//   categories: ['2020-06-30', '2020-09-30', '2020-12-31', '2021-03-31'],
// };
// /*业绩评价 ['选股能力', '收益率', '抗风险', '稳定性','择时能力']*/ var Data_performanceEvaluation = {
//   avr: '61.00',
//   categories: ['选证能力', '收益率', '抗风险', '稳定性', '择时能力'],
//   dsc: [
//     '反映基金挑选证券而实现风险\u003cbr\u003e调整后获得超额收益的能力',
//     '根据阶段收益评分，反映基金的盈利能力',
//     '反映基金投资收益的回撤情况',
//     '反映基金投资收益的波动性',
//     '反映基金根据对市场走势的判断，\u003cbr\u003e通过调整仓位及配置而跑赢基金业\u003cbr\u003e绩基准的能力',
//   ],
//   data: [60.0, 100.0, 20.0, 10.0, 50.0],
// };
// /*现任基金经理*/ var Data_currentFundManager = [
//   {
//     id: '30529020',
//     pic: 'https://pdf.dfcfw.com/pdf/H8_30529020_1.JPG',
//     name: '郑泽鸿',
//     star: 3,
//     workTime: '3年又337天',
//     fundSize: '162.79亿(1只基金)',
//     power: {
//       avr: '48.48',
//       categories: ['经验值', '收益率', '抗风险', '稳定性', '择时能力'],
//       dsc: [
//         '反映基金经理从业年限和管理基金的经验',
//         '根据基金经理投资的阶段收益评分，反映\u003cbr\u003e基金经理投资的盈利能力',
//         '反映基金经理投资的回撤控制能力',
//         '反映基金经理投资收益的波动',
//         '反映基金经理根据对市场的判断，通过\u003cbr\u003e调整仓位及配置而跑赢业绩的基准能力',
//       ],
//       data: [52.7, 99.7, 5.7, 1.0, 11.6],
//       jzrq: '2021-05-07',
//     },
//     profit: {
//       categories: ['任期收益', '同类平均', '沪深300'],
//       series: [
//         {
//           data: [
//             { name: null, color: '#7cb5ec', y: 170.3 },
//             { name: null, color: '#414c7b', y: 67.56 },
//             { name: null, color: '#f7a35c', y: 41.38 },
//           ],
//         },
//       ],
//       jzrq: '2021-05-07',
//     },
//   },
// ];
