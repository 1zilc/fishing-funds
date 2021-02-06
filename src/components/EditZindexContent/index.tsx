import React, { useState, useEffect } from 'react';
import { Checkbox } from 'antd';
import { ReactSortable } from 'react-sortablejs';
import { getZindexConfig, saveZindexConfig } from '../../actions/zindex';
import { ReactComponent as MenuIcon } from '../../assets/icons/menu.svg';
import styles from './index.scss';
export interface AddFundContentProps {
  show?: boolean;
  onEnter: () => void;
  onClose: () => void;
}

const EditZindexContent: React.FC<AddFundContentProps> = (props) => {
  const { zindexConfig, selectZindexs } = getZindexConfig();
  const [sortZindexConfig, setSortZindexConfig] = useState(
    zindexConfig.map((_) => ({ ..._, id: _.code }))
  );
  const [selections, setSelections] = useState<any[]>(selectZindexs);
  const isSelectAll = selections.length === zindexConfig.length;
  const isIndeterminate = selections.length > 0 && !isSelectAll;

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
  const onSelectAll = () => {
    setSelections(isSelectAll ? [] : zindexConfig.map(({ code }) => code));
  };

  useEffect(() => {}, [props.show]);

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <button className={styles.close} onClick={props.onClose}>
          关闭
        </button>
        <h3>指数自选</h3>
        <button className={styles.save} onClick={onSave}>
          保存
        </button>
      </div>
      <div className={styles.body}>
        <div className={styles.row}>
          <Checkbox
            checked={isSelectAll}
            indeterminate={isIndeterminate}
            onChange={onSelectAll}
          >
            全选
          </Checkbox>
          <br />
        </div>
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
            swap
          >
            {sortZindexConfig.map((zindex) => {
              return (
                <div key={zindex.code} className={styles.row}>
                  <Checkbox value={zindex.code}>{zindex.name}</Checkbox>
                  <MenuIcon />
                </div>
              );
            })}
          </ReactSortable>
        </Checkbox.Group>
      </div>
    </div>
  );
};

export default EditZindexContent;
