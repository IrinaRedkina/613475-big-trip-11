const STORE_EVENT_PREFIX = `bigtrip-events-localstorage`;
const STORE_EVENT_VER = `v1`;
const STORE_OFFERS_PREFIX = `bigtrip-offers-localstorage`;
const STORE_OFFERS_VER = `v1`;
const STORE_DESTINATIONS_PREFIX = `bigtrip-destinations-localstorage`;
const STORE_DESTINATIONS_VER = `v1`;

export const StorageKey = {
  EVENTS: `${STORE_EVENT_PREFIX}-${STORE_EVENT_VER}`,
  OFFERS: `${STORE_OFFERS_PREFIX}-${STORE_OFFERS_VER}`,
  DESTIONATIONS: `${STORE_DESTINATIONS_PREFIX}-${STORE_DESTINATIONS_VER}`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const TypeGroup = {
  'TRANSFER': `transfer`,
  'ACTIVITI': `activity`
};

export const typesByGroup = {
  'transfer': [`taxi`, `bus`, `train`, `flight`, `ship`, `transport`, `drive`],
  'activity': [`restaurant`, `sightseeing`, `check-in`]
};

export const placeholderGroup = {
  'transfer': `to`,
  'activity': `in`
};

export const addEventButton = document.querySelector(`.trip-main__event-add-btn`);
