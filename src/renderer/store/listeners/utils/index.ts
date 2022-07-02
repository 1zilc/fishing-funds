import { isAnyOf } from '@reduxjs/toolkit';
import { throttle } from 'throttle-debounce';
import listenerMiddleware from '@/store/listeners';
import { syncCoinsConfigAction, syncRemoteCoinsMapAction } from '@/store/features/coin';
import { syncFundRatingMapAction, syncRemoteFundsMapAction } from '@/store/features/fund';
import { syncFavoriteQuotationMapAction } from '@/store/features/quotation';
import { syncSettingAction } from '@/store/features/setting';
import { syncStocksConfigAction } from '@/store/features/stock';
import { changeCurrentWalletCodeAction, syncWalletsConfigAction } from '@/store/features/wallet';
import { syncWebConfigAction } from '@/store/features/web';
import { syncZindexesConfigAction } from '@/store/features/zindex';
import * as Utils from '@/utils';

const { ipcRenderer } = window.contextModules.electron;
export function shareStateListening() {
  // 窗口共享状态

  listenerMiddleware.startListening({
    matcher: isAnyOf(
      syncCoinsConfigAction,
      syncZindexesConfigAction,
      syncWebConfigAction,
      syncStocksConfigAction,
      syncWalletsConfigAction,
      syncFundRatingMapAction,
      syncSettingAction,
      syncFavoriteQuotationMapAction,
      changeCurrentWalletCodeAction,
      syncRemoteFundsMapAction,
      syncRemoteCoinsMapAction
    ),
    effect: throttle(1000, (action, {}) => {
      const isUpdating = Utils.GetUpdatingStoreStateStatus();
      if (isUpdating) {
        Utils.SetUpdatingStoreStateStatus(false);
      } else {
        ipcRenderer.invoke('sync-multi-window-store', action);
      }
    }),
  });
}
