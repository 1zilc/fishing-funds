import React, { useState, useEffect } from 'react';

import Eye from '@/components/Eye';
import PureCard from '@/components/Card/PureCard';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import { getWalletConfig, walletIcons } from '@/actions/wallet';
import * as Enums from '@/utils/enums';

import styles from './index.scss';

export interface FundStatisticsContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const FundStatisticsContent: React.FC<FundStatisticsContentProps> = (props) => {
  const { walletConfig } = getWalletConfig();
  const [statusMap, setStatusMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const statusMap = walletConfig.reduce((r, c) => {
      r[c.code] = true;
      return r;
    }, {} as Record<string, boolean>);
    setStatusMap(statusMap);
  }, []);

  function changeWalletStatus(code: string, status: boolean) {
    setStatusMap({
      ...statusMap,
      [code]: status,
    });
  }

  return (
    <CustomDrawerContent
      title="基金统计"
      enterText="确定"
      onEnter={props.onClose}
      onClose={props.onClose}
    >
      <div className={styles.content}>
        <div className={styles.wallets}>
          {walletConfig.map((wallet, index) => (
            <PureCard key={wallet.code} className={styles.wallet}>
              <img src={walletIcons[wallet.iconIndex]} />
              {wallet.name}
              <Eye
                status={statusMap[wallet.code]}
                onClick={(status) => changeWalletStatus(wallet.code, status)}
              />
            </PureCard>
          ))}
        </div>
      </div>
    </CustomDrawerContent>
  );
};

export default FundStatisticsContent;
