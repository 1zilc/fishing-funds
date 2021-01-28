import React, { useState } from 'react';
import InputNumber from 'rc-input-number';
import { addFund } from '../../actions/storage';
import styles from './index.scss';

export interface AddContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const AddContent: React.FC<AddContentProps> = props => {
  const [code, setCode] = useState<string>('');
  const [num, setNum] = useState<number>(0);

  const onAdd = async () => {
    await addFund({
      code,
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
        <h3>添加基金</h3>
        <button className={styles.add} onClick={onAdd}>
          添加
        </button>
      </div>
      <div className={styles.body}>
        <section>
          <label>基金代码：</label>
          <input
            type="text"
            placeholder="请输入基金代码"
            value={code}
            onChange={e => setCode(e.target.value)}
          ></input>
        </section>
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

export default AddContent;
