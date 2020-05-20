import {StorageName} from '../const';

export default class Store {
  constructor(storage) {
    this._storage = storage;
  }

  getItems(storageKey = StorageName.EVENTS) {
    try {
      return JSON.parse(this._storage.getItem(storageKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(items, storageKey = StorageName.EVENTS) {
    this._storage.setItem(
        storageKey,
        JSON.stringify(items)
    );
  }

  setItem(itemKey, value, storageKey = StorageName.EVENTS) {
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

  removeItem(itemKey, storageKey = StorageName.EVENTS) {
    const store = this.getItems(storageKey);

    delete store[itemKey];

    this._storage.setItem(
        storageKey,
        JSON.stringify(store)
    );
  }
}
