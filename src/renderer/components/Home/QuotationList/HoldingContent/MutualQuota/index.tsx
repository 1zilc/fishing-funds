import React, { useState } from 'react';
import classnames from 'classnames';
import { useRequest } from 'ahooks';
import StandCard from '@/components/Card/StandCard';
import AddZindexContent from '@/components/Home/ZindexList/AddZindexContent';
import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer } from '@/utils/hooks';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.scss';

interface MutualQuotaProps {}

const MutualQuota: React.FC<MutualQuotaProps> = () => {
  const [list, setList] = useState<any[]>([]);
  useRequest(Services.Quotation.GetMutualQuotaFromEastmoney, {
    onSuccess: setList,
    pollingInterval: 1000 * 60,
  });

  const { data: zindexName, show: showAddZindexDrawer, set: setAddZindexDrawer, close: closeAddZindexDrawer } = useDrawer('');

  return (
    <div className={classnames(styles.content)}>
      {list.map((item) => {
        const color = Utils.GetValueColor(item.indexZdf);
        return (
          <StandCard
            key={item.quota}
            title={item.direction}
            icon={<span className={classnames(styles.tag, color.textClass)}>{color.string}</span>}
          >
            <div className={styles.card}>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  lineHeight: '24px',
                  marginBottom: 10,
                }}
              >
                {item.quota}
              </div>
              <div className={styles.row}>
                <div className={styles.item}>
                  <label>相关指数：</label>
                  <a onClick={() => setAddZindexDrawer(item.indexName)}>{item.indexName}</a>
                </div>
                <div className={styles.item}>
                  <label>净流入：</label>
                  <span className={Utils.GetValueColor(item.dayNetAmtIn).textClass}>{item.dayNetAmtIn}亿</span>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.item}>
                  <label>资金余额：</label>
                  <span>{item.dayAmtRemain}亿</span>
                </div>
                <div className={styles.item}>
                  <label>资金限额：</label>
                  <span>{item.dayAmtThreshold}亿</span>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.item}>
                  <label>上涨数：</label>
                  <span className="text-up">{item.sz}</span>
                </div>
                <div className={styles.item}>
                  <label>下跌数：</label>
                  <span className="text-down">{item.xd}</span>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.item}>
                  <label>持平数：</label>
                  <span className="text-none">{item.cp}</span>
                </div>
                <div className={styles.item}>
                  <label>状态：</label>
                  <span>{item.status}</span>
                </div>
              </div>
            </div>
          </StandCard>
        );
      })}
      <CustomDrawer show={showAddZindexDrawer}>
        <AddZindexContent onEnter={closeAddZindexDrawer} onClose={closeAddZindexDrawer} defaultName={zindexName} />
      </CustomDrawer>
    </div>
  );
};

export default MutualQuota;
