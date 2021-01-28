import React, { useState } from 'react';
import { useLocalStorageState } from 'ahooks';
import InputNumber from 'rc-input-number';
import { updateFund } from '../../actions/storage';
import styles from './index.scss';

export interface AddContentProps {
  onEnter: () => void;
  onClose: () => void;
  fund: Fund.SettingItem;
}

const EditContent: React.FC<AddContentProps> = props => {
  const { fund } = props;
  const [num, setNum] = useState<number>(fund.cyfe);

  const onSave = async () => {
    await updateFund({
      code: fund.code,
      cyfe: num
    });
    props.onEnter();
  };

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <button className={styles.close} onClick={props.onClose}>
          关闭
        </button>
        <h3>修改份额</h3>
        <button className={styles.save} onClick={onSave}>
          保存
        </button>
      </div>
      <div className={styles.body}>
        <section>
          <label>持有份额：</label>
          <InputNumber
            placeholder="可精确2位小数"
            defaultValue={0}
            min={0}
            precision={2}
            value={num}
            onChange={setNum}
          ></InputNumber>
        </section>
      </div>
    </div>
  );
};

export default EditContent;
