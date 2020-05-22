import {StorageKey} from '../const';

export default class Store {
  constructor(storage) {
    this._storage = storage;
  }

  getItems(storageKey = StorageKey.EVENTS) {
    try {
      return JSON.parse(this._storage.getItem(storageKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(items, storageKey = StorageKey.EVENTS) {
    this._storage.setItem(
        storageKey,
        JSON.stringify(items)
    );
  }

  setItem(itemKey, value, storageKey = StorageKey.EVENTS) {
    const store = this.getItems(storageKey);

    this._storage.setItem(
        storageKey,
        JSON.stringify(
            Object.assign({}, store, {
              [itemKey]: value
            })
        )
    );
  }

  removeItem(itemKey, storageKey = StorageKey.EVENTS) {
    const store = this.getItems(storageKey);

    delete store[itemKey];

    this._storage.setItem(
        storageKey,
        JSON.stringify(store)
    );
  }
}
