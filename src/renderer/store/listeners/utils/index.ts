import { isAnyOf } from '@reduxjs/toolkit';
import listenerMiddleware from '@/store/listeners';
import { syncCoinsConfigAction, syncRemoteCoinsMapAction } from '@/store/features/coin';
import { syncFundRatingMapAction, syncRemoteFundsMapAction } from '@/store/features/fund';
import { syncFavoriteQuotationMapAction } from '@/store/features/quotation';
import { syncSettingAction, saveSyncConfigAction } from '@/store/features/setting';
import { syncStocksConfigAction } from '@/store/features/stock';
import { changeCurrentWalletCodeAction, syncWalletsConfigAction } from '@/store/features/wallet';
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
      syncFavoriteQuotationMapAction,
      changeCurrentWalletCodeAction,
      syncRemoteFundsMapAction,
      syncRemoteCoinsMapAction
    ),
    effect: (action, listenerApi) => {
      if (!action._share) {
        ipcRenderer.invoke('sync-multi-window-store', action);
      }
    },
  });
}

export function syncConfigListening() {
  // 配置同步

  listenerMiddleware.startListening({
    matcher: isAnyOf(
      syncCoinsConfigAction,
      syncZindexesConfigAction,
      syncWebConfigAction,
      syncStocksConfigAction,
      syncWalletsConfigAction,
      syncFavoriteQuotationMapAction
    ),
    effect: (action, { dispatch, getState }) => {
      if (!action._share) {
        const {
          setting: {
            systemSetting: { syncConfigSetting, syncConfigPathSetting },
          },
        } = getState();
        if (syncConfigSetting && syncConfigPathSetting) {
          dispatch(saveSyncConfigAction());
        }
      }
    },
  });
}
