import { createListenerMiddleware } from '@reduxjs/toolkit';
import { StoreState, AppDispatch } from '@/store';
import startListeningConfig from '@/store/listeners/config.listener';
import startListeningState from '@/store/listeners/state.listener';
import startListeningCache from '@/store/listeners/cache.listener';
import startListeningShare from '@/store/listeners/share.listener';
import startListeningSync from '@/store/listeners/sync.listener';

const listenerMiddleware = createListenerMiddleware<StoreState, AppDispatch>();

export function startListening() {
  startListeningConfig();
  startListeningState();
  startListeningCache();
  startListeningShare();
  startListeningSync();
}

export default listenerMiddleware;
