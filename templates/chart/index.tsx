import React from 'react';

import { useResizeEchart, useRenderEcharts, useNativeThemColor } from '@/utils/hooks';
import * as CONST from '@/constants';
import styles from './index.module.scss';

interface TemplateNameProps {}

const TemplateName: React.FC<TemplateNameProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const { varibleColors } = useNativeThemColor();

  useRenderEcharts(
    () => {
      chartInstance?.setOption({});
    },
    chartInstance,
    [varibleColors]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default TemplateName;
