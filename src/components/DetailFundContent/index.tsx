import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { renderToString } from 'react-dom/server';
import { useRequest, useSize } from 'ahooks';
import * as echarts from 'echarts';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import PictureImage from '@/assets/img/picture.svg';
import Estimate from '@/components/DetailFundContent/Estimate';
import { useNativeThemeColor } from '@/utils/hooks';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.scss';

export interface DetailFundContentProps {
  onEnter: () => void;
  onClose: () => void;
  fund: Fund.ResponseItem;
}

const varibles = ['--increase-color', '--reduce-color', '--main-text-color'];

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
  const [pingzhongdata, setPingzhongdata] = useState<Fund.PingzhongData>({});
  const [
    warehoseChartInstance,
    setWarehoseChartInstance,
  ] = useState<echarts.ECharts | null>(null);
  const { width: warehouseRefWidth } = useSize(warehouseRef);
  const { colors: varibleColors, darkMode } = useNativeThemeColor(varibles);

  const { run: runGetFundDetailFromEastmoney } = useRequest(
    Services.Fund.GetFundDetailFromEastmoney,
    {
      manual: true,
      onSuccess: (result) => {
        console.log(result);
        setPingzhongdata(result);
      },
    }
  );
  const { run: runGetEstimatedFromEastmoney } = useRequest(
    Services.Fund.GetEstimatedFromEastmoney,
    {
      manual: true,
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
                    color:
                      item.zdf >= 0
                        ? varibleColors['--increase-color']
                        : varibleColors['--reduce-color'],
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
          color: varibleColors['--main-text-color'],
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
            color: varibleColors['--main-text-color'],
            borderRadius: 10,
            borderColor: 'rgba(255,255,255,0.3)',
            borderWidth: 1,
            // shadowBlur: 200,
            // shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: () => Math.random() * 200,
        },
      ],
    });
    setWarehoseChartInstance(warehoseChartInstance);
  };

  useEffect(() => {
    initWarehoseChart();
    runGetFundDetailFromEastmoney(fund.fundcode);
    runGetEstimatedFromEastmoney(fund.fundcode);
    runGetWareHouseFromEastmoney(fund.fundcode);
  }, []);

  useEffect(() => {
    warehoseChartInstance?.resize({
      height: warehouseRefWidth,
    });
  }, [warehouseRefWidth]);

  return (
    <CustomDrawerContent
      title="基金详情"
      enterText="刷新"
      onClose={props.onClose}
      onEnter={props.onEnter}
    >
      <div className={styles.content}>
        <h3>{fund.name}</h3>
        <div>{fund.fundcode}</div>
        <div className={styles.detail}>
          <div className={styles.detailItem}>
            <div
              className={classnames(
                styles.syl_1n,
                Number(pingzhongdata.syl_1n) >= 0 ? 'up-text' : 'down-text'
              )}
            >
              {Utils.Yang(pingzhongdata.syl_1n)}%
            </div>
            <div className={styles.detailItemLabel}>近一年涨跌幅</div>
          </div>
          <div className={styles.detailItem}>
            <div
              className={classnames(
                Number(fund.gszzl) >= 0 ? 'up-text' : 'down-text'
              )}
            >
              {Utils.Yang(fund.gszzl)}%
            </div>
            <div className={styles.detailItemLabel}>日涨跌幅</div>
          </div>
          <div className={styles.detailItem}>
            <div>{fund.dwjz}</div>
            <div className={styles.detailItemLabel}>
              净值 {fund.jzrq.slice(5)}
            </div>
          </div>
        </div>
        <div className={styles.introduce}></div>
        <h3>估值走势</h3>
        <Estimate code={fund.fundcode} />
        <h3>持仓详情</h3>
        <div className={styles.warehouse}>
          <div ref={warehouseRef} style={{ height: 300, width: '100%' }}></div>
        </div>
      </div>
    </CustomDrawerContent>
  );
};
export default DetailFundContent;
