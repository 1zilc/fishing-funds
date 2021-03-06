import { AnyAction } from 'redux';
import { CHANGE_DELETE_STATUS, TOGGLE_DELETE_STATUS } from '../actions/toolbar';

export interface ToolbarState {
  deleteStatus: boolean;
}

export default function toolbar(
  state = {
    deleteStatus: false,
  },
  action: AnyAction
) {
  switch (action.type) {
    case CHANGE_DELETE_STATUS:
      return {
        ...state,
        deleteStatus: action.payload,
      };
    case TOGGLE_DELETE_STATUS:
      return {
        ...state,
        deleteStatus: !state.deleteStatus,
      };
    default:
      return state;
  }
}
