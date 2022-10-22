import clsx from 'clsx';
import React from 'react';
import { Timeline, Spin } from 'antd';
import { useRequest } from 'ahooks';
import { compareVersions } from 'compare-versions';

import StandCard from '@/components/Card/StandCard';
import Empty from '@/components/Empty';
import CalendarIcon from '@/static/icon/calendar.svg';
import RefreshIcon from '@/static/icon/refresh.svg';
import LinkIcon from '@/static/icon/link.svg';
import { useAppSelector } from '@/utils/hooks';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.module.scss';

interface LogProps {}

const { shell } = window.contextModules.electron;

const Log: React.FC<LogProps> = () => {
  const currentVersion = useAppSelector((state) => state.updater.currentVersion);
  const {
    data: logs = [],
    loading,
    run: runGetLog,
  } = useRequest(Services.Log.GetLog, {
    cacheKey: Utils.GenerateRequestKey('Log.GetLog'),
    cacheTime: 1000 * 60,
    staleTime: 1000 * 10,
  });

  function onDetail() {
    shell.openExternal('https://github.com/1zilc/fishing-funds/releases');
  }

  return (
    <div className={styles.layout}>
      <Spin spinning={loading}>
        <StandCard
          icon={<CalendarIcon />}
          title="更新日志"
          extra={
            <div className={styles.toolbar}>
              <RefreshIcon onClick={runGetLog} />
              <LinkIcon onClick={onDetail} />
            </div>
          }
        >
          <div className={clsx(styles.content)}>
            {logs.length ? (
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
            ) : (
              !loading && <Empty text="无法获取更新日志，请重试～" />
            )}
          </div>
        </StandCard>
      </Spin>
    </div>
  );
};

export default Log;
