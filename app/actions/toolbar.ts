import { GetState, Dispatch } from '../reducers/types';

export const DELETE_ALL = 'DELETE_ALL';

export function enableDeleteAll() {
  return {
    type: DELETE_ALL
  };
}

export function deleteAll() {
  return {
    type: DELETE_ALL
  };
}
