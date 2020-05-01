import AbstractSmartComponent from './abstract-smart-component';
import {createTypeListMarkup} from './event-type-markup';
import {createOffersMarkup} from './event-offer-markup';
import {createCitiesMarkup, createDestinationMarkup} from './event-destination-markup';
import {toUpperCaseFirstLetter, isInteger} from '../utils/common';
import {types, getAvailableOptions, generateSelectedOptionsDefault} from '../mock/event';
import {destinations} from '../mock/destination';
import flatpickr from 'flatpickr';

const INPUT_DATE_FORMAT = `d/m/y H:i`;
const MAX_OPTIONS_COUNT = 5;

const createFavoriteMarkup = (isFavorite) => {
  return (
    `<input id="event-favorite" class="event__favorite-checkbox visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
    <label class="event__favorite-btn" for="event-favorite">
      <span class="visually-hidden">${isFavorite ? `Remove from favorite` : `Add to favorite`}</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>`
  );
};

const createDateTimeMarkup = (startDate, endDate) => {
  return (
    `<div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time">
        From
      </label>
      <input class="event__input  event__input--time" id="event-start-time" type="text" name="event-start-time" value="${startDate}">
      &mdash;
      <label class="visually-hidden" for="event-end-time">
        To
      </label>
      <input class="event__input  event__input--time" id="event-end-time" type="text" name="event-end-time" value="${endDate}">
    </div>`
  );
};

const createEditEventTemplate = (event, data = {}) => {
  const {isFavorite, dueDateStart, dueDateEnd} = event;
  const {price, type, typePlaceholder, city, destination, options, isOffersShowing, isDestinationShowing, selectedOptions} = data;

  const isShowingDetails = isDestinationShowing || isOffersShowing;
  const title = `${toUpperCaseFirstLetter(type)} ${typePlaceholder}`;

  return (
    `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">

          <div class="event__type-wrapper">
            <label class="event__type event__type-btn" for="event-type-toggle">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle" type="checkbox">
            ${createTypeListMarkup(type)}
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination">
              ${title}
            </label>
            <input
              class="event__input event__input--destination"
              id="event-destination"
              type="text"
              name="event-destination"
              value="${city ? city : ``}"
              list="destination-list"
            >
            <datalist id="destination-list">
              ${createCitiesMarkup()}
            </datalist>
          </div>

          ${createDateTimeMarkup(dueDateStart, dueDateEnd)}

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input event__input--price"
              id="event-price"
              type="text"
              name="event-price"
              value="${price ? price : ``}"
            >
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          ${createFavoriteMarkup(isFavorite)}

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        ${isShowingDetails ? `
        <section class="event__details">
          ${isOffersShowing ? createOffersMarkup(options, selectedOptions) : ``}
          ${isDestinationShowing ? createDestinationMarkup(destination) : ``}
        </section>
        ` : ``}
      </form>
    </li>`
  );
};


export default class EditEvent extends AbstractSmartComponent {
  constructor(event) {
    super();

    this._event = event;
    this._type = event.type;
    this._typePlaceholder = types[event.type][`placeholder`];
    this._city = event.city;
    this._destination = event.destination;
    this._options = event.options;
    this._selectedOptions = Object.assign({}, event.selectedOptions);
    this._isOffersShowing = event.options.length > 0;
    this._isDestinationShowing = event.destination ? true : false;
    this._price = event.price;

    this._submitHandler = null;
    this._closeEditHandler = null;
    this._favoriteHandler = null;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditEventTemplate(this._event, {
      type: this._type,
      typePlaceholder: this._typePlaceholder,
      city: this._city,
      options: this._options,
      destination: this._destination,
      selectedOptions: this._selectedOptions,
      isOffersShowing: this._isOffersShowing,
      isDestinationShowing: this._isDestinationShowing,
      price: this._price
    });
  }

  _showDestinationBlock(destination) {
    return destination && (destination.description.length > 0 || destination.photos.length) > 0;
  }

  reset() {
    const event = this._event;

    this._type = event.type;
    this._typePlaceholder = types[event.type][`placeholder`];
    this._city = event.city;
    this._destination = event.destination;
    this._options = event.options;
    this._selectedOptions = Object.assign({}, event.selectedOptions);
    this._isOffersShowing = event.options.length > 0;
    this._isDestinationShowing = event.destination ? true : false;
    this._price = event.price;

    this.rerender();
  }

  recoveryListeners() {
    this._subscribeOnEvents();
    this.setSubmitHandler(this._submitHandler);
    this.setClickCloseHandler(this._closeEditHandler);
    this.setClickFavoriteHandler(this._favoriteHandler);
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__input--price`)
      .addEventListener(`change`, (evt) => {
        this._price = Number(evt.target.value);

        this.getElement().querySelector(`.event__save-btn`)
          .disabled = !isInteger(this._price);
      });

    const typeList = element.querySelector(`.event__type-list`);

    if (typeList) {
      typeList.addEventListener(`change`, (evt) => {
        const type = evt.target.value;
        const options = getAvailableOptions(types[type][`offers`]).slice(0, MAX_OPTIONS_COUNT);

        this._type = type;
        this._typePlaceholder = evt.target.dataset.placeholder;
        this._options = options;
        this._isOffersShowing = options.length > 0;
        this._selectedOptions = generateSelectedOptionsDefault(options);

        this.rerender();
      });
    }

    const optionsList = element.querySelector(`.event__available-offers`);

    if (optionsList) {
      optionsList.addEventListener(`change`, (evt) => {
        this._selectedOptions[evt.target.dataset.option] = evt.target.checked;

        this.rerender();
      });
    }

    const cityInput = element.querySelector(`.event__input--destination`);

    if (cityInput) {
      cityInput.addEventListener(`change`, (evt) => {
        const city = evt.target.value;

        this._city = city;
        this._destination = destinations[city];
        this._isDestinationShowing = destinations[city] ? true : false;

        this.rerender();
      });
    }
  }

  setClickCloseHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
      this.reset();
      handler();
    });

    this._closeEditHandler = handler;
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
      handler(evt);
    });

    this._submitHandler = handler;
  }

  setClickFavoriteHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`)
      .addEventListener(`change`, (evt) => {
        handler(evt);
      });

    this._favoriteHandler = handler;
  }


  initDateInput() {
    this.getElement().querySelectorAll(`.event__input--time`).forEach((field) => {
      flatpickr(field, {
        enableTime: true,
        dateFormat: INPUT_DATE_FORMAT,
        defaultDate: new Date(field.value)
      });
    });
  }
}
