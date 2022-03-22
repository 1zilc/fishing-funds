import { ThunkAction } from '@/reducers/types';
import * as Helpers from '@/helpers';
import * as Utils from '@/utils';
import * as CONST from '@/constants';

export const SET_WEB_URL = 'SET_WEB_URL';
export const SET_WEB = 'SET_WEB';
export const SYNC_WEB_CONFIG = 'SYNC_WEB_CONFIG';

export function setWebUrlAction(url: string): ThunkAction {
  return (dispatch, getState) => {
    try {
      dispatch({ type: SET_WEB_URL, payload: url });
    } catch (error) {}
  };
}
export function setWebAction(data: { show: boolean; phone?: boolean; title: string; url: string }): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        web: { view },
      } = getState();
      dispatch({ type: SET_WEB, payload: { ...view, ...data } });
    } catch (error) {}
  };
}
export function closeWebAction(): ThunkAction {
  return (dispatch, getState) => {
    try {
      dispatch(setWebAction({ url: '', title: '', phone: false, show: false }));
    } catch (error) {}
  };
}
export function openWebAction(data: { phone?: boolean; title: string; url: string }): ThunkAction {
  return (dispatch, getState) => {
    try {
      dispatch(setWebAction({ ...data, show: true }));
    } catch (error) {}
  };
}
export function addWebAction(web: Web.SettingItem): ThunkAction {
  return (dispatch, getState) => {
    try {
      const { webConfig } = Helpers.Web.GetWebConfig();
      const cloneWebConfig = Utils.DeepCopy(webConfig);
      const exist = cloneWebConfig.find((item) => web.url === item.url);
      if (!exist) {
        cloneWebConfig.push(web);
      }
      dispatch(setWebConfigAction(cloneWebConfig));
    } catch (error) {}
  };
}

export function updateWebAction(web: Web.SettingItem): ThunkAction {
  return (dispatch, getState) => {
    try {
      const { webConfig } = Helpers.Web.GetWebConfig();
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

export function deleteWebAction(url: string): ThunkAction {
  return (dispatch, getState) => {
    try {
      const { webConfig } = Helpers.Web.GetWebConfig();

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

export function setWebConfigAction(webConfig: Web.SettingItem[]): ThunkAction {
  return async (dispatch, getState) => {
    try {
      const codeMap = Helpers.Web.GetCodeMap(webConfig);
      dispatch({ type: SYNC_WEB_CONFIG, payload: { webConfig, codeMap } });
      Utils.SetStorage(CONST.STORAGE.WEB_SETTING, webConfig);
    } catch (error) {}
  };
}
