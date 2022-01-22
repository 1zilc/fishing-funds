import React, { useState } from 'react';
import { useRequest } from 'ahooks';
import { Calendar } from 'antd';
import classnames from 'classnames';
import dayjs from 'dayjs';

import ChartCard from '@/components/Card/ChartCard';
import TypeSelection from '@/components/TypeSelection';

import * as Services from '@/services';
import styles from './index.module.scss';

const marketTypeList = [
  { name: 'A股', type: 0, code: '0' },
  { name: '港股', type: 1, code: '1' },
  { name: '港股通(沪)、港股通(深)', type: 2, code: '2' },
  { name: '沪股通、深股通', type: 3, code: '3' },
];

const today = dayjs();

interface ClosedCalendarProps {}

const ClosedCalendar: React.FC<ClosedCalendarProps> = () => {
  const [marketType, setMarketType] = useState(marketTypeList[0]);
  const [closeDates, setCloseDates] = useState<{ mkt: string; holiday: string; sdate: string; edate: string; xs: string }[]>([]);
  const { run: runStockGetCloseDayDates } = useRequest(Services.Stock.GetCloseDayDates, {
    onSuccess: setCloseDates,
  });
  const currentCloseDates = closeDates.filter(({ mkt }) => marketType.name === mkt);
  return (
    <ChartCard TitleBar={<div className={styles.titleBar}>仅展示节假日、特殊工作日</div>} onFresh={runStockGetCloseDayDates}>
      <div className={classnames(styles.content)}>
        <Calendar
          fullscreen={false}
          validRange={[today.subtract(1, 'year'), today.add(1, 'year')]}
          dateFullCellRender={(d) => {
            const date = dayjs(d.format('YYYY/M/D'));
            const day = currentCloseDates.find(({ sdate, edate }) => date.isSameOrAfter(sdate) && date.isSameOrBefore(edate));
            const isToday = date.isSame(today.format('YYYY/M/D'));
            return (
              <div className={styles.filed}>
                {day ? (
                  <div className="flex flex-column f-a-i-c">
                    <span className={styles.closed}>{isToday ? '今' : '休'}</span>
                    <div className={styles.holiday}>{day.holiday.slice(0, 2)}</div>
                  </div>
                ) : isToday ? (
                  '今'
                ) : (
                  d.date()
                )}
              </div>
            );
          }}
        />
      </div>
      <TypeSelection
        types={marketTypeList}
        activeType={marketType.type}
        onSelected={setMarketType}
        style={{ marginTop: 10, marginBottom: 10 }}
        colspan={12}
      />
    </ChartCard>
  );
};

export default ClosedCalendar;
