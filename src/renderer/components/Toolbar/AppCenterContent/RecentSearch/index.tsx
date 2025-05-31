import React from 'react';
import clsx from 'clsx';
import { Tabs } from 'antd';

import CustomDrawer from '@/components/CustomDrawer';
import Recent from '@/components/Home/NewsList/Recent';
import * as Enums from '@/utils/enums';

import styles from './index.module.css';

interface RecentSearchProps {
  keyword: string;
}

const RecentSearch: React.FC<RecentSearchProps> = (props) => {
  const { keyword } = props;
  return keyword ? (
    <div className={clsx(styles.content)}>
      <Tabs
        animated={{ tabPane: true }}
        tabBarGutter={15}
        destroyInactiveTabPane
        items={[
          {
            key: String(0),
            label: '新闻资讯',
            children: <Recent keyword={keyword} />,
          },
        ]}
      />
    </div>
  ) : (
    <></>
  );
};

export default RecentSearch;
