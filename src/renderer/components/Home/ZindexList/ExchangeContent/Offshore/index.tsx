import React, { useState } from 'react';
import classnames from 'classnames';
import { useRequest } from 'ahooks';

import ChartCard from '@/components/Card/ChartCard';
import * as Utils from '@/utils';
import * as Services from '@/services';
import styles from './index.module.scss';

interface OffshoreProps {}

const Offshore: React.FC<OffshoreProps> = () => {
  const [data, setData] = useState<Exchange.ResponseItem[]>([]);
  const { run: runGetListFromEastmoney } = useRequest(() => Services.Exchange.GetListFromEastmoney('0', 'm:133'), {
    onSuccess: setData,
    pollingInterval: 1000 * 60,
  });

  return (
    <ChartCard className={styles.content} auto onFresh={runGetListFromEastmoney}>
      {data.map((i) => (
        <div key={i.code} style={{ textAlign: 'center' }}>
          <div>{i.name}最新价</div>
          <div
            className={classnames(Utils.GetValueColor(i.zxj - i.zs).textClass)}
            style={{ fontSize: 20, fontWeight: 500, lineHeight: '24px', marginBottom: 10 }}
          >
            ￥ {i.zxj}
          </div>
          <div className={styles.row}>
            <div>
              涨跌额：
              <span className={classnames(Utils.GetValueColor(i.zde).textClass)}>{i.zde}</span>
            </div>
            <div>
              涨跌幅：
              <span className={classnames(Utils.GetValueColor(i.zdf).textClass)}>{i.zdf}%</span>
            </div>
          </div>
          <div className={styles.row}>
            <div>
              最高：
              <span className={classnames(Utils.GetValueColor(i.zg - i.zs).textClass)}>{i.zg}</span>
            </div>
            <div>
              最低：
              <span className={classnames(Utils.GetValueColor(i.zd - i.zs).textClass)}>{i.zd}</span>
            </div>
          </div>
          <div className={styles.row}>
            <div>
              今开：
              <span className={classnames(Utils.GetValueColor(i.jk - i.zs).textClass)}>{i.jk}</span>
            </div>
            <div>昨收： {i.zs}</div>
          </div>
        </div>
      ))}
    </ChartCard>
  );
};

export default Offshore;
