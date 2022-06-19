import React from 'react';
import clsx from 'clsx';
import { Tabs } from 'antd';

import CustomDrawer from '@/components/CustomDrawer';
import Recent from '@/components/Home/NewsList/Recent';
import * as Enums from '@/utils/enums';

import styles from './index.module.scss';

interface FundSearchProps {
  keyword: string;
}

const FundSearch: React.FC<FundSearchProps> = (props) => {
  const { keyword } = props;
  return keyword ? (
    <div className={clsx(styles.content)}>
      <Tabs animated={{ tabPane: true }} tabBarGutter={15} destroyInactiveTabPane>
        <Tabs.TabPane className={styles.tab} tab="新闻资讯">
          <Recent keyword={keyword} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  ) : (
    <></>
  );
};

export default FundSearch;
