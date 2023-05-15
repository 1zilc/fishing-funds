import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@/store';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Enums from '@/utils/enums';

export type ChatGPTState = {
  chatGPTSetting: ChatGPT.Setting;
  chatId: string;
  show: boolean;
};

export const defaultChatGPTSetting: ChatGPT.Setting = {
  hotkeySetting: '',
};

const initialState: ChatGPTState = {
  chatGPTSetting: defaultChatGPTSetting,
  chatId: '',
  show: false,
};

const chatGPTSlice = createSlice({
  name: 'chatGPT',
  initialState,
  reducers: {
    syncChatGPTSettingAction(state, action: PayloadAction<ChatGPT.Setting>) {
      state.chatGPTSetting = action.payload;
    },
    syncChatGPTShowAction(state, action: PayloadAction<boolean>) {
      state.show = action.payload;
    },
    syncChatIdAction(state, action: PayloadAction<string>) {
      state.chatId = action.payload;
    },
  },
});
export const { syncChatGPTSettingAction, syncChatGPTShowAction, syncChatIdAction } = chatGPTSlice.actions;

export const setChatGPTSettingAction = createAsyncThunk<void, ChatGPT.Setting, AsyncThunkConfig>(
  'chatGPT/setChatGPTSettingAction',
  (newSetting, { dispatch, getState }) => {
    try {
      const {
        chatGPT: { chatGPTSetting: oldSetting },
      } = getState();

      const chatGPTSetting = { ...oldSetting, ...newSetting };

      dispatch(syncChatGPTSettingAction(chatGPTSetting));
    } catch (error) {}
  }
);

export default chatGPTSlice.reducer;
