import { Reducer } from '@/reducers/types';
import { SET_WEB_URL, SET_WEB, SYNC_WEB_CONFIG } from '@/actions/web';

export interface WebState {
  view: {
    show: boolean;
    phone?: boolean;
    title: string;
    url: string;
  };

  config: { webConfig: Web.SettingItem[]; codeMap: Web.CodeMap };
}

const web: Reducer<WebState> = (
  state = {
    view: {
      show: false,
      phone: true,
      title: '',
      url: '',
    },
    config: { webConfig: [], codeMap: {} },
  },
  action
) => {
  switch (action.type) {
    case SET_WEB_URL:
      return {
        ...state,
        view: {
          ...state.view,
          url: action.payload,
        },
      };
    case SET_WEB:
      return {
        ...state,
        view: action.payload,
      };
    case SYNC_WEB_CONFIG:
      return {
        ...state,
        config: action.payload,
      };
    default:
      return state;
  }
};

export default web;
