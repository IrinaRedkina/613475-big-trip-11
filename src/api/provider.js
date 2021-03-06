import EventAdapter from '../models/event-adapter.js';
import {nanoid} from 'nanoid';
import {StorageKey} from '../const';

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedEvents = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getEvents() {
    if (isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          const items = createStoreStructure(events.map((event) => event.toRAW()));

          this._store.setItems(items);

          return events;
        });
    }

    const storeEvents = Object.values(this._store.getItems());

    return Promise.resolve(EventAdapter.parseEvents(storeEvents));
  }

  updateEvent(id, event) {
    if (isOnline()) {
      return this._api.updateEvent(id, event)
        .then((newEvent) => {
          this._store.setItem(newEvent.id, newEvent.toRAW());

          return newEvent;
        });
    }

    const localEvent = EventAdapter.clone(Object.assign(event, {id}));

    this._store.setItem(id, localEvent.toRAW());

    return Promise.resolve(localEvent);
  }

  createEvent(event) {
    if (isOnline()) {
      return this._api.createEvent(event)
        .then((newEvent) => {
          this._store.setItem(newEvent.id, newEvent.toRAW());

          return newEvent;
        });
    }

    const localNewEventId = nanoid();
    const localNewEvent = EventAdapter.clone(Object.assign(event, {id: localNewEventId}));

    this._store.setItem(localNewEvent.id, localNewEvent.toRAW());

    return Promise.resolve(localNewEvent);
  }

  deleteEvent(id) {
    if (isOnline()) {
      return this._api.deleteEvent(id)
        .then(() => this._store.removeItem(id));
    }

    this._store.removeItem(id);

    return Promise.resolve();
  }

  sync() {
    if (isOnline()) {
      const storeEvents = Object.values(this._store.getItems());

      return this._api.sync(storeEvents)
        .then((response) => {
          const createdEvents = getSyncedEvents(response.created);
          const updatedEvents = getSyncedEvents(response.updated);

          const items = createStoreStructure([...createdEvents, ...updatedEvents]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(`Sync data failed`);
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setItems(offers, StorageKey.OFFERS);

          return offers;
        });
    }

    const storeOffers = this._store.getItems(StorageKey.OFFERS);

    return Promise.resolve(storeOffers);
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._store.setItems(destinations, StorageKey.DESTIONATIONS);

          return destinations;
        });
    }

    const storeDestinations = this._store.getItems(StorageKey.DESTIONATIONS);

    return Promise.resolve(storeDestinations);
  }
}
