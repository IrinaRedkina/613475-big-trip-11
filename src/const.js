const STORE_EVENT_PREFIX = `bigtrip-events-localstorage`;
const STORE_EVENT_VER = `v1`;
const STORE_OFFERS_PREFIX = `bigtrip-offers-localstorage`;
const STORE_OFFERS_VER = `v1`;
const STORE_DESTINATIONS_PREFIX = `bigtrip-destinations-localstorage`;
const STORE_DESTINATIONS_VER = `v1`;

export const StorageName = {
  EVENTS: `${STORE_EVENT_PREFIX}-${STORE_EVENT_VER}`,
  OFFERS: `${STORE_OFFERS_PREFIX}-${STORE_OFFERS_VER}`,
  DESTIONATIONS: `${STORE_DESTINATIONS_PREFIX}-${STORE_DESTINATIONS_VER}`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const typesByGroup = {
  'transfer': [`taxi`, `bus`, `train`, `flight`, `ship`, `transport`, `drive`],
  'activity': [`restaurant`, `sightseeing`, `check-in`]
};

export const placeholderGroup = {
  'transfer': `to`,
  'activity': `in`
};
