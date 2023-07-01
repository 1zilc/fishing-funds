import React from 'react';
import clsx from 'clsx';
import { RiArrowDownSLine, RiArrowUpSLine, RiEditLine } from 'react-icons/ri';
import Collapse from '@/components/Collapse';
import ArrowLine from '@/components/ArrowLine';
import MemoNote from '@/components/MemoNote';

import { toggleZindexCollapseAction } from '@/store/features/zindex';
import { useAppDispatch, useAppSelector, useRenderEcharts, useResizeEchart } from '@/utils/hooks';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';
import styles from './index.module.scss';

export interface RowProps {
  zindex: Zindex.ResponseItem & Zindex.ExtraRow;
  onEdit?: (fund: Zindex.SettingItem) => void;
  onDetail: (code: string) => void;
}

const arrowSize = {
  width: 12,
  height: 12,
};

const TrendChart: React.FC<{
  trends: Zindex.TrendItem[];
  zs: number;
}> = ({ trends = [], zs = 0 }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(0.24);

  useRenderEcharts(
    () => {
      const { color } = Utils.GetValueColor(Number(trends[trends.length - 1]?.price) - zs);
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
          data: trends.map(({ time }) => time),
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
            data: trends.map(({ time, price }) => [time, price]),
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
    [zs, trends]
  );
  return <div ref={chartRef} style={{ width: 72 }} />;
};

const ZindexRow: React.FC<RowProps> = (props) => {
  const { zindex } = props;
  const dispatch = useAppDispatch();
  const { conciseSetting } = useAppSelector((state) => state.setting.systemSetting);
  const zindexViewMode = useAppSelector((state) => state.sort.viewMode.zindexViewMode);
  const zindexConfigCodeMap = useAppSelector((state) => state.zindex.config.codeMap);

  const zindexConfig = zindexConfigCodeMap[zindex.code];

  const onDetailClick = () => {
    props.onDetail(zindex.code);
  };

  function onEditClick() {
    props.onEdit?.(zindexConfig);
  }

  return (
    <>
      <div
        className={clsx(styles.row)}
        onClick={() => {
          dispatch(toggleZindexCollapseAction(zindex));
        }}
      >
        <div className={styles.arrow}>
          {zindex.collapse ? (
            <RiArrowUpSLine style={{ ...arrowSize }} />
          ) : (
            <RiArrowDownSLine style={{ ...arrowSize }} />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className={styles.zindexName}>{zindex.name}</span>
          </div>
          {!conciseSetting && (
            <div className={styles.rowBar}>
              <div>
                <span className={styles.code}>{zindex.zindexCode}</span>
                <span>{zindex.time}</span>
              </div>
            </div>
          )}
        </div>
        <div className={clsx(styles.value)}>
          <div className={clsx(styles.zsz, Utils.GetValueColor(zindex.zdf).textClass)}>
            {zindexViewMode.type === Enums.ZindexViewType.Chart ? (
              <TrendChart trends={zindex.trends} zs={zindex.zs} />
            ) : (
              <>
                {zindex.zsz}
                <ArrowLine value={zindex.zdf} />
              </>
            )}
          </div>
          {!conciseSetting && (
            <div className={styles.zd}>
              {zindexViewMode.type === Enums.ZindexViewType.Chart ? (
                <div className={clsx(styles.zdd)}>{zindex.zsz}</div>
              ) : (
                <div className={clsx(styles.zdd, Utils.GetValueColor(zindex.zdd).textClass)}>
                  {Utils.Yang(zindex.zdd)}
                </div>
              )}
              <div className={clsx(styles.zdf, Utils.GetValueColor(zindex.zdf).textClass)}>
                {Utils.Yang(zindex.zdf)} %
              </div>
            </div>
          )}
        </div>
      </div>
      <Collapse isOpened={zindex.collapse}>
        <div className={styles.collapseContent}>
          {conciseSetting && (
            <section>
              <span>涨跌点：</span>
              <span className={clsx(Utils.GetValueColor(zindex.zdd).textClass)}>{Utils.Yang(zindex.zdd)}</span>
            </section>
          )}
          {conciseSetting && (
            <section>
              <span>涨跌幅：</span>
              <span className={clsx(Utils.GetValueColor(zindex.zdf).textClass)}>{Utils.Yang(zindex.zdf)} %</span>
            </section>
          )}
          <section>
            <span>昨收：</span>
            <span>{zindex.zs}</span>
            <RiEditLine className={styles.editor} onClick={onEditClick} />
          </section>
          <section>
            <span>今开：</span>
            <span className={clsx(Utils.GetValueColor(zindex.jk - zindex.zs).textClass)}>{zindex.jk}</span>
          </section>
          <section>
            <span>最高：</span>
            <span className={clsx(Utils.GetValueColor(zindex.zg - zindex.zs).textClass)}>{zindex.zg}</span>
          </section>
          <section>
            <span>最低：</span>
            <span className={clsx(Utils.GetValueColor(zindex.zd - zindex.zs).textClass)}>{zindex.zd}</span>
          </section>
          <section>
            <span>换手：</span>
            <span>{zindex.hs} %</span>
          </section>
          <section>
            <span>振幅：</span>
            <span>{zindex.zf} %</span>
          </section>
          {conciseSetting && (
            <section>
              <span>指数代码：</span>
              <span>{zindex.zindexCode}</span>
            </section>
          )}
          {zindexConfig.memo && <MemoNote text={zindexConfig.memo} />}
          <div className={styles.view}>
            <a onClick={onDetailClick}>{'查看详情 >'}</a>
          </div>
        </div>
      </Collapse>
    </>
  );
};

export default ZindexRow;
