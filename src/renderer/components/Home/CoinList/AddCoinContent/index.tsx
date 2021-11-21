import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDebounceFn } from 'ahooks';
import { Input, message } from 'antd';

import DetailCoinContent from '@/components/Home/CoinList/DetailCoinContent';
import CustomDrawer from '@/components/CustomDrawer';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import Empty from '@/components/Empty';
import { addCoinAction } from '@/actions/coin';
import { StoreState } from '@/reducers/types';
import { useDrawer } from '@/utils/hooks';
import * as Helpers from '@/helpers';
import styles from './index.module.scss';

export interface AddCoinContentProps {
  defaultName?: string;
  onEnter: () => void;
  onClose: () => void;
}

const { Search } = Input;

const AddCoinContent: React.FC<AddCoinContentProps> = (props) => {
  const { defaultName } = props;
  const dispatch = useDispatch();
  const [coins, setCoins] = useState<Coin.RemoteCoin[]>([]);
  const { codeMap } = useSelector((state: StoreState) => state.coin.config);
  const remoteCoins = useSelector((state: StoreState) => state.coin.remoteCoins);
  const { data: detailCode, show: showDetailDrawer, set: setDetailDrawer, close: closeDetailDrawer } = useDrawer('');

  async function onAdd(code: string) {
    const coin = await Helpers.Coin.GetCoin(code);
    if (coin) {
      dispatch(
        addCoinAction({
          code: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name!,
        })
      );
      props.onEnter();
    } else {
      message.error('数据出错或网络原因请多次尝试~');
    }
  }

  const { run: onSearch } = useDebounceFn((_value: string) => {
    const value = _value.trim();
    if (!value) {
      setCoins([]);
      return;
    }
    setCoins(
      remoteCoins.filter((remoteCoin) => {
        const { code, symbol } = remoteCoin;
        return (
          symbol.toLocaleUpperCase().indexOf(value.toLocaleUpperCase()) !== -1 || code.toLocaleUpperCase() === value.toLocaleUpperCase()
        );
      })
    );
  });

  useEffect(() => {
    if (defaultName) {
      onSearch(defaultName);
    }
  }, [defaultName]);

  return (
    <CustomDrawerContent title="添加货币" enterText="确定" onEnter={props.onEnter} onClose={props.onClose}>
      <div className={styles.content}>
        <section>
          <label>关键字：</label>
          <Search defaultValue={defaultName} type="text" placeholder="货币代码或名称关键字" enterButton onSearch={onSearch} size="small" />
        </section>
      </div>
      {coins.length ? (
        coins.map(({ code }) => {
          const { symbol } = Helpers.Coin.GetCurrentCoin(code);
          return (
            <div key={code} className={styles.stock} onClick={() => setDetailDrawer(code)}>
              <div>
                <div className={styles.name}>
                  <span className={styles.nameText}>{symbol.toUpperCase()}</span>
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
                    onAdd(code);
                    e.stopPropagation();
                  }}
                >
                  自选
                </button>
              )}
            </div>
          );
        })
      ) : (
        <Empty text="暂无相关数据~" />
      )}
      <CustomDrawer show={showDetailDrawer}>
        <DetailCoinContent onEnter={closeDetailDrawer} onClose={closeDetailDrawer} code={detailCode} />
      </CustomDrawer>
    </CustomDrawerContent>
  );
};

export default AddCoinContent;
