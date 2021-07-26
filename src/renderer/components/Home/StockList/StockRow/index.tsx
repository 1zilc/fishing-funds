import React from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as ArrowDownIcon } from '@/assets/icons/arrow-down.svg';
import { ReactComponent as ArrowUpIcon } from '@/assets/icons/arrow-up.svg';
import { useHomeContext } from '@/components/Home';
import Collapse from '@/components/Collapse';
import { StoreState } from '@/reducers/types';
import { toggleStockCollapseAction } from '@/actions/stock';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as Utils from '@/utils';
import styles from './index.scss';

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
  const dispatch = useDispatch();
  const { conciseSetting } = useSelector((state: StoreState) => state.setting.systemSetting);

  const onDetailClick = () => {
    props.onDetail(stock.secid);
  };

  return (
    <>
      <div className={classnames(styles.row, 'hoverable')} onClick={() => dispatch(toggleStockCollapseAction(stock))}>
        <div className={styles.arrow}>
          {stock.collapse ? <ArrowUpIcon style={{ ...arrowSize }} /> : <ArrowDownIcon style={{ ...arrowSize }} />}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span className={styles.zindexName}>{stock.name}</span>
          </div>
          {!conciseSetting && (
            <div className={styles.rowBar}>
              <div>
                <span className={styles.code}>{stock.code}</span>
                {/* <span>{zindex.gztime.slice(5)}</span> */}
              </div>
            </div>
          )}
        </div>
        <div className={classnames(styles.value)}>
          <div className={classnames(styles.zx, Utils.GetValueColor(stock.zdf).textClass)}>
            <TrendChart trends={stock.trends} zs={stock.zs} />
            {/* {stock.zx} */}
            {/* <ArrowLine value={stock.zdf} /> */}
          </div>
          {!conciseSetting && (
            <div className={styles.zd}>
              <div className={classnames(styles.zdd)}>{stock.zx}</div>
              <div className={classnames(styles.zdf, Utils.GetValueColor(stock.zdf).textClass)}>{Utils.Yang(stock.zdf)} %</div>
            </div>
          )}
        </div>
      </div>
      <Collapse isOpened={!!stock.collapse}>
        <div className={styles.collapseContent}>
          {conciseSetting && (
            <section>
              <span>涨跌点：</span>
              <span className={classnames(Utils.GetValueColor(stock.zdd).textClass)}>{Utils.Yang(stock.zdd)}</span>
            </section>
          )}
          {conciseSetting && (
            <section>
              <span>涨跌幅：</span>
              <span className={classnames(Utils.GetValueColor(stock.zdf).textClass)}>{Utils.Yang(stock.zdf)} %</span>
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
            <a onClick={onDetailClick}>{'查看详情 >'}</a>
          </div>
        </div>
      </Collapse>
    </>
  );
};

export default StockRow;
