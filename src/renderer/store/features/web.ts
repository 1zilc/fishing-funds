import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TypedThunk } from '@/store';
import * as Utils from '@/utils';
import * as CONST from '@/constants';

export interface WebState {
  view: {
    show: boolean;
    phone?: boolean;
    title: string;
    url: string;
  };
  config: { webConfig: Web.SettingItem[]; codeMap: Web.CodeMap };
}

const initialState = {
  view: {
    show: false,
    phone: true,
    title: '',
    url: '',
  },
  config: { webConfig: [], codeMap: {} },
} as WebState;

const webSlice = createSlice({
  name: 'web',
  initialState,
  reducers: {
    setWebUrl(state, action: PayloadAction<string>) {
      state.view.url = action.payload;
    },
    setWebPhone(state, action: PayloadAction<boolean>) {
      state.view.phone = action.payload;
    },
    setWeb(state, action) {
      state.view = action.payload;
    },
    syncWebConfig(state, action) {
      state.config = action.payload;
    },
  },
});

export const { setWebUrl, setWebPhone, setWeb, syncWebConfig } = webSlice.actions;

export function setWebPhoneAction(phone: boolean): TypedThunk {
  return (dispatch, getState) => {
    try {
      dispatch(setWebPhone(phone));
    } catch (error) {}
  };
}
export function setWebAction(data: { show: boolean; phone?: boolean; title: string; url: string }): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        web: { view },
      } = getState();
      dispatch(setWeb({ ...view, ...data }));
    } catch (error) {}
  };
}
export function closeWebAction(): TypedThunk {
  return (dispatch, getState) => {
    try {
      dispatch(setWebAction({ url: '', title: '', show: false }));
    } catch (error) {}
  };
}
export function openWebAction(data: { phone?: boolean; title: string; url: string }): TypedThunk {
  return (dispatch, getState) => {
    try {
      dispatch(setWebAction({ ...data, show: true }));
    } catch (error) {}
  };
}
export function addWebAction(web: Web.SettingItem): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        web: {
          config: { webConfig },
        },
      } = getState();
      const cloneWebConfig = Utils.DeepCopy(webConfig);
      const exist = cloneWebConfig.find((item) => web.url === item.url);
      if (!exist) {
        cloneWebConfig.push(web);
      }
      dispatch(setWebConfigAction(cloneWebConfig));
    } catch (error) {}
  };
}

export function updateWebAction(web: Web.SettingItem): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        web: {
          config: { webConfig },
        },
      } = getState();
      webConfig.forEach((item) => {
        if (web.url === item.url) {
          item.url = web.url;
          item.title = web.title;
          item.iconType = web.iconType;
          item.color = web.color;
          item.icon = web.icon;
        }
      });
      dispatch(setWebConfigAction(webConfig));
    } catch (error) {}
  };
}

export function deleteWebAction(url: string): TypedThunk {
  return (dispatch, getState) => {
    try {
      const {
        web: {
          config: { webConfig },
        },
      } = getState();

      webConfig.forEach((item, index) => {
        if (url === item.url) {
          const cloneWebSetting = JSON.parse(JSON.stringify(webConfig));
          cloneWebSetting.splice(index, 1);
          dispatch(setWebConfigAction(cloneWebSetting));
        }
      });
    } catch (error) {}
  };
}

export function setWebConfigAction(webConfig: Web.SettingItem[]): TypedThunk {
  return async (dispatch, getState) => {
    try {
      const codeMap = Utils.GetCodeMap(webConfig, 'url');
      await Utils.SetStorage(CONST.STORAGE.WEB_SETTING, webConfig);
      dispatch(syncWebConfig({ webConfig, codeMap }));
    } catch (error) {}
  };
}

export default webSlice.reducer;
