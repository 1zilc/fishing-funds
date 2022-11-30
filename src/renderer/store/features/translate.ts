import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@/store';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Enums from '@/utils/enums';

export type TranslateState = {
  translateSetting: Translate.Setting;
  show: boolean;
};

export const defaultTranslateSetting: Translate.Setting = {
  translateApiTypeSetting: Enums.TranslateApiType.Google,
  readClipboardSetting: false,
  hotkeySetting: '',
};

const initialState: TranslateState = {
  translateSetting: defaultTranslateSetting,
  show: false,
};

const translateSlice = createSlice({
  name: 'translate',
  initialState,
  reducers: {
    syncTranslateSettingAction(state, action: PayloadAction<Translate.Setting>) {
      state.translateSetting = action.payload;
    },
    syncTranslateShowAction(state, action: PayloadAction<boolean>) {
      state.show = action.payload;
    },
  },
});
export const { syncTranslateSettingAction, syncTranslateShowAction } = translateSlice.actions;

export const setTranslateSettingAction = createAsyncThunk<void, Translate.Setting, AsyncThunkConfig>(
  'translate/setTranslateSettingAction',
  (newSetting, { dispatch, getState }) => {
    try {
      const {
        translate: { translateSetting: oldSetting },
      } = getState();

      const translateSetting = { ...oldSetting, ...newSetting };

      dispatch(syncTranslateSettingAction(translateSetting));
    } catch (error) {}
  }
);

export default translateSlice.reducer;
