import React from 'react';
import clsx from 'clsx';
import ColorHash from 'color-hash';
import { useRequest } from 'ahooks';

import ArrowDownIcon from '@/static/icon/arrow-down.svg';
import ArrowUpIcon from '@/static/icon/arrow-up.svg';
import { useHomeContext } from '@/components/Home';
import Collapse from '@/components/Collapse';

import { toggleStockCollapseAction, setIndustryMapAction } from '@/store/features/stock';
import { useResizeEchart, useRenderEcharts, useAppDispatch, useAppSelector } from '@/utils/hooks';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.scss';

const colorHash = new ColorHash();
export interface RowProps {
  stock: Stock.ResponseItem & Stock.ExtraRow;
  onDetail: (code: string) => void;
}

const arrowSize = {
  width: 12,
  height: 12,
};

const TrendChart: React.FC<{
  trends: Stock.TrendItem[];
  zs: number;
}> = ({ trends = [], zs = 0 }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(0.24);
  const { darkMode } = useHomeContext();

  useRenderEcharts(
    () => {
      const { color } = Utils.GetValueColor(Number(trends[trends.length - 1]?.last) - zs);
      chartInstance?.setOption({
        title: {
          text: '',
        },
        tooltip: {
          show: false,
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 2,
          top: 2,
        },
        xAxis: {
          type: 'category',
          data: trends.map(({ datetime, last }) => datetime),
          boundaryGap: false,
          show: false,
        },
        yAxis: {
          type: 'value',
          show: false,
          scale: true,
          min: (value: any) => Math.min(value.min, zs),
          max: (value: any) => Math.max(value.max, zs),
        },
        series: [
          {
            data: trends.map(({ datetime, last }) => [datetime, last]),
            type: 'line',
            name: '价格',
            showSymbol: false,
            symbol: 'none',
            smooth: true,
            silent: true,
            lineStyle: { width: 2, color },
            markLine: {
              symbol: 'none',
              label: {
                show: false,
              },
              data: [
                {
                  name: '昨收',
                  yAxis: zs,
                  itemStyle: { color },
                },
              ],
            },
          },
        ],
      });
    },
    chartInstance,
    [darkMode, zs, trends]
  );
  return <div ref={chartRef} style={{ width: 72 }} />;
};

const StockRow: React.FC<RowProps> = (props) => {
  const { stock } = props;
  const dispatch = useAppDispatch();
  const { conciseSetting } = useAppSelector((state) => state.setting.systemSetting);
  const industrys = useAppSelector((state) => state.stock.industryMap[stock.secid]) || [];

  useRequest(() => Services.Stock.GetIndustryFromEastmoney(stock.secid, 1), {
    onSuccess: (datas) => {
      if (datas.length) {
        dispatch(setIndustryMapAction(stock.secid, datas));
      }
    },
    ready: !industrys.length,
  });

  return (
    <>
      <div className={clsx(styles.row)} onClick={() => dispatch(toggleStockCollapseAction(stock))}>
        <div className={styles.arrow}>
          {stock.collapse ? <ArrowUpIcon style={{ ...arrowSize }} /> : <ArrowDownIcon style={{ ...arrowSize }} />}
        </div>
        <div style={{ flex: 1, width: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span className={styles.stockName}>{stock.name}</span>
            {industrys.map((industry) => {
              const color = colorHash.hex(industry.name);
              return (
                <span key={industry.code} className={styles.tag} style={{ backgroundColor: color }}>
                  {industry.name}
                </span>
              );
            })}
          </div>
          {!conciseSetting && (
            <div className={styles.rowBar}>
              <div>
                <span className={styles.code}>{stock.code}</span>
                <span>{stock.time}</span>
              </div>
            </div>
          )}
        </div>
        <div className={clsx(styles.value)}>
          <div className={clsx(styles.zx, Utils.GetValueColor(stock.zdf).textClass)}>
            <TrendChart trends={stock.trends} zs={stock.zs} />
            {/* {stock.zx} */}
            {/* <ArrowLine value={stock.zdf} /> */}
          </div>
          {!conciseSetting && (
            <div className={styles.zd}>
              <div className={clsx(styles.zdd)}>{stock.zx}</div>
              <div className={clsx(styles.zdf, Utils.GetValueColor(stock.zdf).textClass)}>{Utils.Yang(stock.zdf)} %</div>
            </div>
          )}
        </div>
      </div>
      <Collapse isOpened={!!stock.collapse}>
        <div className={styles.collapseContent}>
          {conciseSetting && (
            <section>
              <span>涨跌点：</span>
              <span className={clsx(Utils.GetValueColor(stock.zdd).textClass)}>{Utils.Yang(stock.zdd)}</span>
            </section>
          )}
          {conciseSetting && (
            <section>
              <span>涨跌幅：</span>
              <span className={clsx(Utils.GetValueColor(stock.zdf).textClass)}>{Utils.Yang(stock.zdf)} %</span>
            </section>
          )}
          <section>
            <span>昨收：</span>
            <span>{stock.zs}</span>
          </section>
          <section>
            <span>今开：</span>
            <span>{stock.jk}</span>
          </section>
          <section>
            <span>最高：</span>
            <span className="text-up">{stock.zg}</span>
          </section>
          <section>
            <span>最低：</span>
            <span className="text-down">{stock.zd}</span>
          </section>
          <div className={styles.view}>
            <a onClick={() => props.onDetail(stock.secid)}>{'查看详情 >'}</a>
          </div>
        </div>
      </Collapse>
    </>
  );
};

export default StockRow;
