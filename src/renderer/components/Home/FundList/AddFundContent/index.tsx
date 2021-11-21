import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDebounceFn } from 'ahooks';
import { Input, InputNumber, message } from 'antd';

import DetailFundContent from '@/components/Home/FundList/DetailFundContent';
import CustomDrawer from '@/components/CustomDrawer';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import { addFundAction } from '@/actions/fund';
import { StoreState } from '@/reducers/types';
import { useDrawer, useCurrentWallet } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

export interface AddFundContentProps {
  defaultCode?: string;
  onEnter: () => void;
  onClose: () => void;
}

const AddFundContent: React.FC<AddFundContentProps> = (props) => {
  const { defaultCode } = props;
  const dispatch = useDispatch();

  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [cyfe, setCyfe] = useState<number>(0);
  const [cbj, setCbj] = useState<any>();
  const [zdfRange, setZdfRange] = useState<any>();
  const [jzNotice, setJzNotice] = useState<any>();
  const [memo, setMemo] = useState<any>();
  const [fundList, setFundlist] = useState<Fund.RemoteFund[]>([]);
  const remoteFunds = useSelector((state: StoreState) => state.fund.remoteFunds);
  const { currentWalletFundsCodeMap: codeMap } = useCurrentWallet();
  const { data: detailCode, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');

  async function onAdd() {
    const fund = await Helpers.Fund.GetFund(code);
    if (fund) {
      dispatch(
        addFundAction({
          code,
          cyfe: cyfe ?? 0,
          name: fund.name || '未知',
          cbj: cbj ?? undefined,
          zdfRange: zdfRange ?? undefined,
        })
      );
      props.onEnter();
    } else {
      message.error('添加基金失败，未找到或数据出错~');
    }
  }

  const { run: onSearch } = useDebounceFn((type: Enums.SearchType, value: string) => {
    if (!value) {
      setFundlist([]);
      return;
    }
    switch (type) {
      case Enums.SearchType.Code:
        setFundlist(
          remoteFunds.filter((remoteFund) => {
            const [code, pinyin, name, type, quanpin] = remoteFund;
            return code.indexOf(value) !== -1;
          })
        );
        break;
      case Enums.SearchType.Name:
        setFundlist(
          remoteFunds.filter((remoteFund) => {
            const [code, pinyin, name, type, quanpin] = remoteFund;
            return (
              name.indexOf(value) !== -1 ||
              pinyin.indexOf(value.toLocaleUpperCase()) !== -1 ||
              quanpin.indexOf(value.toLocaleUpperCase()) !== -1
            );
          })
        );
        break;
      default:
        break;
    }
  });

  useEffect(() => {
    if (defaultCode) {
      setCode(defaultCode);
      onSearch(Enums.SearchType.Code, defaultCode);
    }
  }, [defaultCode]);

  return (
    <CustomDrawerContent title="添加基金" enterText="添加" onEnter={onAdd} onClose={props.onClose}>
      <div className={styles.content}>
        <section>
          <label>
            <i className="red">*</i>基金代码：
          </label>
          <Input
            type="text"
            placeholder="请输入基金代码"
            value={code}
            onChange={(e) => {
              const code = e.target.value.trim();
              setCode(code);
              onSearch(Enums.SearchType.Code, code);
            }}
            size="small"
          />
        </section>
        <section>
          <label>基金名称：</label>
          <Input
            type="text"
            placeholder="仅用于名称检索（非必填）"
            value={name}
            onChange={(e) => {
              const name = e.target.value.trim();
              setName(name);
              onSearch(Enums.SearchType.Name, name);
            }}
            size="small"
          />
        </section>
        <section>
          <label>持有份额：</label>
          <InputNumber
            placeholder="可精确2位小数"
            defaultValue={0}
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
      {(name || code) &&
        fundList.map(([code, pinyin, name, type, quanpin]) => (
          <div key={code} className={styles.fund} onClick={() => setDetailDrawer(code)}>
            <div>
              <div className={styles.name}>
                <span className={styles.nameText}>{name}</span>
                <span className={styles.tag}>{type}</span>
              </div>
              <div className={styles.code}>{code}</div>
            </div>
            {codeMap[code] ? (
              <button className={styles.added} disabled>
                已添加
              </button>
            ) : (
              <button
                className={styles.select}
                onClick={(e) => {
                  setCode(code);
                  setName(name);
                  e.stopPropagation();
                }}
              >
                选择
              </button>
            )}
          </div>
        ))}
      <CustomDrawer show={showDetailDrawer}>
        <DetailFundContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} code={detailCode} />
      </CustomDrawer>
    </CustomDrawerContent>
  );
};

export default AddFundContent;
