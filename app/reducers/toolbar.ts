import { Action } from 'redux';
import { DELETE_ALL } from '../actions/toolbar';

export default function toolbar(
  state = {
    deleteStatus: false
  },
  action: Action<string>
) {
  switch (action.type) {
    case DELETE_ALL:
      return {
        ...state,
        deleteStatus: true
      };
    default:
      return state;
  }
}
