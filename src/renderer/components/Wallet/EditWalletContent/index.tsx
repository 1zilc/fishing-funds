import React, { useState } from 'react';
import { Input } from 'antd';

import WalletSelection from '@/components/Wallet/WalletSelection';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import { updateWalletConfigAction } from '@/store/features/wallet';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';

import styles from './index.module.css';

export interface AddFundContentProps {
  onEnter: () => void;
  onClose: () => void;
  wallet: Wallet.SettingItem;
}

const EditWalletContent: React.FC<AddFundContentProps> = (props) => {
  const { wallet } = props;
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>(wallet.name);
  const [iconIndex, setIconIndex] = useState<number>(wallet.iconIndex);
  const [fieldNameMessageTip, setFieldNameMessageTip] = useState<Field.MessageTip>({ show: false, text: '' });
  const { walletConfig } = useAppSelector((state) => state.wallet.config);

  async function onSave() {
    const repeatName = walletConfig.some((_wallet) => _wallet.name === name && wallet.code !== _wallet.code);
    if (!name) {
      setFieldNameMessageTip({ show: true, text: '请输入钱包名称~' });
      return;
    }
    if (repeatName) {
      setFieldNameMessageTip({ show: true, text: '钱包名称重复~' });
      return;
    }
    setFieldNameMessageTip({ show: false, text: '' });
    await dispatch(updateWalletConfigAction({ ...props.wallet, name, iconIndex }));
    props.onEnter();
  }

  return (
    <CustomDrawerContent title="编辑钱包" enterText="保存" onEnter={onSave} onClose={props.onClose}>
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
          />
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

export default EditWalletContent;
