import listenerMiddleware from '@/store/listeners';
import { syncFavoriteQuotationMapAction } from '@/store/features/quotation';
import { syncCoinsConfigAction } from '@/store/features/coin';
import { syncStocksConfigAction } from '@/store/features/stock';
import { syncSettingAction } from '@/store/features/setting';
import { syncZindexesConfigAction } from '@/store/features/zindex';
import { syncWebConfigAction } from '@/store/features/web';
import { changeCurrentWalletCodeAction, syncWalletsConfigAction } from '@/store/features/wallet';
import { syncTranslateSettingAction } from '@/store/features/translate';
import { syncChatGPTSettingAction } from '@/store/features/chatGPT';
import * as CONST from '@/constants';

const electronStore = window.contextModules.electronStore;

const configListener = () => {
  listenerMiddleware.startListening({
    actionCreator: syncCoinsConfigAction,
    effect: async (action) => {
      electronStore.set('config', CONST.STORAGE.COIN_SETTING, action.payload.coinConfig);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: syncFavoriteQuotationMapAction,
    effect: async (action) => {
      electronStore.set('config', CONST.STORAGE.FAVORITE_QUOTATION_MAP, action.payload);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: syncSettingAction,
    effect: async (action) => {
      electronStore.set('config', CONST.STORAGE.SYSTEM_SETTING, action.payload);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: syncStocksConfigAction,
    effect: async (action) => {
      electronStore.set('config', CONST.STORAGE.STOCK_SETTING, action.payload.stockConfig);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: changeCurrentWalletCodeAction,
    effect: async (action) => {
      electronStore.set('config', CONST.STORAGE.CURRENT_WALLET_CODE, action.payload);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: syncWalletsConfigAction,
    effect: async (action) => {
      electronStore.set('config', CONST.STORAGE.WALLET_SETTING, action.payload.walletConfig);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: syncWebConfigAction,
    effect: async (action) => {
      electronStore.set('config', CONST.STORAGE.WEB_SETTING, action.payload.webConfig);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: syncZindexesConfigAction,
    effect: async (action) => {
      electronStore.set('config', CONST.STORAGE.ZINDEX_SETTING, action.payload.zindexConfig);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: syncTranslateSettingAction,
    effect: async (action) => {
      electronStore.set('config', CONST.STORAGE.TRANSLATE_SETTING, action.payload);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: syncChatGPTSettingAction,
    effect: async (action) => {
      electronStore.set('config', CONST.STORAGE.CHATGPT_SETTING, action.payload);
    },
  });
};
export default configListener;
