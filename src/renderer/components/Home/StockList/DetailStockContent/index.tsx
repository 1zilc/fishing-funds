import React, { useState } from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useRequest } from 'ahooks';
import { message, Tabs } from 'antd';

import Trend from '@/components/Home/StockList/DetailStockContent/Trend';
import ColorfulTags from '@/components/ColorfulTags';
import Estimate from '@/components/Home/StockList/DetailStockContent/Estimate';
import K from '@/components/Home/StockList/DetailStockContent/K';
import Company from '@/components/Home/StockList/DetailStockContent/Company';
import Stocks from '@/components/Home/StockList/DetailStockContent/Stocks';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import { addStockAction } from '@/actions/stock';
import { StoreState } from '@/reducers/types';
import * as Services from '@/services';
import * as Utils from '@/utils';

import styles from './index.module.scss';

export interface DetailStockContentProps {
  onEnter: () => void;
  onClose: () => void;
  secid: string;
  type?: number;
}

const DetailStockContent: React.FC<DetailStockContentProps> = (props) => {
  const { secid, type } = props;
  const dispatch = useDispatch();
  const [stock, setStock] = useState<Stock.DetailItem | Record<string, any>>({});
  const [industrys, setIndustrys] = useState<Stock.IndustryItem[]>([]);
  const { codeMap } = useSelector((state: StoreState) => state.stock.config);
  useRequest(Services.Stock.GetDetailFromEastmoney, {
    pollingInterval: 1000 * 60,
    defaultParams: [secid],
    onSuccess: setStock,
  });

  useRequest(Services.Stock.GetIndustryFromEastmoney, {
    defaultParams: [secid, 3],
    onSuccess: setIndustrys,
  });

  async function onAdd() {
    try {
      const code = stock.code || secid.split('.').pop();
      let stockType = type;
      if (!stockType) {
        const result = await Services.Stock.SearchFromEastmoney(code);
        result.forEach((market) => {
          market.Datas.forEach(({ MktNum, Code }) => {
            if (secid === `${MktNum}.${Code}`) {
              stockType = market.Type;
            }
          });
        });
      }
      if (!stockType) {
        return;
      }
      dispatch(
        addStockAction({
          market: stock.market!,
          code: stock.code!,
          name: stock.name!,
          secid,
          type: stockType,
        })
      );
    } catch (error) {
      message.error('添加失败');
    }
  }

  return (
    <CustomDrawerContent title="股票详情" enterText="确定" onClose={props.onClose} onEnter={props.onEnter}>
      <div className={styles.content}>
        <div className={styles.container}>
          <h3 className={styles.titleRow}>
            <span className="copify">{stock.name}</span>
            <span className={classnames(Utils.GetValueColor(stock.zdd).textClass)}>{stock.zx}</span>
          </h3>
          <div className={styles.subTitleRow}>
            <div>
              <span className="copify">{stock.code}</span>
              {!codeMap[secid] && (
                <a className={styles.selfAdd} onClick={onAdd}>
                  +加自选
                </a>
              )}
            </div>
            <div>
              <span className={styles.detailItemLabel}>涨跌点：</span>
              <span className={classnames(Utils.GetValueColor(stock.zdd).textClass)}>{Utils.Yang(stock.zdd)}</span>
            </div>
          </div>
          <div className={styles.detail}>
            <div className={classnames(styles.detailItem, 'text-left')}>
              <div className={classnames(Utils.GetValueColor(stock.zdf).textClass)}>{Utils.Yang(stock.zdf)}%</div>
              <div className={styles.detailItemLabel}>涨跌幅</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-center')}>
              <div>{stock.hs}%</div>
              <div className={styles.detailItemLabel}>换手率</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-right')}>
              <div>{stock.zss}万</div>
              <div className={styles.detailItemLabel}>总手数</div>
            </div>
          </div>
          <div className={styles.detail}>
            <div className={classnames(styles.detailItem, 'text-left')}>
              <div className={classnames(Utils.GetValueColor(stock.jk - stock.zs).textClass)}>{Utils.Yang(stock.jk)}</div>
              <div className={styles.detailItemLabel}>今开</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-center')}>
              <div className={classnames('text-up')}>{stock.zg}</div>
              <div className={styles.detailItemLabel}>最高</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-right')}>
              <div className={classnames('text-down')}>{stock.zd}</div>
              <div className={styles.detailItemLabel}>最低</div>
            </div>
          </div>
          <div className={styles.detail}>
            <div className={classnames(styles.detailItem, 'text-left')}>
              <div>{stock.zs}</div>
              <div className={styles.detailItemLabel}>昨收</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-center')}>
              <div className={classnames('text-up')}>{stock.zt}</div>
              <div className={styles.detailItemLabel}>涨停</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-right')}>
              <div className={classnames('text-down')}>{stock.dt}</div>
              <div className={styles.detailItemLabel}>跌停</div>
            </div>
          </div>
          <div className={styles.detail}>
            <div className={classnames(styles.detailItem, 'text-left')}>
              <div>{stock.wp}万</div>
              <div className={styles.detailItemLabel}>外盘</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-center')}>
              <div>{stock.np}万</div>
              <div className={styles.detailItemLabel}>内盘</div>
            </div>
            <div className={classnames(styles.detailItem, 'text-right')}>
              <div>{stock.jj}</div>
              <div className={styles.detailItemLabel}>均价</div>
            </div>
          </div>
          <ColorfulTags tags={industrys.map((industry) => industry.name)} />
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="股票走势" key={String(0)}>
              <Trend secid={secid} zs={stock.zs} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="走势详情" key={String(1)}>
              <Estimate secid={secid} />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="K线" key={String(0)}>
              <K secid={secid} />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.container}>
          <Tabs animated={{ tabPane: true }} tabBarGutter={15}>
            <Tabs.TabPane tab="公司概况" key={String(0)}>
              <Company secid={secid} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="同类股票" key={String(1)}>
              <Stocks secid={secid} />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </CustomDrawerContent>
  );
};
export default DetailStockContent;
