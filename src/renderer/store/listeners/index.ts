import { createListenerMiddleware } from '@reduxjs/toolkit';
import { StoreState, AppDispatch } from '@/store';
import startListeningStock from '@/store/listeners/stock';
import startListeningCoin from '@/store/listeners/coin';
import startListeningFund from '@/store/listeners/fund';
import startListeningQuotation from '@/store/listeners/quotation';
import startListeningSetting from '@/store/listeners/setting';
import startListeningSort from '@/store/listeners/sort';

const listenerMiddleware = createListenerMiddleware<StoreState, AppDispatch>();

export function startListening() {
  startListeningStock();
  startListeningCoin();
  startListeningFund();
  startListeningQuotation();
  startListeningSetting();
  startListeningSort();
}

export default listenerMiddleware;
