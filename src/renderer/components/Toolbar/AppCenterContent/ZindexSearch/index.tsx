import React, { useCallback } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { Input, Tabs, message } from 'antd';

import DetailZindexContent from '@/components/Home/ZindexView/DetailZindexContent';
import CustomDrawer from '@/components/CustomDrawer';
import { addZindexAction } from '@/actions/zindex';
import { StoreState } from '@/reducers/types';
import { useDrawer } from '@/utils/hooks';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

interface ZindexSearchProps {
  groupList: Stock.SearchResult[];
}

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

  return (
    <div className={clsx(styles.content)}>
      <Tabs animated={{ tabPane: true }} tabBarGutter={15} tabBarStyle={{ marginLeft: 15 }}>
        {groupList.map(({ Datas, Name, Type }) => (
          <Tabs.TabPane tab={Name} key={String(Type)}>
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
  );
};

export default ZindexSearch;
