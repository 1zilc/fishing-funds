import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { InputNumber, Input } from 'antd';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import { updateFundAction } from '@/actions/fund';
import styles from './index.module.scss';

export interface EditFundContentProps {
  onEnter: () => void;
  onClose: () => void;
  fund: Fund.SettingItem;
  focus: string;
}

const EditFundContent: React.FC<EditFundContentProps> = (props) => {
  const { fund } = props;
  const dispatch = useDispatch();
  const [cyfe, setCyfe] = useState<any>(fund.cyfe);
  const [cbj, setCbj] = useState<any>(fund.cbj);
  const [zdfRange, setZdfRange] = useState<any>(fund.zdfRange);
  const [jzNotice, setJzNotice] = useState<any>(fund.jzNotice);
  const [memo, setMemo] = useState<any>(fund.memo);
  const cbjInputRef = useRef<HTMLInputElement>(null);
  const cyfeInputRef = useRef<HTMLInputElement>(null);
  const zdfRangeInputRef = useRef<HTMLInputElement>(null);
  const jzNoticeInputRef = useRef<HTMLInputElement>(null);
  const memoInputRef = useRef<HTMLInputElement>(null);

  function onSave() {
    dispatch(
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

  useEffect(() => {
    switch (props.focus) {
      case 'cbj':
        cbjInputRef.current?.focus();
        break;
      case 'cyfe':
        cyfeInputRef.current?.focus();
        break;
      case 'zdfRange':
        zdfRangeInputRef.current?.focus();
        break;
      case 'jzNotice':
        jzNoticeInputRef.current?.focus();
        break;
      case 'memo':
        memoInputRef.current?.focus();
        break;
      default:
        break;
    }
  }, [props.focus]);

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
            ref={cyfeInputRef}
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
            ref={cbjInputRef}
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
            ref={zdfRangeInputRef}
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
            ref={jzNoticeInputRef}
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
            ref={memoInputRef}
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
