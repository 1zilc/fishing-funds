import React, { useMemo, useState, useRef } from 'react';

import { ReactSortable } from 'react-sortablejs';
import { Input, InputRef, Button } from 'antd';
import clsx from 'clsx';
import { RiSearchLine, RiMenuLine, RiIndeterminateCircleFill } from 'react-icons/ri';
import PureCard from '@/components/Card/PureCard';
import Empty from '@/components/Empty';
import QuickSearch from '@/components/Toolbar/AppCenterContent/QuickSearch';
import { deleteWebAction, setWebConfigAction } from '@/store/features/web';
import { useAutoDestroySortableRef, useAppDispatch, useAppSelector } from '@/utils/hooks';
import * as Utils from '@/utils';
import styles from './index.module.css';

export interface OptionalProps {}

const { dialog } = window.contextModules.electron;
const { Search } = Input;

const Optional: React.FC<OptionalProps> = () => {
  const dispatch = useAppDispatch();
  const searchRef = useRef<InputRef>(null);
  const sortableRef = useAutoDestroySortableRef();
  const [keyword, setKeyword] = useState('');
  const { codeMap, webConfig } = useAppSelector((state) => state.web.config);
  const sortWebConfig = useMemo(() => webConfig.map((_) => ({ ..._, id: _.url })), [webConfig]);

  function onSortWebConfig(sortList: Web.SettingItem[]) {
    const hasChanged = Utils.CheckListOrderHasChanged(webConfig, sortList, 'url');
    if (hasChanged) {
      const sortConfig = sortList.map((item) => {
        const web = codeMap[item.url];
        return {
          title: web.title,
          url: web.url,
          iconType: web.iconType,
          icon: web.icon,
          color: web.color,
        };
      });
      dispatch(setWebConfigAction(sortConfig));
    }
  }

  async function onRemoveCoin(web: Web.SettingItem) {
    const { response } = await dialog.showMessageBox({
      title: '删除网站',
      type: 'info',
      message: `确认删除 ${web.title}`,
      buttons: ['确定', '取消'],
    });
    if (response === 0) {
      dispatch(deleteWebAction(web.url));
    }
  }

  return (
    <div className={styles.content}>
      <div className={styles.search}>
        <Search
          ref={searchRef}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          type="text"
          placeholder="搜索一下"
          size="small"
          enterButton
          allowClear
        />
      </div>
      <QuickSearch value={keyword} />
      {sortWebConfig.length ? (
        <ReactSortable
          ref={sortableRef}
          animation={200}
          delay={2}
          list={sortWebConfig}
          setList={onSortWebConfig}
          dragClass={styles.dragItem}
          swap
        >
          {sortWebConfig.map((web) => {
            return (
              <PureCard key={web.url} className={clsx(styles.row, 'hoverable')}>
                <RiIndeterminateCircleFill className={styles.remove} onClick={() => onRemoveCoin(web)} />
                <div className={styles.name}>{web.title}</div>
                <RiMenuLine className={styles.function} />
              </PureCard>
            );
          })}
        </ReactSortable>
      ) : (
        <Empty text="暂无h5网站收藏~" />
      )}
      <Button
        className="bottom-button"
        shape="circle"
        type="primary"
        size="large"
        icon={<RiSearchLine />}
        onClick={(e) => {
          searchRef.current?.focus();
          e.stopPropagation();
        }}
      />
    </div>
  );
};

export default Optional;
