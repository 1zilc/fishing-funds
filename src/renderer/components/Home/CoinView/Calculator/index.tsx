import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Select } from 'antd';
import { useDebounceFn, useRequest } from 'ahooks';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import PureCard from '@/components/Card/PureCard';
import * as Services from '@/services';
import styles from './index.module.scss';

interface CalculatorProps {
  onEnter: () => void;
  onClose: () => void;
}

const { Option } = Select;

const Calculator: React.FC<CalculatorProps> = (props) => {
  const [coin, setCoin] = useState<Coin.ResponseItem | null>(null);
  const [coins, setCoins] = useState<Coin.ResponseItem[]>([]);

  const { run: runSearch, loading: loadingCoinFromCoingecko } = useRequest(Services.Coin.FromCoingecko, {
    onSuccess: setCoins,
  });

  const { run: onSearch } = useDebounceFn((_value: string) => {
    const value = _value.trim();
    if (value) {
      runSearch(value, 'btc,usd,cny');
    }
  });

  const onSelect = useCallback(
    (code) => {
      const [coin] = coins.filter((_) => code === _.code);
      setCoin(coin);
    },
    [coins]
  );

  console.log(coins);

  return (
    <CustomDrawerContent title="货币计算器" enterText="确定" onClose={props.onClose} onEnter={props.onEnter}>
      <div className={styles.content}>
        <div className={styles.container}>
          <PureCard>
            <Select
              className={styles.card}
              style={{ width: '100%' }}
              loading={loadingCoinFromCoingecko}
              showSearch
              value={coin?.code}
              placeholder="请选择货币"
              onSearch={onSearch}
              showArrow={false}
              onChange={onSelect}
              notFoundContent={null}
            >
              {coins.map((item) => (
                <Option key={item.code}>{item.code}</Option>
              ))}
            </Select>
          </PureCard>
        </div>
      </div>
    </CustomDrawerContent>
  );
};

export default Calculator;
