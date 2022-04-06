import React, { useCallback } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { Input, Tabs, message } from 'antd';

import CustomDrawer from '@/components/CustomDrawer';
import { addZindexAction } from '@/actions/zindex';
import { StoreState } from '@/reducers/types';
import { useDrawer } from '@/utils/hooks';
import * as Helpers from '@/helpers';
import * as Enums from '@/utils/enums';
import styles from './index.module.scss';

const DetailZindexContent = React.lazy(() => import('@/components/Home/ZindexView/DetailZindexContent'));

interface ZindexSearchProps {
  groupList: Stock.SearchResult[];
}

export const zindexTypesConfig = [
  // { name: 'AB股', code: Enums.StockMarketType.AB },
  { name: '指数', code: Enums.StockMarketType.Zindex },
  // { name: '板块', code:  Enums.StockMarketType.Quotation },
  // { name: '港股', code: Enums.StockMarketType.HK },
  // { name: '美股', code: Enums.StockMarketType.US },
  // { name: '英股', code: Enums.StockMarketType.UK },
  // { name: '三板', code: Enums.StockMarketType.XSB },
  // { name: '基金', code:  Enums.StockMarketType.Fund },
  // { name: '债券', code: Enums.StockMarketType.Bond },
];

const ZindexSearch: React.FC<ZindexSearchProps> = (props) => {
  const { groupList } = props;
  const dispatch = useDispatch();
  const { codeMap } = useSelector((state: StoreState) => state.zindex.config);
  const { data: detailSecid, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');

  const onAdd = useCallback(async (secid: string) => {
    const zindex = await Helpers.Zindex.GetZindex(secid);
    if (zindex) {
      dispatch(
        addZindexAction({
          code: zindex.code!,
          name: zindex.name!,
        })
      );
    } else {
      message.error('添加指数失败，未找到或数据出错~');
    }
  }, []);

  const list = groupList.filter(({ Type }) => zindexTypesConfig.map(({ code }) => code).includes(Type));

  return list.length ? (
    <div className={clsx(styles.content)}>
      <Tabs animated={{ tabPane: true }} tabBarGutter={15} destroyInactiveTabPane>
        {list.map(({ Datas, Name, Type }) => (
          <Tabs.TabPane className={styles.tab} tab={Name} key={String(Type)}>
            {Datas.map(({ Name, Code, MktNum }) => {
              const secid = `${MktNum}.${Code}`;
              return (
                <div key={secid} className={styles.stock} onClick={() => setDetailDrawer(secid)}>
                  <div>
                    <div className={styles.name}>
                      <span className={styles.nameText}>{Name}</span>
                    </div>
                    <div className={styles.code}>{Code}</div>
                  </div>
                  {codeMap[secid] ? (
                    <button className={styles.added} disabled>
                      已添加
                    </button>
                  ) : (
                    <button
                      className={styles.select}
                      onClick={(e) => {
                        onAdd(secid);
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
      <CustomDrawer show={showDetailDrawer}>
        <DetailZindexContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} code={detailSecid} />
      </CustomDrawer>
    </div>
  ) : (
    <></>
  );
};

export default ZindexSearch;
