import React, { useState, useEffect } from 'react';
import { Input, InputNumber } from 'antd';
import { addFund, getFund } from '../../actions/fund';
import styles from './index.scss';

export interface AddContentProps {
  show?: boolean;
  onEnter: () => void;
  onClose: () => void;
}

const AddContent: React.FC<AddContentProps> = (props) => {
  const [code, setCode] = useState<string>('');
  const [num, setNum] = useState<number>(0);
  const [none, setNone] = useState<boolean>(false);

  const onAdd = async () => {
    const fund = await getFund(code);
    if (fund) {
      setNone(false);
      await addFund({
        code,
        cyfe: num,
      });
      props.onEnter();
    } else {
      setNone(true);
    }
  };

  useEffect(() => {
    setCode('');
    setNum(0);
    setNone(false);
  }, [props.show]);

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
          <Input
            type="text"
            placeholder="请输入基金代码"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            size="small"
          ></Input>
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
              width: '100%',
            }}
          ></InputNumber>
        </section>
        <section>
          {none && <span className={styles.none}>没有找到该基金信息～</span>}
        </section>
      </div>
    </div>
  );
};

export default AddContent;
