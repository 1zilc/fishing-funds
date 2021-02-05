import React, { useState, useEffect } from 'react';
import { Checkbox } from 'antd';
import { getZindexConfig } from '../../actions/zindex';
import styles from './index.scss';

export interface AddFundContentProps {
  show?: boolean;
  onEnter: () => void;
  onClose: () => void;
}

const EditZindexContent: React.FC<AddFundContentProps> = (props) => {
  const { zindexConfig } = getZindexConfig();
  const onSave = () => {};
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
          <Checkbox>全选</Checkbox>
          <br />
        </div>
        {zindexConfig.map((zindex) => {
          return (
            <div key={zindex.code} className={styles.row}>
              <Checkbox checked={zindex.show}>{zindex.name}</Checkbox>
              <br />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EditZindexContent;
