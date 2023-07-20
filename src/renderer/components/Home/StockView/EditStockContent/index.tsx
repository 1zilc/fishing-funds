import React, { useState } from 'react';
import { InputNumber, Input } from 'antd';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import { updateStockAction } from '@/store/features/stock';
import { useAppDispatch } from '@/utils/hooks';
import styles from './index.module.scss';

export interface EditStockContentProps {
  onEnter: () => void;
  onClose: () => void;
  stock: Stock.SettingItem;
}

const EditStockContent: React.FC<EditStockContentProps> = (props) => {
  const { stock } = props;
  const dispatch = useAppDispatch();
  const [cyfe, setCyfe] = useState<any>(stock.cyfe);
  const [cbj, setCbj] = useState<any>(stock.cbj);
  const [zdfRange, setZdfRange] = useState<any>(stock.zdfRange);
  const [jzNotice, setJzNotice] = useState<any>(stock.jzNotice);
  const [memo, setMemo] = useState<any>(stock.memo);

  async function onSave() {
    await dispatch(
      updateStockAction({
        secid: stock.secid,
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
    <CustomDrawerContent title="修改股票" enterText="保存" onClose={props.onClose} onEnter={onSave}>
      <div className={styles.content}>
        <section>
          <label>股票名称：</label>
          <span>{stock.name}</span>
        </section>
        <section>
          <label>股票代码：</label>
          <span>{stock.code}</span>
        </section>
        <section>
          <label>持股数：</label>
          <InputNumber
            placeholder="保留整数"
            min={0}
            precision={0}
            value={cyfe}
            onChange={setCyfe}
            size="small"
            style={{ width: '100%' }}
          />
        </section>
        <section>
          <label>成本价：</label>
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

export default EditStockContent;
