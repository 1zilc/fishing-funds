import { configureStore as createStore } from '@reduxjs/toolkit';
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createRootReducer from '../reducers';
import { Store, StoreState } from '../reducers/types';

const rootReducer = createRootReducer();
const enhancer = applyMiddleware(thunk);

function configureStore(initialState?: StoreState): Store {
  return createStore({
    reducer: rootReducer,
  });
}

export default { configureStore };
