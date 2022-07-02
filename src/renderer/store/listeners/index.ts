import { createListenerMiddleware } from '@reduxjs/toolkit';
import { StoreState, AppDispatch } from '@/store';
import startListeningStock from '@/store/listeners/stock';
import startListeningCoin from '@/store/listeners/coin';
import startListeningFund from '@/store/listeners/fund';

const listenerMiddleware = createListenerMiddleware<StoreState, AppDispatch>();

export function startListening() {
  startListeningStock();
  startListeningCoin();
  startListeningFund();
}

export default listenerMiddleware;
