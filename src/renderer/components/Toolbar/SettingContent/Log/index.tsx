import classnames from 'classnames';
import React, { useState } from 'react';
import { Timeline, Spin } from 'antd';
import { useRequest } from 'ahooks';

import * as Services from '@/services';
import styles from './index.module.scss';

interface LogProps {}

const { version } = window.contextModules.process;

const Log: React.FC<LogProps> = () => {
  const [logs, setLogs] = useState<
    {
      date: string;
      version: string;
      contents: string[];
    }[]
  >([]);

  const { loading } = useRequest(Services.Log.GetLog, {
    onSuccess: setLogs,
  });

  return (
    <Spin spinning={loading}>
      <div className={classnames(styles.content)}>
        <Timeline>
          {logs.map((log) => (
            <Timeline.Item
              key={log.version}
              color={log.version.slice(1) === version ? 'blue' : log.version.slice(1) > version ? 'green' : 'gray'}
            >
              <div className={classnames(styles.item, styles.title)}>
                <div>{log.version}</div>
                <div>{log.date}</div>
              </div>
              {log.contents.map((content, index) => (
                <div className={styles.item} key={index}>
                  {content}
                </div>
              ))}
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </Spin>
  );
};

export default Log;
