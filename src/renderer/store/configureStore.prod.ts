import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createRootReducer from '../reducers';
import { Store, StoreState } from '../reducers/types';

const rootReducer = createRootReducer();
const enhancer = applyMiddleware(thunk, promise);

function configureStore(initialState?: StoreState): Store {
  return createStore(rootReducer, enhancer);
}

export default { configureStore };
