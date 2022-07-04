import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@/store';
import * as Utils from '@/utils';
import * as Enums from '@/utils/enums';
import { batch } from 'react-redux';

export interface WebState {
  view: {
    phone?: boolean;
    title: string;
    url: string;
  };
  show: boolean;
  config: { webConfig: Web.SettingItem[]; codeMap: Web.CodeMap };
}

export const defaultWebConfig = [
  {
    title: '新浪微博',
    url: 'https://m.weibo.cn/',
    iconType: Enums.WebIconType.Favicon,
    icon: 'https://m.weibo.cn/favicon.ico',
  },
  {
    title: 'Telegram',
    url: 'https://web.telegram.org/',
    iconType: Enums.WebIconType.Favicon,
    icon: 'https://web.telegram.org/k/assets/img/favicon.ico',
  },
  {
    title: 'YouTube',
    url: 'https://www.youtube.com/',
    iconType: Enums.WebIconType.Favicon,
    icon: 'https://www.youtube.com/s/desktop/04fe8437/img/favicon_96x96.png',
  },
  {
    title: '东财人气榜',
    url: 'https://vipmoney.eastmoney.com/collect/stockranking/pages/ranking9_3/list.html',
    iconType: Enums.WebIconType.First,
    color: '#b16ce0',
  },
  {
    title: '虎牙直播',
    url: 'https://m.huya.com/',
    iconType: Enums.WebIconType.Favicon,
    icon: 'https://diy-assets.msstatic.com/mobile/favicon.ico',
  },
];

const initialState: WebState = {
  view: {
    phone: true,
    title: '',
    url: '',
  },
  show: false,
  config: { webConfig: [], codeMap: {} },
};

const webSlice = createSlice({
  name: 'web',
  initialState,
  reducers: {
    syncWebUrlAction(state, action: PayloadAction<string>) {
      state.view.url = action.payload;
    },
    syncWebShowAction(state, action: PayloadAction<boolean>) {
      state.show = action.payload;
    },
    syncWebPhoneAction(state, action: PayloadAction<boolean>) {
      state.view.phone = action.payload;
    },
    syncWebAction(state, action: PayloadAction<{ phone?: boolean; title: string; url: string }>) {
      state.view = action.payload;
    },
    syncWebConfigAction(state, action: PayloadAction<{ webConfig: Web.SettingItem[]; codeMap: Web.CodeMap }>) {
      state.config = action.payload;
    },
  },
});

export const { syncWebUrlAction, syncWebShowAction, syncWebPhoneAction, syncWebAction, syncWebConfigAction } = webSlice.actions;

export const closeWebAction = createAsyncThunk<void, void, AsyncThunkConfig>('web/closeWebAction', async (_, { dispatch, getState }) => {
  try {
    const {
      web: { view },
    } = getState();
    batch(() => {
      dispatch(syncWebAction({ ...view, url: '', title: '' }));
      dispatch(syncWebShowAction(false));
    });
  } catch (error) {}
});

export const openWebAction = createAsyncThunk<void, { phone?: boolean; title: string; url: string }, AsyncThunkConfig>(
  'web/openWebAction',
  async (data, { dispatch, getState }) => {
    try {
      const {
        web: { view },
      } = getState();
      batch(() => {
        dispatch(syncWebAction({ ...view, ...data }));
        dispatch(syncWebShowAction(true));
      });
    } catch (error) {}
  }
);

export const addWebAction = createAsyncThunk<void, Web.SettingItem, AsyncThunkConfig>(
  'web/addWebAction',
  async (web, { dispatch, getState }) => {
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
  }
);

export const updateWebAction = createAsyncThunk<void, Web.SettingItem, AsyncThunkConfig>(
  'web/updateWebAction',
  async (web, { dispatch, getState }) => {
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
  }
);

export const deleteWebAction = createAsyncThunk<void, string, AsyncThunkConfig>(
  'web/deleteWebAction',
  async (url, { dispatch, getState }) => {
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
  }
);

export const setWebConfigAction = createAsyncThunk<void, Web.SettingItem[], AsyncThunkConfig>(
  'web/setWebConfigAction',
  async (webConfig, { dispatch, getState }) => {
    try {
      const codeMap = Utils.GetCodeMap(webConfig, 'url');
      dispatch(syncWebConfigAction({ webConfig, codeMap }));
    } catch (error) {}
  }
);

export default webSlice.reducer;
