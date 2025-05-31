import React from 'react';
import clsx from 'clsx';
import { Tabs, Button } from 'antd';

import CustomDrawer from '@/components/CustomDrawer';
import ChartCard from '@/components/Card/ChartCard';
import { useDrawer, useAppSelector } from '@/utils/hooks';
import * as Enums from '@/utils/enums';

import styles from './index.module.css';

const AddFundContent = React.lazy(() => import('@/components/Home/FundView/AddFundContent'));
const DetailFundContent = React.lazy(() => import('@/components/Home/FundView/DetailFundContent'));
interface FundSearchProps {
  groupList: Stock.SearchResult[];
}

export const fundTypesConfig = [
  // { name: 'AB股', code: Enums.StockMarketType.AB },
  // { name: '指数', code: Enums.FundMarketType.Zindex },
  // { name: '板块', code:  Enums.FundMarketType.Quotation },
  // { name: '港股', code: Enums.StockMarketType.HK },
  // { name: '美股', code: Enums.StockMarketType.US },
  // { name: '英股', code: Enums.StockMarketType.UK },
  // { name: '三板', code: Enums.StockMarketType.XSB },
  { name: '基金', code: Enums.StockMarketType.Fund },
  // { name: '债券', code: Enums.StockMarketType.Bond },
];

const FundSearch: React.FC<FundSearchProps> = (props) => {
  const { groupList } = props;
  const codeMap = useAppSelector((state) => state.wallet.fundConfigCodeMap);
  const { data: addCode, show: showAddDrawer, set: setAddDrawer, close: closeAddDrawer } = useDrawer('');
  const { data: fundCode, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');

  const list = groupList.filter(({ Type }) => fundTypesConfig.map(({ code }) => code).includes(Type));

  return list.length ? (
    <div className={clsx(styles.content)}>
      <Tabs
        animated={{ tabPane: true }}
        tabBarGutter={15}
        destroyInactiveTabPane
        items={list.map(({ Datas, Name, Type }) => ({
          key: String(Type),
          label: Name,
          children: (
            <ChartCard pureContent showCollapse>
              {Datas.map(({ Name, Code }) => {
                return (
                  <div key={`${Code}${Name}`} className={styles.stock} onClick={() => setDetailDrawer(Code)}>
                    <div>
                      <div className={styles.name}>
                        <span className={styles.nameText}>{Name}</span>
                      </div>
                      <div className={styles.code}>{Code}</div>
                    </div>
                    <Button
                      type="primary"
                      disabled={!!codeMap[Code]}
                      onClick={(e) => {
                        setAddDrawer(Code);
                        e.stopPropagation();
                      }}
                    >
                      {!!codeMap[Code] ? '已添加' : '自选'}
                    </Button>
                  </div>
                );
              })}
            </ChartCard>
          ),
        }))}
      />
      <CustomDrawer show={showAddDrawer}>
        <AddFundContent onEnter={closeAddDrawer} onClose={closeAddDrawer} defaultCode={addCode} />
      </CustomDrawer>
      <CustomDrawer show={showDetailDrawer}>
        <DetailFundContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} code={fundCode} />
      </CustomDrawer>
    </div>
  ) : (
    <></>
  );
};

export default FundSearch;
