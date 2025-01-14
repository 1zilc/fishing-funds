import * as Enums from '@/utils/enums';
import * as Comlink from 'comlink';

function searchRemoteFund(params: { list: Fund.RemoteFund[]; type: Enums.SearchType; value: string }) {
  const { list, type, value } = params;
  const upperCaseValue = value.toLocaleUpperCase();
  switch (type) {
    case Enums.SearchType.Code:
      return list.filter((remoteFund) => {
        const [code, pinyin, name, type, quanpin] = remoteFund;
        return code === value;
      });
    case Enums.SearchType.Name:
      return list.filter((remoteFund) => {
        const [code, pinyin, name, type, quanpin] = remoteFund;
        return name.indexOf(value) !== -1 || pinyin.indexOf(upperCaseValue) !== -1 || quanpin.indexOf(upperCaseValue) !== -1;
      });
    default:
      return list;
  }
}

function searchRemoteCoin(params: { list: Coin.RemoteCoin[]; value: string }) {
  const { list, value } = params;
  const upperCaseValue = value.toLocaleUpperCase();

  return list.filter((remoteCoin) => {
    const { code, symbol } = remoteCoin;
    return symbol.toLocaleUpperCase().indexOf(upperCaseValue) !== -1 || code.toLocaleUpperCase() === upperCaseValue;
  });
}

const exposes = {
  searchRemoteFund,
  searchRemoteCoin,
};

export type ExposesType = typeof exposes;

Comlink.expose(exposes);
