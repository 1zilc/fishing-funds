import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Input } from 'antd';

import WalletSelection from '@/components/Wallet/WalletSelection';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import { getWalletConfig, addWallet } from '@/actions/wallet';
import * as Utils from '@/utils';
import styles from './index.scss';
export interface AddFundContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const AddWalletContent: React.FC<AddFundContentProps> = (props) => {
  const dispatch = useDispatch();
  const { walletConfig } = getWalletConfig();
  const [name, setName] = useState('');
  const [iconIndex, setIconIndex] = useState(0);
  const [fieldNameMessageTip, setFieldNameMessageTip] =
    useState<Field.MessageTip>({ show: false, text: '' });

  const onAdd = async () => {
    const repeatName = walletConfig.some((wallet) => wallet.name === name);
    const code = Utils.MakeHash();

    if (!name) {
      setFieldNameMessageTip({ show: true, text: '请输入钱包名称~' });
      return;
    }
    if (repeatName) {
      setFieldNameMessageTip({ show: true, text: '钱包名称重复~' });
      return;
    }
    setFieldNameMessageTip({ show: false, text: '' });
    dispatch(addWallet({ name, iconIndex, code, funds: [] }));
    props.onEnter();
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
              const name = e.target.value.trim();
              setName(name);
            }}
            size="small"
          ></Input>
        </section>
        {fieldNameMessageTip.show && (
          <section>
            <span className={styles.none}>{fieldNameMessageTip.text}</span>
          </section>
        )}
        <section>
          <label>钱包外观：</label>
          <WalletSelection index={iconIndex} onChange={setIconIndex} />
        </section>
      </div>
    </CustomDrawerContent>
  );
};

export default AddWalletContent;
