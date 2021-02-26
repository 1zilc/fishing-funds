import React, { useEffect, useRef, useState } from 'react';
import { useSize } from 'ahooks';
import * as echarts from 'echarts';

import { useNativeThemeColor } from '@/utils/hooks';
import CONST_VARIBLES from '@/constants/varibles.json';

import styles from './index.scss';

interface SimilarProportionProps {
  rateInSimilarPersent?: [][];
}

const SimilarProportion: React.FC<SimilarProportionProps> = ({
  rateInSimilarPersent = [],
}) => {
  const similarRef = useRef<HTMLDivElement>(null);
  const [
    similarProportionChartInstance,
    setSimilarProportionChartInstance,
  ] = useState<echarts.ECharts | null>(null);
  const { width: similarRefWidth } = useSize(similarRef);
  const { colors: varibleColors, darkMode } = useNativeThemeColor(
    CONST_VARIBLES
  );

  const initSimilarProportionChart = () => {
    const instance = echarts.init(similarRef.current!);
    setSimilarProportionChartInstance(instance);
  };

  const renderSimilarProportionChart = () => {
    similarProportionChartInstance?.setOption({
      title: {
        text: '优于同类百分比',
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
          data: rateInSimilarPersent,
          type: 'line',
          showSymbol: false,
          lineStyle: {
            width: 1,
          },
        },
      ],
      dataZoom: [
        {
          type: 'inside',
        },
      ],
    });
  };

  useEffect(() => {
    initSimilarProportionChart();
  }, []);

  useEffect(() => {
    if (similarProportionChartInstance) {
      renderSimilarProportionChart();
    }
  }, [darkMode, similarProportionChartInstance, rateInSimilarPersent]);

  useEffect(() => {
    similarProportionChartInstance?.resize({
      height: similarRefWidth! * 0.64,
    });
  }, [similarRefWidth]);

  return (
    <div className={styles.content}>
      <div ref={similarRef} style={{ width: '100%' }}></div>
    </div>
  );
};

export default SimilarProportion;
