import { createListenerMiddleware } from '@reduxjs/toolkit';
import { StoreState, AppDispatch } from '@/store';
import startListeningCoin from '@/store/listeners/coin';
import startListeningFund from '@/store/listeners/fund';
import startListeningQuotation from '@/store/listeners/quotation';
import startListeningSetting from '@/store/listeners/setting';
import startListeningSort from '@/store/listeners/sort';
import startListeningStock from '@/store/listeners/stock';
import startListeningTabs from '@/store/listeners/tabs';
import startListeningWallet from '@/store/listeners/wallet';
import startListeningWeb from '@/store/listeners/web';
import startListeningZindex from '@/store/listeners/zindex';
import { shareStateListening, syncConfigListening } from '@/store/listeners/utils';

const listenerMiddleware = createListenerMiddleware<StoreState, AppDispatch>();

export function startListening() {
  startListeningCoin();
  startListeningFund();
  startListeningQuotation();
  startListeningSetting();
  startListeningSort();
  startListeningStock();
  startListeningTabs();
  startListeningWallet();
  startListeningWeb();
  startListeningZindex();
  // 窗口共享状态
  shareStateListening();
  // 同步配置
  syncConfigListening();
}

export default listenerMiddleware;
