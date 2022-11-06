import React from 'react';
import { useRequest } from 'ahooks';

import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import styles from './index.module.scss';

export type TemplateNameProps = {};

const TemplateName: React.FC<TemplateNameProps> = () => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);

  const { data: result, run } = useRequest(() => {}, {
    ready: !!chartInstance,
  });
  useRenderEcharts(
    () => {
      chartInstance?.setOption({});
    },
    chartInstance,
    [result]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default TemplateName;
