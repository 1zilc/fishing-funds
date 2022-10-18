import clsx from 'clsx';
import React from 'react';
import { Timeline, Spin } from 'antd';
import { useRequest } from 'ahooks';
import { compareVersions } from 'compare-versions';

import { useAppSelector } from '@/utils/hooks';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.scss';

interface LogProps {}

const Log: React.FC<LogProps> = () => {
  const currentVersion = useAppSelector((state) => state.updater.currentVersion);
  const { data: logs = [], loading } = useRequest(Services.Log.GetLog, {
    cacheKey: Utils.GenerateRequestKey('Log.GetLog'),
    staleTime: 1000 * 60 * 10,
  });

  return (
    <Spin spinning={loading}>
      <div className={clsx(styles.content)}>
        <Timeline>
          {logs.map((log) => {
            const compare = compareVersions(log.version.slice(1), currentVersion);
            return (
              <Timeline.Item key={log.version} color={compare === 0 ? 'blue' : compare > 1 ? 'green' : 'gray'}>
                <div className={clsx(styles.item, styles.title)}>
                  <div>{log.version}</div>
                  <div>{log.date}</div>
                </div>
                {log.contents.map((content, index) => (
                  <div className={styles.item} key={index}>
                    {content}
                  </div>
                ))}
              </Timeline.Item>
            );
          })}
        </Timeline>
      </div>
    </Spin>
  );
};

export default Log;
