import React, { useState } from 'react';
import { Input, InputNumber } from 'antd';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import { addFund, getFund } from '@/actions/fund';
import styles from './index.scss';

export interface AddFundContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const AddFundContent: React.FC<AddFundContentProps> = (props) => {
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

  return (
    <CustomDrawerContent
      title="添加基金"
      enterText="添加"
      onEnter={onAdd}
      onClose={props.onClose}
    >
      <div className={styles.content}>
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
    </CustomDrawerContent>
  );
};

export default AddFundContent;
