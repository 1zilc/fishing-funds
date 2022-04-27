import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TypedThunk } from '@/store';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Enums from '@/utils/enums';

export interface WebState {
  view: {
    show: boolean;
    phone?: boolean;
    title: string;
    url: string;
  };
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
  return (dispatch, getState) => {
    try {
      const codeMap = Utils.GetCodeMap(webConfig, 'url');

      dispatch(syncWebConfig({ webConfig, codeMap }));
      Utils.SetStorage(CONST.STORAGE.WEB_SETTING, webConfig);
    } catch (error) {}
  };
}

export default webSlice.reducer;
