import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDebounceFn, useBoolean } from 'ahooks';
import { Input, InputNumber } from 'antd';

import DetailFundContent from '@/components/Home/FundList/DetailFundContent';
import CustomDrawer from '@/components/CustomDrawer';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import { addFund, getFund, getFundConfig } from '@/actions/fund';
import { StoreState } from '@/reducers/types';
import * as Enums from '@/utils/enums';
import styles from './index.scss';

export interface AddFundContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const AddFundContent: React.FC<AddFundContentProps> = (props) => {
  const [name, setName] = useState<string>('');
  const [none, setNone] = useState<boolean>(false);
  const onAdd = async () => {
    if (name) {
      props.onEnter();
    } else {
      setNone(true);
    }
  };

  return (
    <CustomDrawerContent
      title="添加钱包"
      enterText="添加"
      onEnter={onAdd}
      onClose={props.onClose}
    >
      <div className={styles.content}>
        <section>
          <label>
            <i className="red">*</i>钱包名称：
          </label>
          <Input
            type="text"
            placeholder="请输入钱包名称"
            maxLength={10}
            value={name}
            onChange={(e) => {
              const code = e.target.value.trim();
              setName(code);
            }}
            size="small"
          ></Input>
        </section>
        <section>
          {none && <span className={styles.none}>请输入钱包名称</span>}
        </section>
      </div>
    </CustomDrawerContent>
  );
};

export default AddFundContent;
