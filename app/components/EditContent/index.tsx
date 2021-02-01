import React, { useState } from 'react';
import { InputNumber } from 'antd';
import { updateFund, getFundConfig } from '../../actions/fund';
import styles from './index.scss';

export interface AddContentProps {
  onEnter: () => void;
  onClose: () => void;
  fund: Fund.SettingItem & { name: string };
}

const EditContent: React.FC<AddContentProps> = props => {
  const { fund } = props;
  const { codeMap } = getFundConfig();
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
          <label>基金名称：</label>
          <span>{fund.name}</span>
        </section>
        <section>
          <label>基金代码：</label>
          <span>{fund.code}</span>
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
            size="small"
            style={{
              width: '100%'
            }}
          ></InputNumber>
        </section>
      </div>
    </div>
  );
};

export default EditContent;
