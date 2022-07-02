import { isAnyOf } from '@reduxjs/toolkit';
import listenerMiddleware from '@/store/listeners';
import { syncCoinsConfigAction, syncRemoteCoinsMapAction } from '@/store/features/coin';
import { syncFundRatingMapAction, syncRemoteFundsMapAction } from '@/store/features/fund';
import { syncFavoriteQuotationMapAction } from '@/store/features/quotation';
import { syncSettingAction } from '@/store/features/setting';
import { syncStocksConfigAction } from '@/store/features/stock';
import { syncEyeStatusAction, changeCurrentWalletCodeAction, syncWalletsConfigAction } from '@/store/features/wallet';
import { syncWebConfigAction } from '@/store/features/web';
import { syncZindexesConfigAction } from '@/store/features/zindex';

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
      syncFavoriteQuotationMapAction
    ),
    effect(action, {}) {
      console.log(action);
    },
  });
}
