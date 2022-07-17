import registerPromiseWorker from 'promise-worker/register';
import * as Enums from '@/utils/enums';

interface WorkerRecieveParams {
  module?: Enums.TabKeyType;
  list: any[];
  [index: string]: any;
}

export interface SearchRemoteFundParams extends WorkerRecieveParams {
  list: Fund.RemoteFund[];
  type: Enums.SearchType;
  value: string;
}
export interface SearchRemoteCoinParams extends WorkerRecieveParams {
  list: Coin.RemoteCoin[];
  value: string;
}

registerPromiseWorker((params: WorkerRecieveParams) => {
  switch (params.module) {
    case Enums.TabKeyType.Fund:
      return searchRemoteFund({ list: params.list, type: params.type, value: params.value });
    case Enums.TabKeyType.Coin:
      return searchRemoteCoin({ list: params.list, value: params.value });
    default:
      return params.list;
  }
});

function searchRemoteFund(params: SearchRemoteFundParams) {
  const { list, type, value } = params;
  const upperCaseValue = value.toLocaleUpperCase();
  switch (type) {
    case Enums.SearchType.Code:
      return list.filter((remoteFund) => {
        const [code, pinyin, name, type, quanpin] = remoteFund;
        return code.indexOf(value) !== -1;
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

function searchRemoteCoin(params: SearchRemoteCoinParams) {
  const { list, value } = params;
  const upperCaseValue = value.toLocaleUpperCase();

  return list.filter((remoteCoin) => {
    const { code, symbol } = remoteCoin;
    return symbol.toLocaleUpperCase().indexOf(upperCaseValue) !== -1 || code.toLocaleUpperCase().indexOf(upperCaseValue) !== -1;
  });
}
