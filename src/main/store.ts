import ElectronStore from 'electron-store';

export default class LocalStore {
  readonly encryptionKey = '1zilc';

  storeMap: Record<Store.StoreType, ElectronStore>;

  constructor() {
    this.storeMap = {
      config: new ElectronStore({ name: 'config', encryptionKey: this.encryptionKey }),
      cache: new ElectronStore({ name: 'cache', encryptionKey: this.encryptionKey }),
      state: new ElectronStore({ name: 'state', encryptionKey: this.encryptionKey }),
    };
  }

  get(storeType: Store.StoreType, key: string, defaultValue?: unknown) {
    return this.storeMap[storeType].get(key, defaultValue);
  }

  set(storeType: Store.StoreType, key: string, value: any) {
    this.storeMap[storeType].set(key, value);
  }

  cover(storeType: Store.StoreType, value: any) {
    this.storeMap[storeType].set(value);
  }

  delete(storeType: Store.StoreType, key: string) {
    this.storeMap[storeType].delete(key);
  }

  getStore(storeType: Store.StoreType) {
    return this.storeMap[storeType].store;
  }
}
