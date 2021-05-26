import React, { useState } from 'react';
import { Checkbox } from 'antd';
import classnames from 'classnames';
import { ReactSortable } from 'react-sortablejs';

import PureCard from '@/components/Card/PureCard';
import { ReactComponent as MenuIcon } from '@/assets/icons/menu.svg';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import { getZindexConfig, saveZindexConfig } from '@/actions/zindex';

import styles from './index.scss';
export interface ManageZindexContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const ManageZindexContent: React.FC<ManageZindexContentProps> = (props) => {
  const { zindexConfig, selectZindexs } = getZindexConfig();
  const [sortZindexConfig, setSortZindexConfig] = useState(
    zindexConfig.map((_) => ({ ..._, id: _.code }))
  );
  const [selections, setSelections] = useState<any[]>(selectZindexs);

  const onSave = () => {
    const selectionsMap = selections.reduce((map, current) => {
      map[current] = true;
      return map;
    }, {});
    sortZindexConfig.forEach((zindex) => {
      zindex.show = !!selectionsMap[zindex.code];
    });
    saveZindexConfig(sortZindexConfig);
    props.onEnter();
  };

  return (
    <CustomDrawerContent
      title="指数自选"
      enterText="保存"
      onEnter={onSave}
      onClose={props.onClose}
    >
      <div className={styles.content}>
        <Checkbox.Group
          style={{ width: '100%' }}
          onChange={setSelections}
          value={selections}
        >
          <ReactSortable
            animation={200}
            delay={2}
            list={sortZindexConfig}
            setList={setSortZindexConfig}
            dragClass={styles.dragItem}
            swap
          >
            {sortZindexConfig.map((zindex) => {
              return (
                <PureCard
                  key={zindex.code}
                  className={classnames(styles.row, 'hoverable')}
                >
                  <Checkbox value={zindex.code}>{zindex.name}</Checkbox>
                  <MenuIcon />
                </PureCard>
              );
            })}
          </ReactSortable>
        </Checkbox.Group>
      </div>
    </CustomDrawerContent>
  );
};

export default ManageZindexContent;
