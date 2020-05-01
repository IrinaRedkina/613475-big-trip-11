import {getRandomNumber, getRandomElement} from '../utils/common';
import {cities, destinations} from './destination';
import {offers} from './offer';

const MAX_PRICE_VALUE = 500;
const MAX_OPTIONS_COUNT = 5;

const types = {
  'taxi': {
    group: `transfer`,
    placeholder: `to`,
    offers: [`luggage`, `comfort`, `uber`]
  },
  'bus': {
    group: `transfer`,
    placeholder: `to`,
    offers: []
  },
  'train': {
    group: `transfer`,
    placeholder: `to`,
    offers: [`luggage`, `comfort`, `meal`, `seats`, `train`]
  },
  'ship': {
    group: `transfer`,
    placeholder: `to`,
    offers: [`luggage`, `comfort`, `meal`, `seats`, `breakfast`, `lunch`]
  },
  'transport': {
    group: `transfer`,
    placeholder: `to`,
    offers: [`rent`, `uber`]
  },
  'drive': {
    group: `transfer`,
    placeholder: `to`,
    offers: [`rent`]
  },
  'flight': {
    group: `transfer`,
    placeholder: `to`,
    offers: [`luggage`, `comfort`, `meal`, `seats`, `breakfast`, `lunch`]
  },
  'check-in': {
    group: `activity`,
    placeholder: `in`,
    offers: [`comfort`, `meal`, `breakfast`, `lunch`]
  },
  'sightseeing': {
    group: `activity`,
    placeholder: `in`,
    offers: [`breakfast`, `lunch`]
  },
  'restaurant': {
    group: `activity`,
    placeholder: `in`,
    offers: [`meal`, `seats`]
  }
};

const TypePlaceholder = {
  'transfer': `to`,
  'activity': `in`
};

const typeList = Object.keys(types);

const getAvailableOptions = (offerIds) => {
  return offers.filter((offer) => offerIds.indexOf(offer.id) !== -1);
};

const generateSelectedOptionsDefault = (options) => {
  const optionIds = options.map((item) => item.id);
  const selectedOptions = {};

  optionIds.forEach((option) => {
    selectedOptions[option] = false;
  });

  return selectedOptions;
};

const generateSelectedOptions = (options) => {
  const optionIds = options.map((item) => item.id);
  const selectedOptions = {};

  optionIds.forEach((option) => {
    selectedOptions[option] = Math.random() > 0.5;
  });

  return selectedOptions;
};

const getRandomDates = () => {
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffDays = sign * getRandomNumber(1, 5);
  const diffHours = getRandomNumber(1, 30);
  const diffMinutes = getRandomNumber(1, 59);

  const start = new Date();
  start.setDate(start.getDate() + diffDays);
  start.setHours(start.getHours() + diffDays);
  start.setMinutes(start.getMinutes() + diffDays);

  const end = new Date(start);
  end.setHours(end.getHours() + diffHours);
  end.setMinutes(end.getMinutes() + diffMinutes);

  return {start, end};
};

const generateEvent = () => {
  const type = getRandomElement(typeList);
  const typeData = types[type];
  const city = getRandomElement(cities);
  const destination = destinations[city];
  const options = getAvailableOptions(typeData[`offers`]).slice(0, MAX_OPTIONS_COUNT);
  const selectedOptions = generateSelectedOptions(options);
  const randomDates = getRandomDates();

  return {
    type,
    city,
    destination,
    options,
    selectedOptions,
    price: getRandomNumber(0, MAX_PRICE_VALUE),
    isFavorite: Math.random() > 0.5,
    dueDateStart: randomDates.start,
    dueDateEnd: randomDates.end,
  };
};

const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};

export {
  generateEvent,
  generateEvents,
  getAvailableOptions,
  generateSelectedOptionsDefault,
  types, typeList, TypePlaceholder
};
