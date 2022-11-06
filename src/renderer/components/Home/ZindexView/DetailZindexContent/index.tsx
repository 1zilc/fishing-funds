import React from 'react';
import clsx from 'clsx';
import { useRequest } from 'ahooks';
import { Tabs } from 'antd';

import Trend from '@/components/Home/ZindexView/DetailZindexContent/Trend';
import K from '@/components/Home/ZindexView/DetailZindexContent/K';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import Recent from '@/components/Home/NewsList/Recent';
import { RedirectSearchParams } from '@/containers/InitPage';
import { DetailZindexPageParams } from '@/components/Home/ZindexView/DetailZindexPage';
import * as Services from '@/services';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';
import * as CONST from '@/constants';

import styles from './index.module.scss';

export type DetailFundProps = {
  code: string;
};
export interface DetailFundContentProps extends DetailFundProps {
  onEnter: () => void;
  onClose: () => void;
}
const { ipcRenderer } = window.contextModules.electron;

export const DetailZindex: React.FC<DetailFundProps> = (props) => {
  const { code } = props;

  const { data: zindex = {} as any } = useRequest(() => Services.Zindex.FromEastmoney(code), {
    pollingInterval: 1000 * 60,
    cacheKey: Utils.GenerateRequestKey('Zindex.FromEastmoney', code),
  });

  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <h3 className={styles.titleRow}>
          <span className="copify">{zindex?.name}</span>
          <span className={clsx(Utils.GetValueColor(zindex.zdd).textClass)}>{zindex?.zsz}</span>
        </h3>
        <div className={styles.subTitleRow}>
          <span className="copify">{zindex?.zindexCode}</span>
          <div>
            <span className={styles.detailItemLabel}>涨跌点：</span>
            <span className={clsx(Utils.GetValueColor(zindex.zdd).textClass)}>{Utils.Yang(zindex?.zdd)}</span>
          </div>
        </div>
        <div className={styles.detail}>
          <div className={clsx(styles.detailItem, 'text-left')}>
            <div className={clsx(Utils.GetValueColor(zindex.zdf).textClass)}>{Utils.Yang(zindex.zdf)}%</div>
            <div className={styles.detailItemLabel}>涨跌幅</div>
          </div>
          <div className={clsx(styles.detailItem, 'text-center')}>
            <div>{zindex.hs}%</div>
            <div className={styles.detailItemLabel}>换手率</div>
          </div>
          <div className={clsx(styles.detailItem, 'text-right')}>
            <div>{zindex.zf}%</div>
            <div className={styles.detailItemLabel}>振幅</div>
          </div>
        </div>
        <div className={styles.detail}>
          <div className={clsx(styles.detailItem, 'text-left')}>
            <div className={clsx(Utils.GetValueColor(zindex.jk - zindex.zs).textClass)}>{zindex.jk}</div>
            <div className={styles.detailItemLabel}>今开</div>
          </div>
          <div className={clsx(styles.detailItem, 'text-center')}>
            <div className={clsx('text-up')}>{zindex.zg}</div>
            <div className={styles.detailItemLabel}>最高</div>
          </div>
          <div className={clsx(styles.detailItem, 'text-right')}>
            <div className={clsx('text-down')}>{zindex.zd}</div>
            <div className={styles.detailItemLabel}>最低</div>
          </div>
        </div>
        <div className={styles.detail}>
          <div className={styles.detailItem}>
            <div>{zindex.zs}</div>
            <div className={styles.detailItemLabel}>昨收</div>
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <Tabs
          animated={{ tabPane: true }}
          tabBarGutter={15}
          items={[
            {
              key: String(0),
              label: '指数走势',
              children: <Trend code={code} zs={zindex.zs} name={zindex?.name} />,
            },
            {
              key: String(1),
              label: '近期资讯',
              children: <Recent keyword={zindex.name} filter={Enums.NewsFilterType.Title} />,
            },
          ]}
        />
      </div>
      <div className={styles.container}>
        <Tabs
          animated={{ tabPane: true }}
          tabBarGutter={15}
          items={[
            {
              key: String(0),
              label: 'K线',
              children: <K code={code} name={zindex?.name} />,
            },
          ]}
        />
      </div>
    </div>
  );
};

const DetailZindexContent: React.FC<DetailFundContentProps> = (props) => {
  function onOpenChildWindow() {
    const search = Utils.MakeSearchParams('', {
      _redirect: Utils.MakeSearchParams(CONST.ROUTES.DETAIL_ZINDEX, {
        code: props.code,
      } as DetailZindexPageParams),
    } as RedirectSearchParams);
    ipcRenderer.invoke('open-child-window', { search });
  }
  return (
    <CustomDrawerContent title="指数详情" enterText="多窗" onClose={props.onClose} onEnter={onOpenChildWindow}>
      <DetailZindex code={props.code} />
    </CustomDrawerContent>
  );
};
export default DetailZindexContent;
