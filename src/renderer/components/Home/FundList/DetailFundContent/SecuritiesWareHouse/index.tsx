import React from 'react';
import { renderToString } from 'react-dom/server';
import { useRequest } from 'ahooks';

import { useHomeContext } from '@/components/Home';
import ChartCard from '@/components/Card/ChartCard';
import CustomDrawer from '@/components/CustomDrawer';
import DetailStockContent from '@/components/Home/StockList/DetailStockContent';
import { useResizeEchart, useRenderEcharts, useDrawer } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.scss';

export interface SecuritiesWareHouseProps {
  code: string;
  securitiesCodes: string;
}
interface TooltipProps {
  item: Fund.WareHouse;
}

const Tooltip: React.FC<TooltipProps> = (props) => {
  const { item } = props;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipName}>债券名称：{item.name}</div>
      <div>债券代码：{item.code}</div>
      <div>持仓占比：{item.ccb}%</div>
      <div className={Utils.GetValueColor(item.zdf).textClass}>涨跌幅：{item.zdf}%</div>
    </div>
  );
};

const SecuritiesWareHouse: React.FC<SecuritiesWareHouseProps> = ({ code, securitiesCodes }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const { varibleColors, darkMode } = useHomeContext();
  const { data: stockSecid, show: showDetailStockDrawer, set: setDetailStockDrawer, close: closeDetailStockDrawer } = useDrawer('');
  const { run: runGetSecuritiesWareHouseFromEastmoney } = useRequest(
    () => Services.Fund.GetSecuritiesWareHouseFromEastmoney(code, securitiesCodes),
    {
      onSuccess: (result) => {
        chartInstance?.setOption({
          backgroundColor: 'transparent',
          title: {
            show: false,
          },
          grid: {
            left: 0,
            right: 5,
            bottom: 0,
            containLabel: true,
          },
          tooltip: {
            trigger: 'item',
            formatter: (params: any) => renderToString(<Tooltip item={params.data.item} />),
          },
          series: [
            {
              name: '持仓占比',
              type: 'pie',
              radius: '64%',
              center: ['50%', '50%'],
              data: result.map((item) => {
                return {
                  value: item.ccb,
                  name: item.name,
                  itemStyle: {
                    color: Utils.GetValueColor(item.zdf).color,
                  },
                  item,
                };
              }),
              roseType: 'radius',
              label: {
                color: varibleColors['--main-text-color'],
              },
              labelLine: {
                lineStyle: {
                  color: varibleColors['--main-text-color'],
                },
                smooth: 0.2,
                length: 10,
                length2: 20,
              },
              itemStyle: {
                borderRadius: 10,
                borderColor: varibleColors['--background-color'],
                borderWidth: 1,
              },
              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: () => Math.random() * 200,
            },
          ],
        });
        chartInstance?.off('click');
        chartInstance?.on('click', (params: any) => {
          const { market, code } = params.data.item;
          const secid = `${market}.${code}`;
          setDetailStockDrawer(secid);
        });
      },
      refreshDeps: [darkMode, code, securitiesCodes],
      ready: !!chartInstance,
    }
  );

  return (
    <ChartCard onFresh={runGetSecuritiesWareHouseFromEastmoney}>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%' }} />
        <CustomDrawer show={showDetailStockDrawer}>
          <DetailStockContent onEnter={closeDetailStockDrawer} onClose={closeDetailStockDrawer} secid={stockSecid} />
        </CustomDrawer>
      </div>
    </ChartCard>
  );
};

export default SecuritiesWareHouse;
