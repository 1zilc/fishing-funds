import { createListenerMiddleware } from '@reduxjs/toolkit';
import { StoreState, AppDispatch } from '@/store';
import startListeningStock from '@/store/listeners/stock';

const listenerMiddleware = createListenerMiddleware<StoreState, AppDispatch>();

export function startListening() {
  startListeningStock();
}

export default listenerMiddleware;
