import { AnyAction } from 'redux';

import {} from '@/actions/zindex';
import { getSortMode } from '@/actions/sort';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';

export interface StockState {
  stocks: (Stock.ResponseItem & Stock.ExtraRow)[];
  stocksLoading: boolean;
}

export default function stock(
  state: StockState = {
    stocks: [],
    stocksLoading: false,
  },
  action: AnyAction
): StockState {
  switch (action.type) {
    default:
      return state;
  }
}
