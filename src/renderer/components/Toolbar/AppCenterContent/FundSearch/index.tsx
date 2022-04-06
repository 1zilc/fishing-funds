import React from 'react';
import clsx from 'clsx';
import { Tabs } from 'antd';

import CustomDrawer from '@/components/CustomDrawer';
import { useDrawer, useCurrentWallet } from '@/utils/hooks';
import * as Enums from '@/utils/enums';

import styles from './index.module.scss';

const AddFundContent = React.lazy(() => import('@/components/Home/FundList/AddFundContent'));
const DetailFundContent = React.lazy(() => import('@/components/Home/FundList/DetailFundContent'));
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
  const { currentWalletFundsCodeMap: codeMap } = useCurrentWallet();
  const { data: addCode, show: showAddDrawer, set: setAddDrawer, close: closeAddDrawer } = useDrawer('');
  const { data: fundCode, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');

  const list = groupList.filter(({ Type }) => fundTypesConfig.map(({ code }) => code).includes(Type));

  return list.length ? (
    <div className={clsx(styles.content)}>
      <Tabs animated={{ tabPane: true }} tabBarGutter={15} destroyInactiveTabPane>
        {list.map(({ Datas, Name, Type }) => (
          <Tabs.TabPane className={styles.tab} tab={Name} key={String(Type)}>
            {Datas.map(({ Name, Code }) => {
              return (
                <div key={`${Code}${Name}`} className={styles.stock} onClick={() => setDetailDrawer(Code)}>
                  <div>
                    <div className={styles.name}>
                      <span className={styles.nameText}>{Name}</span>
                    </div>
                    <div className={styles.code}>{Code}</div>
                  </div>
                  {codeMap[Code] ? (
                    <button className={styles.added} disabled>
                      已添加
                    </button>
                  ) : (
                    <button
                      className={styles.select}
                      onClick={(e) => {
                        setAddDrawer(Code);
                        e.stopPropagation();
                      }}
                    >
                      自选
                    </button>
                  )}
                </div>
              );
            })}
          </Tabs.TabPane>
        ))}
      </Tabs>
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
