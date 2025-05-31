import React, { useState, useEffect, useRef } from 'react';
import { InputNumber, Input } from 'antd';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import { updateZindexAction } from '@/store/features/zindex';
import { useAppDispatch } from '@/utils/hooks';
import styles from './index.module.css';

export interface EditZindexContentProps {
  onEnter: () => void;
  onClose: () => void;
  zindex: Zindex.SettingItem;
}

const EditZindexContent: React.FC<EditZindexContentProps> = (props) => {
  const { zindex } = props;
  const dispatch = useAppDispatch();
  const [zdfRange, setZdfRange] = useState<any>(zindex.zdfRange);
  const [jzNotice, setJzNotice] = useState<any>(zindex.jzNotice);
  const [memo, setMemo] = useState<any>(zindex.memo);

  async function onSave() {
    await dispatch(
      updateZindexAction({
        code: zindex.code,
        zdfRange: zdfRange ?? undefined,
        jzNotice: jzNotice ?? undefined,
        memo: memo ?? undefined,
      })
    );
    props.onEnter();
  }

  return (
    <CustomDrawerContent title="修改指数" enterText="保存" onClose={props.onClose} onEnter={onSave}>
      <div className={styles.content}>
        <section>
          <label>指数名称：</label>
          <span>{zindex.name}</span>
        </section>
        <section>
          <label>指数代码：</label>
          <span>{zindex.code?.split('.')[1]}</span>
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
          <label>价格提醒：</label>
          <InputNumber
            placeholder="价格达到该值将发出系统通知"
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

export default EditZindexContent;
