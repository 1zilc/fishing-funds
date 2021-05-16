import configureStoreDev from './configureStore.dev';
import configureStoreProd from './configureStore.prod';

const { production } = window.contextModules.process;
const selectedConfigureStore = production
  ? configureStoreProd
  : configureStoreDev;

export const { configureStore } = selectedConfigureStore;

export const { history } = selectedConfigureStore;
