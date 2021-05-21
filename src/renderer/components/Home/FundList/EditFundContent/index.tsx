import React, { useState } from 'react';
import { InputNumber } from 'antd';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import { updateFund } from '@/actions/fund';
import styles from './index.scss';

export interface EditFundContentProps {
  onEnter: () => void;
  onClose: () => void;
  fund: Fund.SettingItem;
}

const EditFundContent: React.FC<EditFundContentProps> = (props) => {
  const { fund } = props;
  const [num, setNum] = useState<any>(fund.cyfe);
  const onSave = () => {
    updateFund({
      code: fund.code,
      cyfe: num,
    });
    props.onEnter();
  };

  return (
    <CustomDrawerContent
      title="修改份额"
      enterText="保存"
      onClose={props.onClose}
      onEnter={onSave}
    >
      <div className={styles.content}>
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
            // defaultValue={0}
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
      </div>
    </CustomDrawerContent>
  );
};

export default EditFundContent;
