import React from 'react';
import clsx from 'clsx';
import * as echarts from 'echarts/core';
import { useRequest } from 'ahooks';
import { RiArrowDownSLine, RiArrowUpSLine, RiEditLine, RiDeleteBin6Line } from 'react-icons/ri';
import Collapse from '@/components/Collapse';
import ArrowLine from '@/components/ArrowLine';
import MemoNote from '@/components/MemoNote';
import { setIndustryMapAction } from '@/store/features/stock';
import { toggleStockCollapseAction } from '@/store/features/wallet';
import { useResizeEchart, useRenderEcharts, useAppDispatch, useAppSelector } from '@/utils/hooks';
import colorHash from '@/utils/colorHash';
import * as Services from '@lib/enh/services';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';
import * as Helpers from '@/helpers';
import styles from './index.module.css';

export interface RowProps {
  stock: Stock.ResponseItem & Stock.ExtraRow;
  onEdit?: (fund: Stock.SettingItem) => void;
  onDelete?: (fund: Stock.SettingItem) => void;
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

  useRenderEcharts(
    () => {
      const { color, bgColor } = Utils.GetValueColor(Number(trends[trends.length - 1]?.last) - zs);
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
          splitLine: {
            lineStyle: {
              color: 'var(--border-color)',
            },
          },
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
            lineStyle: { width: 2, color: color },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: color,
                },
                {
                  offset: 1,
                  color: bgColor,
                },
              ]),
            },
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
    [zs, trends]
  );
  return <div ref={chartRef} style={{ width: 72 }} />;
};

const StockRow: React.FC<RowProps> = (props) => {
  const { stock } = props;
  const dispatch = useAppDispatch();
  const eyeStatus = useAppSelector((state) => state.wallet.eyeStatus);
  const conciseSetting = useAppSelector((state) => state.setting.systemSetting.conciseSetting);
  const industrys = useAppSelector((state) => state.stock.industryMap[stock.secid]) || [];
  const stockViewMode = useAppSelector((state) => state.sort.viewMode.stockViewMode);
  const stockConfigCodeMap = useAppSelector((state) => state.wallet.stockConfigCodeMap);
  const calcStockResult = Helpers.Stock.CalcStock(stock, stockConfigCodeMap);

  const stockConfig = stockConfigCodeMap[stock.secid];

  useRequest(() => Services.Stock.GetIndustryFromEastmoney(stock.secid, 1), {
    onSuccess: (datas) => {
      if (datas.length) {
        dispatch(setIndustryMapAction({ secid: stock.secid, industrys: datas }));
      }
    },
    ready: !industrys.length,
  });

  function onEditClick() {
    props.onEdit?.(stockConfig);
  }

  function onDeleteClick() {
    props.onDelete?.(stockConfig);
  }

  return (
    <>
      <div className={clsx(styles.row)} onClick={() => dispatch(toggleStockCollapseAction(stock))}>
        <div className={styles.arrow}>
          {stock.collapse ? <RiArrowUpSLine style={{ ...arrowSize }} /> : <RiArrowDownSLine style={{ ...arrowSize }} />}
        </div>
        <div style={{ flex: 1, width: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className={styles.stockName}>{stock.name}</span>
            {industrys.map((industry) => {
              const color = colorHash.hex(industry.name);
              return (
                <span key={industry.code} className={styles.tag} style={{ backgroundColor: color }}>
                  {industry.name}
                </span>
              );
            })}
            {!!calcStockResult.cyfe && <span className={styles.hold}>持有</span>}
            {!!calcStockResult.cbj && eyeStatus && (
              <span className={clsx(Utils.GetValueColor(calcStockResult.gscysyl).blockClass, styles.gscysyl)}>
                {calcStockResult.gscysyl === '' ? `0.00%` : `${Utils.Yang(calcStockResult.gscysyl)}%`}
              </span>
            )}
          </div>
          {!conciseSetting && (
            <div className={styles.rowBar}>
              <div>
                <span className={styles.code}>{stock.code}</span>
                <span>{stock.time}</span>
                {eyeStatus && (
                  <span className={clsx(Utils.GetValueColor(calcStockResult.jrsygz).textClass, styles.worth)}>
                    {Utils.Yang(calcStockResult.jrsygz.toFixed(2))}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        <div className={clsx(styles.value)}>
          <div className={clsx(styles.zx, Utils.GetValueColor(stock.zdf).textClass)}>
            {stockViewMode.type === Enums.StockViewType.Chart ? (
              <TrendChart trends={stock.trends} zs={stock.zs} />
            ) : (
              <>
                {stock.zx}
                <ArrowLine value={stock.zdf} />
              </>
            )}
          </div>
          {!conciseSetting && (
            <div className={styles.zd}>
              {stockViewMode.type === Enums.StockViewType.Chart ? (
                <div className={clsx(styles.zdd)}>{stock.zx}</div>
              ) : (
                <div className={clsx(styles.zdd, Utils.GetValueColor(stock.zdd).textClass)}>{Utils.Yang(stock.zdd)}</div>
              )}
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
          <section>
            <span>持股数：</span>
            <span>{stockConfig.cyfe || 0}</span>
            <RiEditLine className={styles.editor} onClick={onEditClick} />
            <RiDeleteBin6Line className={styles.editor} onClick={onDeleteClick} />
          </section>
          <section>
            <span>成本金额：</span>
            <span>{calcStockResult.cbje !== undefined ? `¥ ${calcStockResult.cbje.toFixed(2)}` : '暂无'}</span>
          </section>
          <section>
            <span>持有收益率：</span>
            <span className={clsx(Utils.GetValueColor(calcStockResult.cysyl).textClass)}>
              {calcStockResult.cysyl !== undefined ? `${Utils.Yang(calcStockResult.cysyl.toFixed(2))}%` : '暂无'}
            </span>
          </section>
          <section>
            <span>今日收益：</span>
            <span className={clsx(Utils.GetValueColor(calcStockResult.jrsygz).textClass)}>
              ¥ {Utils.Yang(calcStockResult.jrsygz.toFixed(2))}
            </span>
          </section>
          <section>
            <span>持有收益：</span>
            <span className={clsx(Utils.GetValueColor(calcStockResult.cysy).textClass)}>
              {calcStockResult.cysy !== undefined ? `¥ ${Utils.Yang(calcStockResult.cysy.toFixed(2))}` : '暂无'}
            </span>
          </section>
          <section>
            <span>今日总额：</span>
            <span>¥ {calcStockResult.gszz.toFixed(2)}</span>
          </section>
          <section>
            <span>成本价：</span>
            {calcStockResult.cbj !== undefined ? <span>{calcStockResult.cbj}</span> : <a onClick={onEditClick}>录入</a>}
          </section>
          {stockConfig.memo && <MemoNote text={stockConfig.memo} />}
          <div className={styles.view}>
            <a onClick={() => props.onDetail(stock.secid)}>{'查看详情 >'}</a>
          </div>
        </div>
      </Collapse>
    </>
  );
};

export default StockRow;
