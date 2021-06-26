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
  const [cyfe, setCyfe] = useState<any>(fund.cyfe);
  const [cbj, setCbj] = useState<any>(fund.cbj);

  function onSave() {
    updateFund({
      code: fund.code,
      cyfe: cyfe ?? 0,
      cbj: cbj ?? undefined,
    });
    props.onEnter();
  }

  return (
    <CustomDrawerContent
      title="修改基金"
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
            min={0}
            precision={2}
            value={cyfe}
            onChange={setCyfe}
            size="small"
            style={{ width: '100%' }}
          />
        </section>
        <section>
          <label>持仓成本价：</label>
          <InputNumber
            placeholder="可精确4位小数"
            min={0}
            precision={4}
            value={cbj}
            onChange={(e) => {
              console.log(e);
              setCbj(e);
            }}
            size="small"
            style={{ width: '100%' }}
          />
        </section>
      </div>
    </CustomDrawerContent>
  );
};

export default EditFundContent;
