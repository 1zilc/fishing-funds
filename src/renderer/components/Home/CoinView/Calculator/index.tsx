import React, { useState, useMemo } from 'react';
import { Select, Input } from 'antd';
import { useDebounceFn, useRequest, useMemoizedFn } from 'ahooks';
import * as NP from 'number-precision';

import CustomDrawerContent from '@/components/CustomDrawer/Content';
import CustomDrawer from '@/components/CustomDrawer';
import WebAppIcon from '@/components/Toolbar/AppCenterContent/WebAppIcon';
import PureCard from '@/components/Card/PureCard';
import ChartCard from '@/components/Card/ChartCard';

import { useDrawer, useAppSelector } from '@/utils/hooks';
import * as Helpers from '@/helpers';
import * as Enums from '@/utils/enums';
import * as Services from '@/services';
import styles from './index.module.scss';

const DetailCoinContent = React.lazy(() => import('@/components/Home/CoinView/DetailCoinContent'));
interface CalculatorProps {
  onEnter: () => void;
  onClose: () => void;
}

const { Option } = Select;

const Calculator: React.FC<CalculatorProps> = (props) => {
  const { remoteCoins, coinsLoading } = useAppSelector((state) => state.coin);
  const coinsState = useAppSelector((state) => state.coin.coins);
  const [coin, setCoin] = useState<Coin.DetailItem | null>(null);
  const [num, setNum] = useState(1);
  const [coins, setCoins] = useState<Coin.RemoteCoin[]>(remoteCoins);
  const [price, setPrice] = useState({ cny: 0, btc: 0, usd: 0 });

  const { data: detailCoinCode, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');

  const { run: onSearch } = useDebounceFn((_value: string) => {
    const value = _value.trim();
    if (value) {
      setCoins(
        remoteCoins.filter((remoteCoin) => {
          const { code, symbol } = remoteCoin;
          return (
            symbol.toLocaleUpperCase().indexOf(value.toLocaleUpperCase()) !== -1 || code.toLocaleUpperCase() === value.toLocaleUpperCase()
          );
        })
      );
    } else {
      setCoins(remoteCoins);
    }
  });

  useRequest(() => Services.Coin.FromCoingecko(coin!.id, 'cny'), {
    onSuccess: ([result]) => setPrice(result),
    refreshDeps: [coin?.id],
    ready: !!coin?.id,
  });

  const onSelect = useMemoizedFn(async (code) => {
    const coin = await Helpers.Coin.GetCoin(code);
    setCoin(coin);
  });

  const result = useMemo(() => {
    try {
      return {
        cny: NP.times(price.cny, num),
        usd: NP.times(price.usd, num),
        btc: NP.times(price.btc, num),
      };
    } catch {
      return;
    }
  }, [price, num]);

  return (
    <CustomDrawerContent title="货币计算器" enterText="确定" onClose={props.onClose} onEnter={props.onEnter}>
      <div className={styles.content}>
        {coin?.id && (
          <PureCard className={styles.card}>
            <WebAppIcon
              title={coin?.symbol?.toUpperCase() || ''}
              iconType={Enums.WebIconType.Favicon}
              favicon={coin?.image.small}
              onClick={() => setDetailDrawer(coin.id)}
            />
            {result ? (
              <div className={styles.info}>
                <div className={styles.item}>
                  <label>CNY:</label>
                  <span>{result.cny}</span>
                </div>
                <div className={styles.item}>
                  <label>USD:</label>
                  <span>{result.usd}</span>
                </div>
                <div className={styles.item}>
                  <label>BTC:</label>
                  <span>{result.btc}</span>
                </div>
              </div>
            ) : (
              '无法计算'
            )}
          </PureCard>
        )}
        <PureCard className={styles.card}>
          <div className={styles.row}>
            <Select
              style={{ width: '100%' }}
              size="small"
              loading={coinsLoading}
              showSearch
              value={coin?.id}
              placeholder="请搜索货币"
              onSearch={onSearch}
              onChange={onSelect}
              notFoundContent={null}
              allowClear
            >
              {coins.map((item) => (
                <Option key={item.code}>{item.code}</Option>
              ))}
            </Select>
          </div>
          <div className={styles.row}>
            <Input
              addonBefore="数量"
              addonAfter="枚"
              size="small"
              type="number"
              value={num}
              onChange={(e) => setNum(Number(e.target.value))}
              placeholder="货币数量"
            ></Input>
          </div>
        </PureCard>
        {coinsState.length && (
          <ChartCard TitleBar={<div className={styles.titleBar}>自选货币</div>}>
            {coinsState.map(({ code }) => {
              const { symbol } = Helpers.Coin.GetCurrentCoin(code);
              return (
                <div key={code} className={styles.stock}>
                  <div>
                    <div className={styles.name}>
                      <span className={styles.nameText}>{symbol.toUpperCase()}</span>
                    </div>
                    <div className={styles.code}>{code}</div>
                  </div>
                  {coin?.id === code ? (
                    <button className={styles.added} disabled>
                      已选择
                    </button>
                  ) : (
                    <button className={styles.select} onClick={() => onSelect(code)}>
                      选择
                    </button>
                  )}
                </div>
              );
            })}
          </ChartCard>
        )}
      </div>
      <CustomDrawer show={showDetailDrawer}>
        <DetailCoinContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} code={detailCoinCode} />
      </CustomDrawer>
    </CustomDrawerContent>
  );
};

export default Calculator;
