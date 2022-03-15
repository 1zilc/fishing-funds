import { ThunkAction } from '@/reducers/types';
import { WebState } from '@/reducers/web';

export const SET_WEB_URL = 'SET_WEB_URL';
export const SET_WEB = 'SET_WEB';

export function setWebUrlAction(url: string): ThunkAction {
  return (dispatch, getState) => {
    try {
      dispatch({ type: SET_WEB_URL, payload: url });
    } catch (error) {}
  };
}
export function setWebAction(data: WebState): ThunkAction {
  return (dispatch, getState) => {
    try {
      dispatch({ type: SET_WEB, payload: data });
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
