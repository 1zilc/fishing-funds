import React, { useEffect, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { remote } from 'electron';
import * as echarts from 'echarts';

import PictureImage from '@/assets/img/picture.svg';
import * as Services from '@/services';

import styles from './index.scss';
import { useRequest, useSize } from 'ahooks';

export interface DetailFundContentProps {
  show?: boolean;
  onEnter: () => void;
  onClose: () => void;
  fund: Fund.ResponseItem;
}

const Tooltip = (props) => {
  const { item } = props;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipName}>股票名称：{item.name}</div>
      <div className={styles.tooltipStockCode}>股票代码：{item.stockCode}</div>
      <div className={styles.tooltipCcb}>持仓占比：{item.ccb}%</div>
      <div className={item.zdf < 0 ? 'down-text' : 'up-text'}>
        涨跌幅：{item.zdf}%
      </div>
    </div>
  );
};

const DetailFundContent: React.FC<DetailFundContentProps> = (props) => {
  const { fund } = props;
  const warehouseRef = useRef<HTMLDivElement>(null);
  const [estimate, setEstimate] = useState(PictureImage);
  const [warehose, setWarehouse] = useState<any>([]);
  const [
    warehoseChartInstance,
    setWarehoseChartInstance,
  ] = useState<echarts.ECharts | null>(null);
  const { width: warehouseRefWidth } = useSize(warehouseRef);
  const { run: runGetEstimatedFromEastmoney } = useRequest(
    Services.Fund.GetEstimatedFromEastmoney,
    {
      manual: true,
      // ready: props.show,
      onSuccess: setEstimate,
    }
  );
  const { run: runGetWareHouseFromEastmoney } = useRequest(
    Services.Fund.GetWareHouseFromEastmoney,
    {
      manual: true,
      onSuccess: (result) => {
        setWarehouse(result);
        warehoseChartInstance?.setOption({
          series: [
            {
              data: result.map((item) => {
                return {
                  value: item.ccb,
                  name: item.name,
                  itemStyle: {
                    color: item.zdf >= 0 ? '#a61d24' : '#3c8618',
                  },
                  item,
                };
              }),
            },
          ],
        });
      },
    }
  );

  const initWarehoseChart = () => {
    const warehoseChartInstance = echarts.init(warehouseRef.current!);
    warehoseChartInstance.setOption({
      backgroundColor: 'transparent',
      title: {
        text: '持仓前10股票',
        left: 'center',
        top: 0,
        textStyle: {
          color: '#888',
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) =>
          renderToString(<Tooltip item={params.data.item} />),
      },
      series: [
        {
          name: '持仓占比',
          type: 'pie',
          radius: '60%',
          center: ['50%', '50%'],
          data: [],
          roseType: 'radius',
          label: {
            color: '#888',
          },
          labelLine: {
            lineStyle: {
              color: '#888',
            },
            smooth: 0.2,
            length: 10,
            length2: 20,
          },
          itemStyle: {
            color: '#c23531',
            borderRadius: 10,
            borderColor: 'rgba(255,255,255,0.3)',
            borderWidth: 1,
            // shadowBlur: 200,
            // shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          },
        },
      ],
    });
    setWarehoseChartInstance(warehoseChartInstance);
  };
  useEffect(() => {
    if (props.show) {
      runGetEstimatedFromEastmoney(fund.fundcode);
      runGetWareHouseFromEastmoney(fund.fundcode);
    }
  }, [props.show]);

  useEffect(() => {
    initWarehoseChart();
  }, []);

  useEffect(() => {
    warehoseChartInstance?.resize({
      height: warehouseRefWidth,
    });
  }, [warehouseRefWidth]);

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <button className={styles.close} onClick={props.onClose}>
          关闭
        </button>
        <h3>基金详情</h3>
        <button className={styles.add} onClick={props.onEnter}>
          刷新
        </button>
      </div>
      <div className={styles.body}>
        <h3>{fund.name}</h3>
        <div className={styles.introduce}></div>
        <h3>估值走势</h3>
        <div className={styles.estimate}>
          <img src={estimate} />
        </div>
        <h3>持仓详情</h3>
        <div className={styles.warehouse}>
          <div ref={warehouseRef} style={{ height: 300, width: '100%' }}></div>
        </div>
      </div>
    </div>
  );
};
export default DetailFundContent;
