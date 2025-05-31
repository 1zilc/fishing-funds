import React, { useState, useEffect, useRef } from 'react';
import { InputNumber, Input } from 'antd';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import { updateFundAction } from '@/store/features/fund';
import { useAppDispatch } from '@/utils/hooks';
import styles from './index.module.css';

export interface EditFundContentProps {
  onEnter: () => void;
  onClose: () => void;
  fund: Fund.SettingItem;
}

const EditFundContent: React.FC<EditFundContentProps> = (props) => {
  const { fund } = props;
  const dispatch = useAppDispatch();
  const [cyfe, setCyfe] = useState<any>(fund.cyfe);
  const [cbj, setCbj] = useState<any>(fund.cbj);
  const [zdfRange, setZdfRange] = useState<any>(fund.zdfRange);
  const [jzNotice, setJzNotice] = useState<any>(fund.jzNotice);
  const [memo, setMemo] = useState<any>(fund.memo);

  async function onSave() {
    await dispatch(
      updateFundAction({
        code: fund.code,
        cyfe: cyfe ?? 0,
        cbj: cbj ?? undefined,
        zdfRange: zdfRange ?? undefined,
        jzNotice: jzNotice ?? undefined,
        memo: memo ?? undefined,
      })
    );
    props.onEnter();
  }

  return (
    <CustomDrawerContent title="修改基金" enterText="保存" onClose={props.onClose} onEnter={onSave}>
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
            onChange={setCbj}
            size="small"
            style={{ width: '100%' }}
          />
        </section>
        <section>
          <label>涨跌幅提醒范围（%）：</label>
          <InputNumber
            placeholder="涨跌幅超过该范围将发出系统通知"
            min={0.01}
            max={30}
            precision={2}
            value={zdfRange}
            onChange={setZdfRange}
            size="small"
            style={{ width: '100%' }}
          />
        </section>
        <section>
          <label>净值提醒：</label>
          <InputNumber
            placeholder="净值达到该值将发出系统通知"
            min={0.0001}
            precision={4}
            value={jzNotice}
            onChange={setJzNotice}
            size="small"
            style={{ width: '100%' }}
          />
        </section>
        <section>
          <label>备注：</label>
          <Input.TextArea
            rows={5}
            placeholder="额外记录"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            size="small"
            style={{ width: '100%' }}
          />
        </section>
      </div>
    </CustomDrawerContent>
  );
};

export default EditFundContent;
