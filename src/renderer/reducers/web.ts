import { Reducer } from '@/reducers/types';
import { SET_WEB_URL, SET_WEB } from '@/actions/web';
import * as Enums from '@/utils/enums';

export interface WebState {
  show: boolean;
  phone?: boolean;
  title: string;
  url: string;
}

const web: Reducer<WebState> = (
  state = {
    show: false,
    phone: false,
    title: '',
    url: '',
  },
  action
) => {
  switch (action.type) {
    case SET_WEB_URL:
      return {
        ...state,
        url: action.payload,
      };
    case SET_WEB:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default web;
